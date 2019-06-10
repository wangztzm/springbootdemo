Ext.define('Ming.view.fee.chargefee.ChargeFeeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-chargefee-chargefee',

    /**
     * 初始化处理。获取费用配置，重新配置表格等。
     */
    afterRender: function () {
        var me = this,
            view = me.getView(),
            feeItemAndBizOpeStore = me.getStore('feeItemAndBizOpe'),
            queryFeeConfigCallback = function (result) {
                if (result.success && result.resultCode === '0') {
                    var me = this,
                        msg,
                        feeItemList = result.data.feeItemList;

                    // 根据费用配置项重新配置表格
                    me.reconfigureGridByFeeConfig(feeItemList);
                    // 加载费用项信息
                    feeItemAndBizOpeStore.loadRawData(feeItemList);
                    // 查看是动态计费还是静态计费，如果为静态计费需要隐藏计费取消按钮。
                    var autoFeeType = result.data.autoFeeType;
                    if (view.bizOpe != 'MP') {
                        if (autoFeeType != 'S') {
                            me.lookupReference('cancelFeeBtn').show();
                        }
                    }
                    // 如果有指定运单信息，则查询运单计费信息
                    if (view.billList) {
                        me.onPickWaybillSearch(view.billList);
                    }
                    // 设置客户
                    me.setSettlementCustomer();
                } else {
                    msg = '获取费用配置失败。' + result.msg;
                    Ext.Msg.alert('失败', msg);
                }
            };

        if (feeItemAndBizOpeStore.getCount() > 0) {
            queryFeeConfigCallback();
        } else {
            EU.RS({
                url: UrlUtil.get('api/fee/chargeHandling', 'queryFeeConfig'),
                scope: me,
                target: view,
                jsonData: {
                    data: {
                        bizOpe: view.bizOpe,
                        domInt: view.domInt,
                        expImp: view.expImp
                    }
                },
                callback: queryFeeConfigCallback
            });
        }
    },

    /**
     * 根据费用配置项重新配置表格
     */
    reconfigureGridByFeeConfig: function (feeItemList) {
        var me = this,
            grid = me.lookupReference('gridPanel'),
            columns = grid.config.columns,
            newColumns = [],
            len = columns.length, i,
            index,
            columns4Add = [],
            item;
        for (i = 0; i < len; i++) {
            item = columns[i];
            if (item.dataIndex == 'sumFee') {
                index = i;
                break;
            }
        }
        Ext.each(feeItemList, function (feeItem) {
            columns4Add.push({
                text: feeItem.feeShortNm,
                dataIndex: feeItem.feeId + '',
                width: 64,
                sortable: false
            });

        });
        newColumns = newColumns.concat(columns.splice(0, index));
        newColumns = newColumns.concat(columns4Add);
        newColumns = newColumns.concat(columns);
        grid.reconfigure(newColumns);
    },

    /*
    * 单个运单的费用查询
     */
    onPickWaybill: function () {
        var me = this,
            form = me.lookupReference('searchForm'),
            waybillNumberCmp = me.lookupReference('waybillnumber'),
            billId = waybillNumberCmp.getBillId(),
            pickWaybillCallBack = function (result) {
                if (result && result.data) {
                    waybillNumberCmp.getStockPreTextfieldCmp().reset();
                    waybillNumberCmp.getStockNoTextfieldCmp().reset();
                    waybillNumberCmp.getStockPreTextfieldCmp().focus();
                } else {
                    EU.toastWarn('运单不存在！');
                }
            },
            options = {
                success: pickWaybillCallBack
            };
        if (form.isValid()) {
            me.onPickWaybillSearch(billId, options);
        }
    },

    /*
     * 运单费用查询
     */
    onPickWaybillSearch: function (billIds, options) {
        var me = this,
            view = me.getView(),
            billIdsTmp = [],
            url = UrlUtil.get('api/fee/chargeHandling', 'queryAwbFee'),
            params = {
                data: {
                    billIds: null,
                    bizOpe: view.bizOpe,
                    domInt: view.domInt,
                    expImp: view.expImp
                }
            },
            msg,
            operation = options && options.operation ? options.operation : '',
            scope = options && options.scope ? options.scope : me;

        if (Ext.isArray(billIds)) {
            Ext.each(billIds, function (item) {
                billIdsTmp.push(item.billId);
            });
            billIdsTmp = billIdsTmp.join(',');
            params.data.awbFeeQueryList = billIds;
        } else {
            billIdsTmp = billIds;
        }
        params.data.billIds = billIdsTmp;

        return new Ext.Promise(function (resolve, reject) {

            EU.RS({
                url: url,
                timeout: 3 * 60 * 1000,
                scope: me,
                target: view,
                jsonData: params,
                callback: function (result) {
                    if (result.success && result.resultCode === '0') {
                        me.resetInfo(result.data, operation);
                        if (options && Ext.isFunction(options.success)) {
                            options.success.apply(scope, [result]);
                        }
                        resolve(result);
                    } else {
                        msg = '查询失败。' + result.msg;
                        EU.toastErrorInfo(msg);
                        reject(result);
                    }
                }
            });
        });
    },

    /*
    * 批量挑取运单
     */
    onBatchPickWaybill: function (btn) {
        var me = this,
            view = me.getView();
        PU.openModule({
            title: '批量挑单',
            xtype: 'fee-chargefee-batchpickwaybill',
            width: 1080,
            height: 500,
            scope: me,
            pcfg: {
                domInt: view.domInt,
                expImp: view.expImp
            },
            callback: me.onPickWaybillSearch
        });
    },

    /*
     * 费用编辑
     */
    onFeeEditClick: function (btn) {
        var me = this,
            record = btn.ownerCt.$widgetRecord,
            recordData = record.data,
            view = me.getView();
        PU.openModule({
            title: '费用编辑',
            xtype: 'fee-common-feeedit',
            draggable: true,
            height: 500,
            width: 600,
            resizable: true,
            scope: this,
            animateTarget: btn,
            pcfg: {
                viewModel: {
                    data: {
                        stockType: recordData.awbInfo.stockTypeId,
                        stockPre: recordData.awbInfo.stockPre,
                        stockNo: recordData.awbInfo.stockNo,
                        theFeeRawData: recordData, // 费用原始数据
                        theFeeRecordId: record.getId(),
                        customerReadOnly: true
                    },
                    stores: {
                        feeItemAndBizOpe: me.getViewModel().getStore('feeItemAndBizOpe')
                    }
                }
            },
            callback: me.onFeeEditSubmit
        });
    },

    /**
     * 费用编辑页面的提交费用
     */
    onFeeEditSubmit: function (dialog) {
        var me = this,
            feeEidtForm = dialog.lookupReference('feeEidt'),
            feeEditViewModel = feeEidtForm.getViewModel(),
            authority,
            msg,
            store = me.lookupReference('gridPanel').getStore(),
            curEditRecord = store.getById(feeEditViewModel.getData().theFeeRecordId), // 修改的记录
            curEditRecordData = curEditRecord.data,
            // 费用编辑确定后的处理。重新设置运单费用信息，重新合计。
            confirmSuccessCallBack = function (msg, fee) {
                var newPayMode = fee.feeBas.payMode,
                    newPayModeDsc = newPayMode === 'CS' ? '现结' : newPayMode === 'MP' ? '记账' : '',
                    newFeeRate = 0,
                    newFeeDetailList = fee.feeDetailList,
                    newSumFee = 0,
                    removeRecords,
                    hasFeeRate = false;
                // 如果当前编辑记录状态为未核对、且新的计费方式改变。则将已有的同运单、同状态、同计费方式的记录删掉。
                if (curEditRecordData.feeStatus == '' && curEditRecordData.payMode != newPayMode) {
                    removeRecords = store.queryBy(function (record) {
                        var data = record.data;
                        if (record.getId() != curEditRecord.getId() &&
                            data.feeStatus == '' && data.billId == curEditRecordData.billId && data.payMode == newPayMode) {
                            return true;
                        }
                        return false;
                    });
                    store.remove(removeRecords.items);
                }

                // 更新记录数据
                // 重新设置费用项、费率、费用合计、付款方式等
                var feeItemAndBizOpeStore = me.getStore('feeItemAndBizOpe'),
                    feeItems = feeItemAndBizOpeStore.getData().items;
                Ext.each(feeItems, function (item) {
                    var itemData = item.data, feeId = itemData.feeId, feeIdStr = feeId + '';
                    var feeDetail = Ext.Array.findBy(newFeeDetailList, function (feeDetail) {
                        return feeId == feeDetail.feeId;
                    });
                    if (feeDetail) {
                        curEditRecord.set(feeIdStr, feeDetail.fee);
                    } else {
                        curEditRecord.set(feeIdStr, 0);
                    }
                });
                Ext.each(newFeeDetailList, function (feeDetail) {
                    var itemFee = Number(feeDetail.fee);
                    newSumFee = NumberUtil.plus(newSumFee, itemFee);
                    if (hasFeeRate == false && (feeDetail.feeShortNm == '出处费' || feeDetail.feeShortNm == '进处费')) {
                        newFeeRate = feeDetail.feeRate;
                        hasFeeRate = true;
                    }
                });

                curEditRecord.set('feeDetailList', newFeeDetailList);
                curEditRecord.set('feeRate', newFeeRate);
                curEditRecord.set('payMode', newPayMode);
                curEditRecord.set('payModeDsc', newPayModeDsc);
                curEditRecord.set('sumFee', newSumFee);

                // 合计总费用
                me.total();
                if (msg) {
                    EU.toastInfo(msg);
                }
                feeEidtForm.up('window').close();
            };

        // 验证费用权限
        authority = PU.hasFunction('FEEMODIFY');
        if (!authority) {
            EU.toastWarn('你没有修改费用权限！');

            return;
        }
        if (feeEidtForm.isValid()) {
            var formValues,
                feeEditStore = feeEidtForm.lookupReference('feeEditGrid').getStore(),
                items,
                fee = {},
                feeBas = {},
                feeDetailList = [],
                feeDetail;
            formValues = feeEidtForm.getValues();

            // 费用信息
            Ext.copy(feeBas, curEditRecordData, 'billId, feeRecId, customerId, customerName, curPcs, curFeeWt');
            Ext.copy(feeBas, formValues, 'payMode');

            // 详细费用信息
            items = feeEditStore.getData().items;
            Ext.Array.each(items, function (item) {
                var itemData = item.data;
                feeDetail;

                if (!Ext.isEmpty(itemData.feeId)) {
                    feeDetail = {
                        feeRate: 0,
                        feeWt: 0,
                        fee: 0
                    };
                    Ext.copy(feeDetail, itemData, 'recId, feeShortNm, feeRemark, calWay, feeRate, feeWt, fee, feeRecId, feeId');
                    feeDetailList.push(feeDetail);
                }
            });

            fee = {feeBas: feeBas, feeDetailList: feeDetailList};
            // feeRecId存在即已核对的情况下，调用后台直接修改费用。
            if (feeBas.feeRecId > 0) {
                EU.RS({
                    url: UrlUtil.get('api/fee/balance', 'updateHistoryFee'),
                    scope: me,
                    target: dialog,
                    jsonData: {
                        data: [fee]
                    },
                    callback: function (result) {
                        var msg = result.msg;
                        if (result.success && result.resultCode === '0') {
                            msg = '费用修改成功。';
                            confirmSuccessCallBack(msg, fee);
                        } else {
                            msg = '费用修改失败。' + result.msg;
                            EU.toastErrorInfo(msg);
                        }
                    }
                });
            } else {
                // 判断费用信息是否被编辑过
                var needCheck = 'N';
                if (feeBas.payMode != curEditRecordData.payMode) {
                    needCheck = 'Y';
                } else if ((feeDetailList.length > 0 && !curEditRecordData.feeDetailList) ||
                    feeDetailList.length < curEditRecordData.feeDetailList.length) {
                    needCheck = 'Y';
                } else {
                    Ext.each(curEditRecordData.feeDetailList,
                        function (feeDetailRawData) {
                            var feeDetail = Ext.Array.findBy(feeDetailList, function (feeDetail) {
                                return feeDetailRawData.feeId == feeDetail.feeId;
                            });
                            if (!feeDetail) {
                                needCheck = 'Y';

                                return;
                            }
                            if (feeDetailRawData.fee != feeDetail.fee) {
                                needCheck = 'Y';

                                return;
                            }
                        }
                    );
                }
                feeBas.needCheck = needCheck;
                if (needCheck == 'Y') {
                    msg = '费用信息已被临时保存。';
                }
                confirmSuccessCallBack(msg, fee);
            }
        }
    },

    /*
    * 查询所有运单的历史信息，相同计费点的历史按钮设置背景色为红色。
    */
    setHisFee: function () {
        var me = this,
            view = me.getView(),
            params,
            url,
            grid = me.lookupReference('gridPanel'),
            store = grid.getStore(),
            records = grid.getStore().getData().items,
            billIds = [];
        if (store.getCount() == 0) {
            return;
        }
        Ext.each(records, function (record) {
            billIds.push(record.data.billId);
        });
        params = {data: {billIds: billIds.join(','), delOper: null}};
        url = UrlUtil.get('api/fee/chargeHandling', 'queryFeeBas');
        EU.RS({
            url: url, scope: me, jsonData: params, target: view,
            callback: function (result) {
                if (result.success && result.resultCode == '0') {
                    var resultData = result.data;
                    Ext.each(records, function (record) {
                        delete record.data.sameBizOpe;
                        delete record.data.hasHistory;
                    });
                    Ext.each(resultData, function (item) {
                        Ext.each(records, function (record) {
                            var recordData = record.data;
                            if (item.billId == recordData.billId) {
                                if (item.bizOpe == view.bizOpe) {
                                    recordData.sameBizOpe = true;
                                }
                                recordData.hasHistory = true;
                            }
                        });
                    });
                    grid.reconfigure();
                } else {
                    var msg = '查询运单历史计费失败。' + result.msg;
                    EU.toastErrorInfo(msg);
                }
            }
        });
    },

    /*
    * 历史计费
    */
    onHistoryClick: function (btn) {
        var me = this,
            record = btn.$widgetRecord,
            params,
            url;
        params = {data: record.data.billId};
        url = UrlUtil.get('api/fee/chargeHandling', 'queryHistoricalBilling');
        EU.RS({
            url: url, scope: me, jsonData: params,
            callback: function (result) {
                if (result.success && result.resultCode == '0') {
                    if (!result.data) {
                        EU.toastInfo('无历史计费。');

                        return;
                    }
                    PU.openModule({
                        title: '历史计费',
                        xtype: 'fee-chargefee-historicalbilling',
                        height: 350,
                        width: 800,
                        scope: me,
                        params: {
                            data: result.data
                        }
                    });
                }
            }
        });
    },

    /*
    * 运单修改
    */
    onWaybillClick: function (btn) {
        var me = this,
            record = btn.ownerCt.$widgetRecord,
            recordData = record.data,
            view = me.getView();
        PU.openModule({
            title: '运单信息修改',
            xtype: 'fee-chargefee-waybillinfomodify',
            width: 600,
            height: 400,
            scope: me,
            pcfg: {
                viewModel: {
                    data: {
                        theWaybill: recordData.awbInfo,
                        feeRecId: recordData.feeRecId
                    }
                },
                domInt: view.domInt,
                expImp: view.expImp
            },
            callback: me.afterWaybillModifySubmit
        });
    },

    /*
     * 运单信息保存。存在即已核对的情况下，运单信息修改后需要挑单。
     */
    afterWaybillModifySubmit: function (params) {
        var me = this,
            billId = params.billId,
            feeRecId = params.feeRecId;

        // 运单保存后重新挑单，再保存费用。
        var pickWaybillCallBack =
                function () {
                    var me = this,
                        view = me.getView(),
                        gridPanel = me.lookupReference('gridPanel'),
                        store = gridPanel.getStore(),
                        recordIndex,
                        recordData,
                        feeList = [],
                        fee = {},
                        feeBas = {};

                    if (!feeRecId > 0) {
                        return;
                    }

                    recordIndex = store.findBy(function (record) {
                        var data = record.data;
                        if (data.billId == billId && data.feeRecId == feeRecId) {
                            return true;
                        }
                        return false;
                    });

                    if (recordIndex < 0) {
                        return;
                    }
                    recordData = store.getAt(recordIndex).data;
                    Ext.copy(feeBas, recordData, 'billId, customerId, customerName, payMode, feeRecid, feeStatus, curFeeWt, cargoNm');

                    feeBas.bizOpe = view.bizOpe;
                    feeBas.needCheck = 'N';
                    feeBas.objType = 'OPE';
                    feeBas.opeDepartId = cfg.sub.opedepartid;
                    feeBas.filePcs = recordData.pcs;

                    fee.feeBas = feeBas;
                    fee.feeDetailList = recordData.feeDetailList;

                    feeList.push(fee);
                    // 费用保存
                    me.chargeFee(feeList);
                },
            options = {
                success: pickWaybillCallBack,
                operation: 'updateAwb'
            };

        // 重新挑单
        me.onPickWaybillSearch(billId, options);
    },

    /*
     * 费用保存
    */
    save: function () {
        var me = this,
            feeList,
            // 重新挑单
            chargeFeeSuccessCallback = function () {
                var billIds = [];
                Ext.each(feeList, function (item) {
                    billIds.push(item.feeBas.billId);
                });
                me.onPickWaybillSearch(billIds.join(','));
            },
            chargeFeeOptions = {
                success: chargeFeeSuccessCallback,
                scope: me
            };

        feeList = me.getFeeList();
        if (!feeList || feeList.length == 0) {
            EU.toastWarn('没有要保存的记录。');
            return;
        }

        // 保存费用
        me.chargeFee(feeList, chargeFeeOptions);
    },

    /*
     * 计费取消
    */
    cancelFee: function () {
        var me = this,
            selections = me.getSelectionFees(),
            i, len = selections.length,
            selectionData,
            feeBas,
            cancelFeeBasList = [],
            // 重新挑单
            cancelChargeFeeSuccessCallback = function () {
                var billIds = [];
                Ext.each(cancelFeeBasList, function (item) {
                    billIds.push(item.billId);
                });
                me.onPickWaybillSearch(billIds.join(','));
            },
            cancelChargeFeeOptions = {
                success: cancelChargeFeeSuccessCallback,
                scope: me
            };

        if (!selections || selections.length == 0) {
            EU.toastWarn('请选择要取消计费的记录。');
            return;
        }

        for (i = 0; i < len; i++) {
            selectionData = selections[i].data;
            if (selectionData.feeStatus == 'A') {
                feeBas = {
                    billId: selectionData.billId,
                    feeRecId: selectionData.feeRecId
                };
                cancelFeeBasList.push(feeBas);
            }
        }

        if (cancelFeeBasList.length == 0) {
            EU.toastWarn('没有要取消计费的记录。');
            return;
        }

        // 取消计费
        me.cancelChargeFee(cancelFeeBasList, cancelChargeFeeOptions);
    },

    /*
     * 核对并现结结算
     */
    saveAndCsBalance: function () {
        var me = this,
            selections = me.getSelectionFees(),
            feeList,
            chargeFeeResultFeeList, // 费用保存返回的结果
            csBalanceFeeList = [], // 现结结算的费用列表
            chargeFeeResolve = function (param) {
                chargeFeeResultFeeList = param.data;
                var billIds = [],
                    pickWaybillOptions = {
                        operation: 'saveAndCsBalance'
                    };
                Ext.each(feeList, function (item) {
                    billIds.push(item.feeBas.billId);
                });
                return me.onPickWaybillSearch(billIds.join(','), pickWaybillOptions);
            },
            chargeFeeReject = function (param) {
                var msg;
                if (param) {
                    msg = '费用保存失败。';
                    msg = param ? msg + param.msg : msg;
                }
                return Promise.reject(msg);
            },
            doBalance = function () {
                var view = me.getView(),
                    payWayCmp = me.lookupReference('payWay'),
                    payWay = payWayCmp.getValue(),
                    csBalanceCount = 0,
                    totalCsBalanceAmount = 0;
                // 添加验证客户的累计记账金额是否已经超过预付余额
                Ext.each(chargeFeeResultFeeList, function (item) {
                    if (item.feeBas.payMode == 'MP') {
                        // IfTotalMpMoreThanPrePay(this.txtCusCode.Text.Trim());
                        return false;
                    }
                });

                Ext.each(chargeFeeResultFeeList, function (item) {
                    if (item.feeBas.feeRecId > 0 && item.feeBas.payMode == 'CS') {
                        Ext.each(item.feeDetailList, function (item) {
                            totalCsBalanceAmount = NumberUtil.plus(totalCsBalanceAmount, item.fee);
                        });
                        csBalanceCount = csBalanceCount++;
                        csBalanceFeeList.push(item);
                    }
                });

                if (csBalanceFeeList.length == 0) {
                    EU.toastWarn('没有要现结结算的记录。');
                    return;
                }

                if (payWay == 'MULTIMODE' && totalCsBalanceAmount <= 0) {
                    EU.toastInfo('结算金额为0，不能选择多种结算方式！');
                    return;
                }

                // 弹出结算方式输入框
                if (payWay == 'MULTIMODE') {
                    PU.openModule({
                        title: '付款方式',
                        xtype: 'fee-common-payway',
                        height: 350,
                        width: 800,
                        scope: me,
                        pcfg: {
                            opeMode: 'A',
                            params: {
                                options: csBalanceFeeList
                            },
                            viewModel: {
                                data: {
                                    totalBalanceAmount: totalCsBalanceAmount
                                }
                            }
                        },
                        callback: me.payWaySave
                    });
                } else {
                    me.beforeBalanceFee(null, csBalanceFeeList);
                }
            },
            allReject = function (param) {
                if (param) {
                    var msg = param ? (param.msg ? param.msg : param) : '';
                    msg = '失败。' + msg;
                    EU.toastErrorInfo(msg);
                }
            };
        if (!selections || selections.length == 0) {
            EU.toastWarn('请选择要保存的记录。');
            return;
        }
        feeList = me.getFeeList();
        // 费用保存、重新挑单、现结结算
        me.chargeFee(feeList).then(
            // 费用保存成功
            function (param) {
                return chargeFeeResolve(param);
            },
            // 费用保存失败
            function (param) {
                return chargeFeeReject(param);
            }).then(
            // 重新挑单成功
            function () {
                doBalance();
            }).catch(
            function (error) {
                allReject(error);
            });
    },

    /*
     * 付款方式弹出框，模板方法。弹出框确认按钮调用。
     */
    payWaySave: function (params) {
        var me = this,
            balanceInfoPayWay = params.balanceInfo,
            balanceFeeList = params.options;
        me.beforeBalanceFee(balanceInfoPayWay, balanceFeeList);
    },

    /*
     * 重置页面信息。重置计费表格的数据、重查历史、重新合计。设置默认的结算客户。
     * operation：可选值：updateAwb:运单修改后的挑单处理 saveAndCsBalance:保存并现结结算
     */
    resetInfo: function (data, operation) {
        var me = this;
        me.processRawData(data);
        me.mergeData(data);
        if (operation != 'updateAwb') {
            me.setHisFee();
        }
        me.total();
        if (operation != 'saveAndCsBalance') {
            me.setSettlementCustomer();
        }
    },

    /*
     * 处理运单信息，合计运单总费用，找出各个计费项目的费用，找出费率等。
     */
    processRawData: function (dataList) {
        var me = this,
            awbInfo,
            payMode,
            feeItemAndBizOpeStore = me.getStore('feeItemAndBizOpe'),
            feeItems = feeItemAndBizOpeStore.getData().items,
            sumFee,
            feeDetailList;
        Ext.each(dataList, function (dataItem) {
            sumFee = 0;
            awbInfo = dataItem.awbInfo;
            payMode = dataItem.payMode;
            feeDetailList = dataItem.feeDetailList;

            dataItem.sBillId = awbInfo.stockPre + '-' + awbInfo.stockNo;
            dataItem.awbInfo_fltInfo = awbInfo.fltInfo;
            dataItem.awbInfo_cargoNm = awbInfo.cargoNm;
            dataItem.awbInfo_specOpeId = awbInfo.specOpeId;
            if (dataItem.feeRecId <= 0) {
                dataItem.feeStatus = '';
                dataItem.feeStatusChn = '未核对';
                dataItem.feeRecId = 0;
            } else {
                dataItem.feeStatus = 'A';
                dataItem.feeStatusChn = '已核对';
            }
            dataItem.payModeDsc = payMode === 'CS' ? '现结' : payMode === 'MP' ? '记账' : '';

            // 每个费用项的费用
            Ext.each(feeDetailList, function (feeDetail) {
                sumFee = NumberUtil.plus(sumFee, feeDetail.fee);
            });
            Ext.each(feeItems, function (feeItem) {
                var feeItemData = feeItem.data, feeId = feeItemData.feeId, feeIdStr = feeId + '';
                var feeDetail = Ext.Array.findBy(feeDetailList, function (feeDetail) {
                    return feeId == feeDetail.feeId;
                });
                if (feeDetail) {
                    dataItem[feeIdStr] = feeDetail.fee;
                } else {
                    dataItem[feeIdStr] = 0;
                }
            });

            dataItem.sumFee = sumFee;
        });
    },

    /*
     * 设置结算客户
    */
    setSettlementCustomer: function () {
        var me = this,
            view = me.getView(),
            grid = me.lookupReference('gridPanel'),
            store = grid.getStore(),
            selections = grid.getSelection(),
            unCheckedRecord = store.findRecord('feeStatus', ''), // 未核对的记录
            settlementCustomer = me.lookupReference('settlementCustomer'),
            settlementCustomerName = me.lookupReference('settlementCustomerName'),
            customerId,
            customerName;

        // 如果页面配置参数有指定结算客户代码、结算客户名称，则设置对应值。
        if (view.customerId || view.customerName) {
            customerId = view.customerId;
            customerName = view.customerName;
        } else if (store.getCount() > 0) {
            if (selections && selections.length > 0) {
                customerId = selections[0].data.customerId;
                customerName = selections[0].data.customerName;
            } else if (unCheckedRecord) {
                customerId = unCheckedRecord.data.customerId;
                customerName = unCheckedRecord.data.customerName;
            } else {
                customerId = store.getAt(0).data.customerId;
                customerName = store.getAt(0).data.customerName;
            }
        }
        settlementCustomer.setValue(customerId);
        settlementCustomerName.setValue(customerName);
    },

    /*
     * 清除结算客户
    */
    clearSettlementCustomer: function () {
        var me = this,
            settlementCustomer = me.lookupReference('settlementCustomer'),
            settlementCustomerName = me.lookupReference('settlementCustomerName');
        settlementCustomer.setValue();
        settlementCustomerName.setValue();
    },

    /*
     * 合并运单费用数据
    */
    mergeData: function (dataList) {
        var me = this,
            gridPanel = me.lookupReference('gridPanel'),
            store = gridPanel.getStore(),
            extraRecords = [],
            unExistsData = [],
            equalFunction = function (item1, item2, operate) {
                if (operate == 'billId') {
                    if (item1.billId == item2.billId) {
                        return true;
                    }
                } else if (operate == 'billIdPayModFeeRecId') {
                    if (item1.billId == item2.billId && item1.payMode == item2.payMode && item1.feeRecId == item2.feeRecId) {
                        return true;
                    }
                } else if (operate == 'billIdPayMod') {
                    if (item1.billId == item2.billId && item1.payMode == item2.payMode) {
                        return true;
                    }
                }
                return false;
            };
        dataList = dataList ? dataList : [];
        if (!Ext.isArray(dataList)) {
            var array = [];
            array.push(dataList);
            dataList = array;
        }

        // 去掉相同billId，列表中多余的记录。
        Ext.each(store.getData().items, function (record) {
            var data = record.data, findData, contain;
            contain = Ext.Array.some(dataList, function (item) {
                return equalFunction(data, item, 'billId');
            });
            if (contain) {
                findData = Ext.Array.findBy(dataList, function (item) {
                    return equalFunction(data, item, 'billIdPayModFeeRecId');
                });
                if (!findData) {
                    findData = Ext.Array.findBy(dataList, function (item) {
                        return equalFunction(data, item, 'billIdPayMod');
                    });
                }
                if (!findData) {
                    extraRecords.push(record);
                }
            }
        });
        store.remove(extraRecords);

        // 新增记录或更新已有记录的数据
        Ext.each(dataList, function (item) {
            var recordIndex, record;
            recordIndex = store.findBy(function (record) {
                var data = record.data;
                return equalFunction(data, item, 'billIdPayModFeeRecId');
            });
            if (recordIndex == -1) {
                recordIndex = store.findBy(function (record) {
                    var data = record.data;
                    return equalFunction(data, item, 'billIdPayMod');
                });
            }
            if (recordIndex > -1) {
                record = store.getAt(recordIndex);
                record.data = item;
                record.commit();
            } else {
                unExistsData.push(item);
            }
        });
        if (unExistsData.length > 0) {
            store.add(unExistsData);
        }
    },

    /*
     * 合计
     */
    total: function () {
        var me = this,
            viewModel = me.getViewModel(),
            records = me.lookupReference('gridPanel').getStore().getData().items,
            // 现结票数
            csNumber = 0,
            // 现结金额
            csAmount = 0,
            // 记账票数
            mpNumber = 0,
            // 记账金额
            mpAmount = 0,
            // 总票数
            sumNumber = 0,
            // 总金额
            sumAmount = 0;

        Ext.each(records,
            function (item) {
                var data = item.data;
                // 现结
                if (data.payMode == 'CS') {
                    csNumber++;
                    csAmount = NumberUtil.plus(csAmount, data.sumFee);
                }
                // 记账
                if (data.payMode == 'MP') {
                    mpNumber++;
                    mpAmount = NumberUtil.plus(mpAmount, data.sumFee);
                }
            }
        );

        // 合计
        sumNumber = csNumber + mpNumber;
        sumAmount = NumberUtil.plus(csAmount, mpAmount);

        viewModel.set('csNumber', csNumber);
        viewModel.set('csAmount', csAmount);
        viewModel.set('mpNumber', mpNumber);
        viewModel.set('mpAmount', mpAmount);
        viewModel.set('sumNumber', sumNumber);
        viewModel.set('sumAmount', sumAmount);
    },

    /*
     * 费用保存
     */
    chargeFee: function (feeList, options) {
        var me = this,
            view = me.getView(),
            scope = options && options.scope ? options.scope : me,
            doChargeFee = function (resolve, reject) {
                var url = UrlUtil.get('api/fee/chargeHandling', 'chargeFee'),
                    params,
                    msg;
                params = {
                    data: {
                        bizOpe: view.bizOpe,
                        businessSeq: view.businessSeq,
                        chargeFeeItemList: feeList
                    }
                };
                EU.RS({
                    url: url, scope: me, jsonData: params,
                    callback: function (result) {
                        if (result.success && result.resultCode === '0') {
                            msg = '保存计费成功。';
                            EU.toastInfo(msg);
                            if (options && Ext.isFunction(options.success)) {
                                options.success.apply(scope, [result]);
                            }
                            resolve(result);
                        } else {
                            msg = '保存计费失败。' + result.msg;
                            EU.toastErrorInfo(msg);
                            if (options && Ext.isFunction(options.failure)) {
                                options.failure.apply(scope);
                            }
                            reject(result);
                        }
                    }
                });
            };

        return new Ext.Promise(function (resolve, reject) {
            var checkEnableToSaveResolve = function () {
                    return me.checkAwbCustomerSame(feeList);
                },
                checkAwbCustomerSameResolve = function () {
                    doChargeFee(resolve, reject);
                };

            if (!feeList || feeList.length == 0) {
                reject();
            }

            me.checkEnableToSave(feeList).then(
                function () {
                    return checkEnableToSaveResolve();
                }
            ).then(
                // 验证通过，调用后台保存。
                function () {
                    checkAwbCustomerSameResolve();
                }
            ).catch(function (error) {
                reject(error);
            });
        });
    },

    /*
     * 计费取消
     */
    cancelChargeFee: function (feeList, options) {
        var me = this,
            url = UrlUtil.get('api/fee/balance', 'cancelChargeFee'),
            params,
            scope = options && options.scope ? options.scope : me,
            msg;

        if (!feeList || feeList.length == 0) {
            return;
        }

        params = {
            data: feeList
        };
        EU.RS({
            url: url, scope: me, jsonData: params,
            callback: function (result) {
                if (result.success && result.resultCode === '0') {
                    msg = '取消计费成功。';
                    EU.toastInfo(msg);
                    if (options && Ext.isFunction(options.success)) {
                        options.success.apply(scope);
                    }
                } else {
                    msg = '取消计费失败。' + result.msg;
                    EU.toastErrorInfo(msg);
                    if (options && Ext.isFunction(options.failure)) {
                        options.failure.apply(scope);
                    }
                }
            }
        });
    },

    /*
     * 费用保存前检查客户信息
     */
    checkEnableToSave: function (feeList) {
        var isMpCusIdSame = true, // 月结客户ID是否一致
            cusId,
            i, len, fee, feeBas, sumFee = 0, warnMsg;

        return new Ext.Promise(function (resolve, reject) {
            if (!feeList || feeList.length == 0) {
                resolve();
            }
            len = feeList.length;

            for (i = 0; i < len; i++) {
                fee = feeList[i];
                feeBas = fee.feeBas;
                Ext.each(fee.feeDetailList, function (feeItem) {
                    var itemFee = Number(feeItem.fee);
                    sumFee = NumberUtil.plus(sumFee, feeItem.fee);
                });
                if (sumFee == 0) {
                    continue;
                }
                if (feeBas.payMode == 'MP') {
                    if (!feeBas.customerId) {
                        warnMsg = '月结客户的客户ID不能为空！';
                        break;
                    } else if (cusId && feeBas.customerId != cusId) {
                        isMpCusIdSame = false;
                    } else {
                        cusId = feeBas.customerId;
                    }
                } else if (feeBas.payMode == 'CS') {
                    if (!feeBas.customerName) {
                        warnMsg = '现结客户的客户名称不能为空！';
                        break;
                    }
                }
            }

            if (warnMsg) {
                new Ext.Promise(function (resolve1, reject1) {
                    EU.showMsg({
                        title: '警告信息',
                        message: warnMsg,
                        icon: Ext.Msg.WARNING,
                        callback: function (btn) {
                            if (btn === 'ok') {
                                reject1();
                            }
                        }
                    });
                }).then(
                    function () {
                        reject();
                    },
                    function () {
                        reject();
                    });
            } else if (!isMpCusIdSame) {
                new Ext.Promise(function (resolve1, reject1) {
                    EU.showMsg({
                        title: '确认',
                        message: '月结客户ID不一致，是否继续保存？',
                        option: 3,
                        callback: function (btn) {
                            if (btn === 'cancel') {
                                reject1();
                            }
                            resolve1();
                        }
                    });
                }).then(
                    function () {
                        resolve();
                    },
                    function () {
                        reject();
                    });
            } else {
                resolve();
            }
        });
    },

    /*
     * 判断需保存的费用的运单代理人是否一致，不一致则给用户提示。注意判断的是运单的代理人，而不是要提交的feeList里的代理人。
     */
    checkAwbCustomerSame: function (feeList) {
        var me = this,
            i,
            len,
            fee,
            feeBas,
            customerId,
            customerIds = {},
            msg,
            store = me.lookupReference('gridPanel').getStore();

        return new Ext.Promise(function (resolve, reject) {
            var recordData;
            if (!feeList || feeList.length == 0) {
                resolve();
            }
            len = feeList.length;

            for (i = 0; i < len; i++) {
                fee = feeList[i];
                feeBas = fee.feeBas;
                recordData = store.findRecord('billId', feeBas.billId).data;
                customerId = recordData.customerId;
                if (!customerIds[customerId]) {
                    customerIds[customerId] = Ext.String.format('[运单号{0}][运单客户编码{1}]', feeBas.billId, customerId);
                }
            }

            if (Ext.Object.getSize(customerIds) > 1) {
                msg = Ext.Object.getValues(customerIds);
                msg = msg.join('<br>');
                msg = '客户不一致，是否继续保存？<br>' + msg;
                new Ext.Promise(function (resolve1, reject1) {
                    EU.showMsg({
                        title: '确认',
                        message: msg,
                        option: 3,
                        callback: function (btn) {
                            if (btn === 'cancel') {
                                reject1();
                            }
                            resolve1();
                        }
                    });
                }).then(
                    function () {
                        resolve();
                    },
                    function () {
                        reject();
                    });
            } else {
                resolve();
            }
        });
    },

    /*
     * 结算前处理
     */
    beforeBalanceFee: function (balanceInput, balanceFeeList) {
        var me = this,
            ifHasMultiCustomer = false, // 是否多个结算客户一起结算
            uniqueCustumerID, // 唯一的结算客户
            balance = {
                balanceOpe: {},
                balanceFees: [],
                balanceDetails: []
            },
            balanceFee,
            payWayCmp = me.lookupReference('payWay'),
            payWay = payWayCmp.getValue(),
            settlementCustomer = me.lookupReference('settlementCustomer'),
            i, len = balanceFeeList.length,
            fee,
            totalCsBalanceAmount = 0;

        // 合并已有结算信息
        Ext.merge(balance, balanceInput);

        if (settlementCustomer.isVisible && settlementCustomer.getValue()) {
            balance.balanceOpe.moneyOper = settlementCustomer.getValue();
        }

        for (i = 0; i < len; i++) {
            fee = balanceFeeList[i];
            // 只结算现结的流水
            if (fee.feeBas.feeRecId > 0 && fee.feeBas.payMode == 'CS') {
                Ext.each(fee.feeDetailList, function (item) {
                    totalCsBalanceAmount = NumberUtil.plus(totalCsBalanceAmount, item.fee);
                });
                balanceFee = {
                    feeRecId: fee.feeBas.feeRecId
                };
                balance.balanceFees.push(balanceFee);

                // 判断是否有多个结算客户
                if (payWay == 'PREPAY' || payWay == 'MULTIMODE') {
                    if (!ifHasMultiCustomer) {
                        if (!uniqueCustumerID) {
                            uniqueCustumerID = fee.customerId;
                        } else if (uniqueCustumerID != fee.customerId) {
                            ifHasMultiCustomer = true;
                        }
                    }
                }
            }
        }

        if (payWay == 'PREPAY') {
            balance.prePayAmount = -totalCsBalanceAmount;
        }
        if (payWay != 'MULTIMODE') {
            balance.balanceDetails = balance.balanceDetails && balance.balanceDetails.length > 0 ? balance.balanceDetails : [];
            balance.balanceDetails.push(
                {
                    payWay: payWay,
                    payAmount: totalCsBalanceAmount
                }
            );
        }

        if (balance.prePayAmount < 0) {
            if (ifHasMultiCustomer) {
                EU.toastWarn('多个结算客户，付款方式不能为预付。');
                return;
            }
            balance.customerId = uniqueCustumerID;
            // 查询预付余额信息 TODO
        }

        var balanceSuccessCallback = function (balanceResult) {
                // 删除结算的记录。
                var me = this,
                    view = me.getView(),
                    gridPanel = me.lookupReference('gridPanel'),
                    store = gridPanel.getStore(),
                    records = me.lookupReference('gridPanel').getStore().getData().items,
                    removeRecords = [],
                    feeBas,
                    recordData;
                // 清除记录
                Ext.each(balanceFeeList, function (fee) {
                    feeBas = fee.feeBas;
                    Ext.each(records, function (record) {
                        recordData = record.data;
                        if (feeBas.feeRecId == recordData.feeRecId &&
                            feeBas.billId == recordData.billId &&
                            feeBas.payMode == recordData.payMode) {
                            removeRecords.push(record);
                        }
                    });
                });
                store.remove(removeRecords);
                // 重新合计
                me.total();
                // 清空结算人
                me.clearSettlementCustomer();
                // 出港计费或者进港计费，显示已结算页面，并查询结算信息。
                if (view.bizOpe == 'EFEE' || view.bizOpe == 'IFEE') {
                    me.showBalance(balanceResult.data.balanceOpe.balanceRecId);
                }
            },
            balanceOptions = {
                success: balanceSuccessCallback
            };

        // 结算
        me.doBalanceFee(balance, balanceOptions);
    },

    /*
     * 调用后台结算
     */
    doBalanceFee: function (balance, options) {
        var me = this,
            url = UrlUtil.get('api/fee/balance', 'balanceFee'),
            msg,
            scope = options && options.scope ? options.scope : me;
        EU.RS({
            url: url, scope: me,
            jsonData: balance,
            callback: function (result) {
                if (result.success && result.resultCode === '0') {
                    msg = '结算成功。';
                    EU.toastInfo(msg);
                    if (options && Ext.isFunction(options.success)) {
                        options.success.apply(scope, [result]);
                    }
                } else {
                    msg = '结算失败。' + result.msg;
                    EU.toastErrorInfo(msg);
                    if (options && Ext.isFunction(options.failure)) {
                        options.failure.apply(scope);
                    }
                }
            }
        });
    },

    /*
     * 显示已结算页面，如果指定了balanceRecId则查询结算信息。
     */
    showBalance: function (balanceRecId) {
        var me = this,
            view = me.getView();
        var tabPanel = view.up('tabpanel'),
            tab = tabPanel.child('fee-settlement-feesettled'),
            params;
        tabPanel.setActiveTab(tab);
        if (balanceRecId) {
            params = {
                balanceRecId: balanceRecId,
                bizOpe: view.bizOpe,
                objType: 'OPE'
            };
            tab.getController().queryBalancedFee(params);
        }
    },

    /*
     * 获取要提交的费用列表
     */
    getFeeList: function () {
        var me = this,
            view = me.getView(),
            fee,
            feeList = [],
            selections = me.getSelectionFees(),
            i, len = selections.length,
            selectionData,
            settlementCustomerId = me.lookupReference('settlementCustomer').getValue(),
            settlementCustomerName = me.lookupReference('settlementCustomerName').getValue();
        for (i = 0; i < len; i++) {
            selectionData = selections[i].data;
            fee = {
                feeBas: {},
                feeDetailList: []
            };
            fee.feeBas.customerId = settlementCustomerId;
            fee.feeBas.customerName = settlementCustomerName;
            Ext.copy(fee.feeBas, selectionData, 'billId, bizOpe, payMode, feeStatus, curPcs, curFeeWt, whsTime');
            Ext.copy(fee.feeBas, selectionData.awbInfo, 'cargoNm');
            fee.feeBas.filePcs = selectionData.awbInfo.pcs;
            fee.feeBas.bizOpe = view.bizOpe;
            fee.feeBas.needCheck = 'N';
            fee.feeBas.objType = 'OPE';
            fee.feeBas.feeRecId = selectionData.feeRecId ? selectionData.feeRecId : 0;
            fee.feeBas.opeDepartId = cfg.sub.opedepartid;
            fee.feeDetailList = selectionData.feeDetailList;

            feeList.push(fee);
        }
        return feeList;
    },

    /**
     * 设置选择的结算客户的名称
     */
    onSettlementCustomerChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            selectedRecord = combo.getSelectedRecord(),
            settlementCustomerName = me.lookupReference('settlementCustomerName');
        if (selectedRecord) {
            settlementCustomerName.setValue(selectedRecord.data.customerNameChn);
        }
    },

    /*
    * 合计单元格渲染处理
    */
    columnSummaryRenderer: function (value, summaryData, dataIndex, metaData) {
        metaData.tdStyle = 'font-weight: bold;';
        value = Ext.isNumber(value) ? value : 0;

        return Ext.String.format('{0}', value);
    },

    /*
     * 运单选择
     */
    onRowSelect: function (rowModel, record, index, eOpts) {
        var me = this,
            settlementCustomer = me.lookupReference('settlementCustomer'),
            settlementCustomerName = me.lookupReference('settlementCustomerName');
        settlementCustomer.setValue(record.data.customerId);
        settlementCustomerName.setValue(record.data.customerName);
    },

    /*
     * 全选
     */
    onSelectAll: function () {
        var me = this,
            grid = me.lookupReference('gridPanel');
        grid.getSelectionModel().selectAll();
    },

    /*
     * 全不选
     */
    onDeSelectAll: function () {
        var me = this,
            grid = me.lookupReference('gridPanel');
        grid.getSelectionModel().deselectAll();
    },

    /*
     * 清除
     */
    onRemove: function () {
        var me = this,
            grid = me.lookupReference('gridPanel'),
            selections = grid.getSelection();
        if (!selections || selections.length == 0) {
            EU.toastInfo('请选择要清除的记录。');
            return;
        }
        grid.getStore().remove(grid.getSelection());
        me.total();
        me.setSettlementCustomer();
    },

    /*
     * 获取选中的费用记录
     */
    getSelectionFees: function () {
        var me = this,
            grid = me.lookupReference('gridPanel');
        if (grid.selModel.getSelectionMode() == 'MULTI') {
            return grid.getSelection();
        }
        return grid.getStore().getData().items;
    },

    /*
     * 判断有未保存的数据
     */
    hasNotSavedFee: function () {
        var me = this,
            selections,
            hasNotSavedFee;
        selections = me.getSelectionFees();
        hasNotSavedFee = Ext.Array.some(selections, function (item) {
            return item.data.feeStatus === '' && item.data.sumFee > 0;
        });
        return hasNotSavedFee;
    }
});