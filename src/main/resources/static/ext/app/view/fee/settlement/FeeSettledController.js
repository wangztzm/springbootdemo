Ext.define('Ming.view.fee.settlement.FeeSettledController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-settlement-feesettled',
    requires: [
        'Ming.view.fee.settlement.InvoicePreview'
    ],

    /**
     * 初始化处理。获取费用配置，重新配置表格等。
     */
    afterRender: function () {
        var me = this;
        me.gridpanel = this.lookupReference('gridPanel');

        var view = me.getView(),
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
                    // 如果有指定运单信息，则查询运单已结算信息
                    if (view.billList) {
                        me.queryBalancedFee(me.getSearchParamsOnPageInit());
                    }
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
                dataIndex: feeItem.feeId,
                width: 64,
                sortable: false
            });

        });
        newColumns = newColumns.concat(columns.splice(0, index));
        newColumns = newColumns.concat(columns4Add);
        newColumns = newColumns.concat(columns);
        grid.reconfigure(newColumns);
    },

    /**
     * 查询
     */
    onSearchClick: function () {
        var me = this,
            form = me.lookupReference('searchForm');
        if (form.isValid()) {
            me.queryBalancedFee(me.getSearchParams());
        }
    },

    /**
     * 获取查询参数
     */
    getSearchParams: function () {
        var me = this,
            form = me.lookupReference('searchForm'),
            waybillnumber = me.lookupReference('waybillnumber'),
            billId = waybillnumber.getBillId(),
            serialnumber = me.lookupReference('serialnumber-fieldCt'),
            serialno = serialnumber.getSerialNoCmp().getValue(),
            dateField = serialnumber.getDateCmp().getValue(),
            userIdTextfield = serialnumber.getUserIdCmp().getValue(),
            chargeSeq,
            formValues,
            params;

        if (!!serialno & !!dateField & !!userIdTextfield) {
            chargeSeq = serialnumber.getSerialNumber();
        } else {
            chargeSeq = null;
        }
        formValues = form.getValues();
        params = {};
        delete formValues.stockTypeId;
        delete formValues.stockPre;
        delete formValues.stockNo;
        delete formValues.serialDate;
        delete formValues.userId;
        delete formValues.serialNo;

        Ext.apply(params, Ext.JSON.decode(Ext.JSON.encode(formValues)));
        params.billIds = billId;
        params.chargeSeq = chargeSeq;

        return params;
    },

    /**
     * 页面初期显示时，获取要执行已结算查询的查询参数。
     */
    getSearchParamsOnPageInit: function () {
        var me = this,
            view = me.getView(),
            billList = view.billList,
            billIdsTmp = [],
            params = {};
        if (Ext.isArray(billList)) {
            Ext.each(billList, function (item) {
                billIdsTmp.push(item.billId);
            });
            billIdsTmp = billIdsTmp.join(',');
        }
        params = {
            billIds: billIdsTmp
        };
        return params;
    },

    /**
     * 查询已结算费用
     */
    queryBalancedFee: function (params) {
        var me = this,
            store = me.getStore('feeSettleds');
        var url = UrlUtil.get('api', 'fee/balance/queryBalancedFeeInfo'),
            msg;
        EU.RS({
            url: url,
            scope: me,
            jsonData: params,
            callback: function (result) {
                if (result.success && result.resultCode === '0') {
                    var data = result.data;
                    me.processRawData(data);
                    store.loadRawData(data.balancedFeeMasterList);
                } else {
                    msg = '查询失败。' + result.msg;
                    EU.toastErrorInfo(msg);
                }
            }
        });
    },

    /*
     * 处理查询的数据，找出各个计费项目的费用等。
     */
    processRawData: function (data) {
        var me = this,
            feeItemAndBizOpeStore = me.getStore('feeItemAndBizOpe'),
            feeItems = feeItemAndBizOpeStore.getData().items,
            feeDetailList,
            balancedFeeMasterList = data.balancedFeeMasterList;
        Ext.each(balancedFeeMasterList, function (dataItem) {
            feeDetailList = dataItem.feeDetailList;

            // 每个费用项的费用
            Ext.each(feeItems, function (feeItem) {
                var feeItemData = feeItem.data, feeId = feeItemData.feeId, feeIdStr = feeId + '', feeDetail;
                if (feeDetailList) {
                    feeDetail = Ext.Array.findBy(feeDetailList, function (feeDetail) {
                        return feeId == feeDetail.feeId;
                    });
                }
                if (feeDetail) {
                    dataItem[feeIdStr] = feeDetail.fee;
                } else {
                    dataItem[feeIdStr] = 0;
                }
            });
        });
    },

    /**
     * 设置客户名称
     */
    onAwbPickNameChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            feeUnsettledPanel = me.getView(),
            selRecord = combo.findRecordByValue(newValue);
        if (selRecord) {
            var domInt = feeUnsettledPanel.getDomInt();
            combo.up('container').down('textfield[name=customerName]').setValue(selRecord.data.customerNameChn);
        }
    },

    /**
     * 修改付款方式
     */
    modifyBalance: function (btn) {
        var me = this,
            record = btn.ownerCt.$widgetRecord,
            recordData = record.data,
            view = me.getView(),
            params = {
                balanceDto: {
                    balanceOpe: {balanceRecId: recordData.balanceRecId},
                    balanceFees: [{
                        feeRecId: recordData.feeRecId,
                        balanceRecId: recordData.balanceRecId
                    }],
                    balanceDetails: []
                },
                opeMode: 'C' // A结算操作，B取消结算操作，C修改结算方式操作
            };
        EU.RS({
            url: UrlUtil.get('api/fee/balance', 'queryBalanceInfo'), scope: me, jsonData: params,
            callback: function (result) {
                var resultData = result && result.data ? result.data : '';
                if (result.success && result.resultCode === '0'
                    && resultData && resultData.balanceMasterList && resultData.balanceMasterList.length > 0
                    && resultData.balanceMasterList[0].balanceDetailList && resultData.balanceMasterList[0].balanceDetailList.length > 0) {
                    PU.openModule({
                        title: '付款方式',
                        xtype: 'fee-common-payway',
                        height: 500,
                        width: 800,
                        scope: me,
                        pcfg: {
                            opeMode: 'C',
                            viewModel: {
                                data: {
                                    totalBalanceAmount: result.data.balanceMasterList[0].sumModifyPayAmount,
                                    gridData: [result.data.balanceMasterList[0]],
                                    balance: params.balanceDto
                                }
                            }
                        },
                        callback: me.payWayModify
                    });
                } else {
                    EU.toastErrorInfo('查询结算明细信息失败！');
                }
            }
        });
    },

    /*
     * 付款方式弹出框，模板方法。弹出框确认按钮调用。
     */
    payWayModify: function (params) {
        var me = this,
            balanceInfoPayWay = params.balanceInfo;
        me.beforeModifyBalance(balanceInfoPayWay);
    },

    /*
     * 修改付款方式前的处理
     */
    beforeModifyBalance: function (balanceInput) {
        var me = this;
        me.doModifyBalance(balanceInput);
    },

    /*
     * 调用修改付款方式
     */
    doModifyBalance: function (balance, options) {
        var me = this,
            url = UrlUtil.get('api/fee/balance', 'modifyBalance'),
            msg,
            scope = options && options.scope ? options.scope : me;
        EU.RS({
            url: url, scope: me,
            jsonData: balance,
            callback: function (result) {
                if (result.success && result.resultCode === '0') {
                    msg = '修改付款方式成功。';
                    EU.toastInfo(msg);
                    if (options && Ext.isFunction(options.success)) {
                        options.success.apply(scope, [result]);
                    }
                } else {
                    msg = '修改付款方式失败。' + result.msg;
                    EU.toastErrorInfo(msg);
                    if (options && Ext.isFunction(options.failure)) {
                        options.failure.apply(scope);
                    }
                }
            }
        });
    },

    /**
     * 结算取消
     */
    cancelSettle: function () {
        var me = this,
            confirmCallback,
            view = me.getView(),
            grid,
            getQueryBalanceInfoAjax;
        getQueryBalanceInfoAjax = function (params) {
            var requestParams = {
                balanceDto: params,
                opeMode: 'B' // A结算操作，B取消结算操作，C修改结算方式操作
            };

            return new Ext.Promise(function (resolve, reject) {
                Ext.Ajax.request({
                    url: UrlUtil.get('api/fee/balance', 'queryBalanceInfo'),
                    jsonData: requestParams,
                    success: function (response) {
                        resolve(response);
                    },
                    failure: function (response) {
                        reject(response);
                    }
                });
            });
        };
        confirmCallback = function (btn) {
            if (btn === 'no') {
                return;
            }
            grid = me.lookupReference('gridPanel');
            var selections = grid.getSelection();
            if (!selections || selections.length == 0) {
                EU.toastInfo('请选择要取消结算的运单。');

                return;
            }
            var invoice = '',
                balanceMap = {},
                sumCancelBalanceFee = 0;
            Ext.each(selections, function (selection) {
                // 判断运单的费用状态：A为已计费，B为已结算，C为已打发票
                var selectionData = selection.data,
                    balanceRecId;
                if (selectionData.feeStatus == 'B') {
                    sumCancelBalanceFee = NumberUtil.plus(sumCancelBalanceFee, selectionData.sumFee);
                    balanceRecId = selectionData.balanceRecId;
                    if (!balanceMap[balanceRecId]) {
                        balanceMap[balanceRecId] = {
                            balanceOpe: {balanceRecId: balanceRecId},
                            balanceFees: [],
                            balanceDetails: [{balanceRecId: balanceRecId}] // 先假设只有一种结算方式
                        };
                    }
                    balanceMap[balanceRecId].balanceFees.push({
                        feeRecId: selectionData.feeRecId,
                        balanceRecId: balanceRecId
                    });
                } else {
                    invoice += selectionData.sBillId;
                }
            });
            if (invoice) {
                EU.toastInfo('已打发票,不能结算取消！');

                return;
            }
            if (Ext.Object.isEmpty(balanceMap)) {
                EU.toastInfo('请选择要取消结算的运单。');

                return;
            }

            // 取消金额计算及赋值
            var queryBalanceInfoAjaxList = [];
            Ext.Object.each(balanceMap, function (balanceRecId, value) {
                queryBalanceInfoAjaxList.push(getQueryBalanceInfoAjax(value));
            });
            // 付款方式弹框用数据
            var payWayCancelBalanceList = [];
            Ext.Promise.all(queryBalanceInfoAjaxList).then(function (responseList) {
                Ext.each(responseList, function (response) {
                    var responseJson = Ext.decode(response.responseText);
                    if (responseJson.resultCode != '0') {
                        EU.toastInfo(responseJson.msg);

                        return false;
                    }

                    var responseData = responseJson.data,
                        partialBalance = responseData.partialBalance,
                        multiPayway = responseData.multiPayway,
                        balanceMaster = responseData.balanceMasterList && responseData.balanceMasterList.length > 0 ? responseData.balanceMasterList[0] : [],
                        balanceRecId = response.request.jsonData.balanceDto.balanceFees[0].balanceRecId,
                        balance = balanceMap[balanceRecId],
                        drList = [];// 用于判断是否含有预付结算方式 TODO
                    // 现在知道该balance有多种结算方式，因此清空BalanceDetailEntiList，在弹出框中用户输入后再填充BalanceDetailEntiList
                    if (partialBalance && multiPayway) {
                        balance.balanceDetails = [];
                        // 每个结算balanceRecId下需要取消的结算金额
                        var cancelBalance = 0;
                        Ext.each(selections, function (selection) {
                            var selectionData = selection.data, sumFee = 0;
                            if (selectionData.balanceRecId == balanceRecId) {
                                sumFee = Ext.isNumeric(selectionData.sumFee) ? selectionData.sumFee : 0;
                                cancelBalance = NumberUtil.plus(sumFee, cancelBalance);
                                if (drList.length > 0) { // 说明含有预付结算方式，记录下结算客户，含有预付结算方式的结算记录必然只有一个结算客户，这由结算方法保证
                                    balance.customerId = selectionData.customerId;
                                }
                            }
                            balanceMaster.sumCancelPayAmount = cancelBalance;
                            payWayCancelBalanceList.push(balanceMaster);
                        });
                    } else if (partialBalance) {
                        if (drList.length > 0) { // 说明含有预付结算方式，记录下取消预付金额和结算客户，含有预付结算方式的结算记录必然只有一个结算客户，这由结算方法保证
                            Ext.each(selections, function (selection) {
                                var selectionData = selection.data, sumFee = 0;
                                if (selectionData.balanceRecId == balanceRecId) {
                                    sumFee = Ext.isNumeric(selectionData.sumFee) ? selectionData.sumFee : 0;
                                    balance.prePayAmount = NumberUtil.plus(sumFee, balance.prePayAmount);
                                    balance.customerId = selectionData.customerId;
                                }
                            });
                        }
                    } else {
                        // 全部取消结算的情况下，取消的预付金额为数据库中存储的金额
                        if (drList.length > 0) { // 说明含有预付结算方式，记录下取消预付金额和结算客户，含有预付结算方式的结算记录必然只有一个结算客户，这由结算方法保证
                            balance.prePayAmount = drList[0].payAmount;
                            Ext.each(selections, function (selection) {
                                var selectionData = selection.data;
                                if (selectionData.balanceRecId == balanceRecId) {
                                    balance.customerId = selectionData.customerId;

                                    return false;
                                }
                            });
                        }
                    }
                });

                // 结算取消
                var cancelBalanceList = [];
                Ext.Object.each(balanceMap, function (balanceRecId, value) {
                    cancelBalanceList.push(value);
                });
                // 有多种结算方式的，弹框编辑。
                if (payWayCancelBalanceList.length > 0) {
                    PU.openModule({
                        title: '付款方式',
                        xtype: 'fee-common-payway',
                        height: 500,
                        width: 800,
                        scope: me,
                        pcfg: {
                            opeMode: 'B',
                            viewModel: {
                                data: {
                                    totalBalanceAmount: sumCancelBalanceFee,
                                    gridData: payWayCancelBalanceList,
                                    balanceList: cancelBalanceList
                                }
                            }
                        },
                        callback: me.payWayCancel
                    });
                } else {
                    me.beforeCancelBalance(cancelBalanceList);
                }
            }).catch(function (response) {
                if (response.status === 404) {
                    EU.toastInfo(I18N.Failed404);
                } else if (response.status === 500) {
                    EU.toastInfo(I18N.Failed500);
                } else if (!Ext.isEmpty(response.responseText)) {
                    EU.toastInfo(Ext.String.format(I18N.FailedOtherCode, response.status, response.responseText));
                }
            });
        };

        EU.showMsg({
            title: '询问',
            message: '是否要做结算取消',
            option: 3,
            callback: confirmCallback
        });
    },

    /*
     * 付款方式弹出框，模板方法。弹出框确认按钮调用。
     */
    payWayCancel: function (params) {
        var me = this,
            balanceInfoPayWay = params.balanceInfo;
        me.beforeCancelBalance(balanceInfoPayWay);
    },

    /*
     * 取消核算前的处理
     */
    beforeCancelBalance: function (cancelBalanceList) {
        var me = this,
            cancelBalanceSuccessCallback = function (cancelBalanceResult) {
                var me = this;
                me.onSearchClick();
            },
            cancelBalanceOptions = {
                success: cancelBalanceSuccessCallback
            };

        me.doCancelBalance(cancelBalanceList, cancelBalanceOptions);
    },

    /*
     * 取消核算
     */
    doCancelBalance: function (cancelBalanceList, options) {
        var me = this,
            msg,
            scope = options && options.scope ? options.scope : me;
        EU.RS({
            url: UrlUtil.get('api/fee/balance', 'cancelBalance'),
            scope: me,
            jsonData: {data: cancelBalanceList},
            callback: function (result) {
                if (result.success && result.resultCode === '0') {
                    msg = '取消结算成功。';
                    EU.toastInfo(msg);
                    if (options && Ext.isFunction(options.success)) {
                        options.success.apply(scope, [result]);
                    }
                } else {
                    msg = '取消结算失败。' + result.msg;
                    EU.toastErrorInfo(msg);
                    if (options && Ext.isFunction(options.failure)) {
                        options.failure.apply(scope);
                    }
                }
            }
        });
    },


    /*
    * 合计单元格渲染处理
    */
    columnSummaryRenderer: function (value, summaryData, dataIndex, metaData) {
        metaData.tdStyle = 'font-weight: bold;';
        value = Ext.isNumber(value) ? value : 0;

        return Ext.String.format('{0}', value);
    },

    /**
     * 全选
     */
    selectAll: function () {
        var me = this,
            gridpanel = me.gridpanel;
        gridpanel.getSelectionModel().selectAll();
    },

    /**
     * 全不选
     */
    deSelectAll: function () {
        var me = this,
            gridpanel = me.gridpanel;
        gridpanel.getSelectionModel().deselectAll();
    },

    /**
     * 打印发票
     */
    onPrintInvoice: function (btn) {
        var me = this,
            view = me.getView(),
            gridPanel = me.gridpanel,
            selections = gridPanel.getSelection(),
            selectionRecordData,
            i,
            j,
            infoKind,
            taxRate = 6, // 税率
            remarks = [],
            chargeSeq,
            customerId, // 客户ID
            customerName, // 客户名称
            invoiceDetail,
            invoiceDetailList = [],
            // 打印预览数据
            invoice;

        if (!selections || selections.length == 0) {
            EU.toastInfo('请选择一条数据！');
            return;
        }

        for (i = 0; i < selections.length; i++) {
            selectionRecordData = selections[i].data;
            if (selectionRecordData.feeStatus == 'C') {
                EU.toastInfo('存在已经打过发票的记录，无法打印发票！');
                return;
            }
        }

        // 专用发票 0表示专用发票 2表示普通发票
        if (me.lookupReference('specialInvoice').getValue()) {
            infoKind = 0;
        } else {
            infoKind = 2;
        }

        // 收费项目
        for (i = 0; i < selections.length; i++) {
            selectionRecordData = selections[i].data;
            var feeDetailList = selectionRecordData.feeDetailList,
                feeDetailListLen = feeDetailList ? feeDetailList.length : 0,
                feeDetail;
            // 获取客户名称,取第一个不为空的客户名称
            if (!customerName) {
                customerId = selectionRecordData.customerId;
                customerName = selectionRecordData.customerName;
            }
            chargeSeq = selectionRecordData.chargeSeq;
            // 专用发票
            if (infoKind == 0 && chargeSeq && chargeSeq.length > 12) {
                remarks.push(chargeSeq.substring(6, 8) + '-' + Number(chargeSeq.substring(chargeSeq.length - 5)));
            } else {
                remarks.push(selectionRecordData.stockNo);
            }
            // 按收费项目分组统计,统计各收费项目的总费用，最低收费的处置费单独列出（也就是收费为10元时的处置费），并且计量单位为“票”，其他收费项目单位为“千克”。
            if (feeDetailListLen > 0) {
                for (j = 0; j < feeDetailListLen; j++) {
                    feeDetail = feeDetailList[j];
                    var feeShortNm = feeDetail.feeShortNm,
                        fee = Number(feeDetail.fee);
                    if (fee < 0.000001) {
                        continue;
                    }
                    invoiceDetail = Ext.Array.findBy(invoiceDetailList, function (invoiceDetailItem) {
                        return feeShortNm == invoiceDetailItem.goodsName;
                    });
                    if (invoiceDetail) {
                        invoiceDetail.number = NumberUtil.plus(invoiceDetail.number, 1);
                    } else {
                        invoiceDetail = {},
                            invoiceDetail.amount = fee;// 金额
                        invoiceDetail.goodsName = feeShortNm;// 商品名称
                        invoiceDetail.number = 1;// 商品数量(最多精确到小数点后8位)
                        invoiceDetail.price = fee;// 单价(最多精确到小数点后8位)
                        invoiceDetail.unit = '公斤';// 单位
                        invoiceDetail.priceKind = 1;// 含税标记(0不含税,1含税)
                        invoiceDetail.standard = '';// 商品规格
                        invoiceDetail.taxRate = taxRate;// 税率(整数，17,6,16，10，11等等)
                        invoiceDetail.taxItem = '';// 税目(4位数字)
                        invoiceDetail.taxAmount = '';// 税额
                        invoiceDetail.goodsNoVer = '30';// 编码版本(根据税局设置，目前固定30.0)
                        invoiceDetail.goodsTaxNo = '304040302';// 税收分类编码(税局所指定的商品的分类编码，可选30101010102 做测试)
                        invoiceDetail.taxPre = '0';// 优惠政策(0 不享受,1享受)
                        invoiceDetail.taxPreCon = '';// 优惠政策内容(免税，不征税)
                        invoiceDetail.zeroTax = '';// 零税率标志(零税率标志为空:非零税率,0:出口退税,1:免税,2:不征收,3:普通零税率)
                        invoiceDetail.cropGoodsNo = '';// 企业对商品的自编码
                        invoiceDetail.taxDeduction = '';// 差额 扣除额

                        invoiceDetailList.push(invoiceDetail);
                    }
                }
            }
        }
        if (invoiceDetailList.length > 8) {
            EU.toastInfo('一个发票号码的收费项目不得大于8项!');
            return;
        } else if (invoiceDetailList.length == 0) {
            EU.toastInfo('无打印项目!');
            return;
        }

        // 打开发票预览页面，发票打印基础信息。
        invoice = {
            billCode: '', // 单据号
            infoKind: infoKind, // 发票类型，0为专用发票，2为普通发票
            cName: customerName, // 购方名称
            cAddress: '', // 购方地址电话
            cBank: '', // 购方银行账号
            cTaxCode: '', // 购货方税号
            taxRate: taxRate, // 税率，为17,13,6,4等
            cashier: cfg.sub.username, // 收款人
            checker: cfg.sub.username, // 复核人
            invoicer: cfg.sub.username, // 开票人
            listName: '', // 是否开具清单(1表示开清单,空表示不开清单)
            invoiceDetailList: invoiceDetailList
        };
        // 不同开票点地址不同
        if (view.domint == 'D' && view.expimp == 'E') {
            invoice.sAddress = '广州市白云新国际机场北工作区横15路国内出港营业厅 86128945'; //销方地址电话
        } else if (view.domint == 'D' && view.expimp == 'I') {
            invoice.sAddress = '新机场北区横十五路国内进港 020-86128946';//销方地址电话
        } else {
            invoice.sAddress = '广州市白云新国际机场北工作区横15路';
        }
        invoice.sBank = '中国建设银行白云国际机场支行 44001491111053001049';//销方银行账号
        invoice.notes = remarks.join(',');//备注
        invoice.customerId = customerId;
        invoice.customerName = customerName;

        // 打开预览界面
        PU.openModule({
            title: '发票预览',
            xtype: 'fee-settlement-invoicepreview',
            reference: 'invoicePreview',
            height: 650,
            width: 1000,
            scope: me,
            params: invoice,
            pcfg: {}
        });
    },

    /**
     * 导出excel
     */
    exportExcel: function () {
        var me = this,
            form = me.lookupReference('searchForm'),
            url = cfg.requestUrl + UrlUtil.get('api/fee/balance', 'exportBalancedExcel');
        if (form.isValid()) {
            PU.xhrDownload(url, me.getSearchParams());
        }
    }
});