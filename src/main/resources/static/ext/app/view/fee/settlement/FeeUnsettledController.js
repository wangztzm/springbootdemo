Ext.define('Ming.view.fee.settlement.FeeUnsettledController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-settlement-feeunsettled',
    requires: [
        'Ming.model.fee.settlement.FeeUnsettledEdit',
        'Ming.view.fee.common.FeeEdit'
    ],

    /**
     * 获取费用项 重新配置表格
     */
    init: function () {
        var me = this,
            view = me.getView(),
            feeItemAndBizOpeStore = me.getStore('feeItemAndBizOpe');
        this.gridpanel = this.lookupReference('gridPanel');
        feeItemAndBizOpeStore.load({
            scope: me,
            params: {
                data: {
                    bizOpe: view.bizOpe,
                    domInt: view.domInt,
                    expImp: view.expImp
                }
            }
        });
    },

    /**
     * 设置选择的客户的名称
     */
    onCustomerChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            gridpanel = me.gridpanel,
            feeUnsettledPanel = me.getView(),
            selRecord = combo.findRecordByValue(newValue);
        if (selRecord) {
            var domInt = feeUnsettledPanel.getDomInt();
            if (domInt == 'D') {
                combo.up('container').down('textfield[name=customerName]').setValue(selRecord.data.customerNameChn);
            } else {
                combo.up('container').down('textfield[name=customerName]').setValue(selRecord.data.customerNameEng);
            }
        }
    },

    /**
     * 查询
     */
    onSearchClick: function () {
        var me = this,
            gridpanel = me.gridpanel,
            store = gridpanel.getStore(),
            params = {},
            form = me.lookupReference('searchForm');
        var waybillnumber = me.lookupReference('waybillnumber'),
            billId = waybillnumber.getBillId(),
            serialnumber = me.lookupReference('serialnumber-fieldCt'),
            serialno = serialnumber.getSerialNoCmp().getValue(),
            dateField = serialnumber.getDateCmp().getValue(),
            userIdTextfield = serialnumber.getUserIdCmp().getValue(),
            chargeSeq;
        if (!!serialno & !!dateField & !!userIdTextfield) {
            chargeSeq = serialnumber.getSerialNumber();
        } else {
            chargeSeq = null;
        }
        if (form.isValid()) {
            var formValues = form.getValues();
            delete formValues.stockTypeId;
            delete formValues.stockPre;
            delete formValues.stockNo;
            delete formValues.serialDate;
            delete formValues.userId;
            delete formValues.serialNo;
            Ext.apply(params, Ext.JSON.decode(Ext.JSON.encode(formValues)));
            params.billId = billId;
            params.chargeSeq = chargeSeq;
            store.load({
                params: params, callback: function (records, operation, success) {
                    me.onSetCountAndSum(records);
                }
            });
        }
    },

    /**
     * 行展开,显示明细
     */
    onExpandbody: function (rowNode, record, expandRow, e) {
        var me = this,
            feeRecId,
            params,
            url;
        // 根据feeRecId查询费用明细
        feeRecId = record.data.feeRecId;
        params = {
            data: {feeRecId: feeRecId}
        };
        url = UrlUtil.get('api/fee/balance', 'queryFeeDetail');
        EU.RS({
            url: url,
            scope: me,
            jsonData: params,
            callback: function (result) {
                if (result.success) {
                    record.data.feeDetailList = result.data;
                    record.commit();
                } else {
                    EU.toastInfo(result.msg);
                }
            }
        });
    },

    /*
     * 费用编辑
     */
    onFeeEditClick: function (btn) {
        var me = this,
            record = btn.ownerCt.$widgetRecord,
            dialog,
            view = me.getView(),
            feeRecId,
            params,
            url;
        // 获取FEERECID 根据该ID查询明细 ,
        feeRecId = record.data.feeRecId;
        params = {
            data: {feeRecId: feeRecId}
        };
        url = UrlUtil.get('api/fee/balance', 'queryFeeDetail');
        EU.RS({
            url: url,
            scope: me,
            jsonData: params,
            callback: function (result) {
                if (result.success) {
                    var theFee = {};
                    Ext.apply(theFee, record.data);
                    theFee.feeDetailList = result.data;

                    dialog = PU.openModule({
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
                                    theFee: theFee
                                },
                                stores: {
                                    feeItemAndBizOpe: me.getViewModel().getStore('feeItemAndBizOpe')
                                }
                            }
                        }
                    }, view);
                    me.feeEditDialog = dialog = view.add(dialog);
                    var waybillnumber = dialog.lookupReference('feeedit-waybillnumber');
                    waybillnumber.setBillId({
                        stockPre: theFee.stockPre,
                        stockNo: theFee.stockNo
                    });
                } else {
                    EU.toastInfo(result.msg);
                }
            }
        });
    },

    /**
     * 选择多种支付方式弹框
     */
    onUnPaymentMethod: function (btn) {
        var me = this,
            title = '付款方式',
            xtypeValue = 'fee-settlement-unpaymentmethod',
            referenceValue = 'UnPaymentMethod';
        me.openModule(btn, title, null, xtypeValue, referenceValue);
    },

    /*
     * 合计单元格渲染处理
     */
    columnSummaryRenderer: function (value, summaryData, dataIndex, metaData) {
        metaData.tdStyle = 'font-weight: bold;';

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
     * 计费取消
     */
    unCharging: function () {
        var me = this,
            gridpanel = me.gridpanel,
            records = gridpanel.getSelection(),
            params = [];
        if (records.length < 1) {
            EU.toastInfo('请至少选择一条数据！');
        } else {
            for (var i = 0; i < records.length; i++) {
                var param = {
                    billId: records[i].data.billId,
                    feeRecId: records[i].data.feeRecId
                };
                params.push(param);
            }
            var url = UrlUtil.get('api/fee/balance', 'cancelChargeFee');
            EU.showMsg({
                message: '您确定要对选中的记录进行计费取消？请慎重选择，避免误操作!',
                option: 1,
                scope: this,
                callback: function (btn, text) {
                    if (btn == 'yes') {
                        EU.RS({
                            url: url,
                            scope: me,
                            jsonData: {data: params},
                            callback: function (result) {
                                if (result.success) {
                                    EU.toastInfo('操作成功！');
                                    this.gridpanel.getStore().reload({
                                        callback: function (records, operation, success) {
                                            me.onSetCountAndSum(records);
                                        }
                                    });
                                } else {
                                    EU.toastInfo('操作失败！原因如下：' + result.msg);
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    /**
     * 批量结算
     */
    onBatchSettle: function (btn) {
        var me = this,
            gridpanel = me.gridpanel,
            records = gridpanel.getSelection(),
            payWay = me.lookupReference('payWay'),
            payWayValue = payWay.getValue(),
            sumFeeValue = 0,
            params = [];
        if (records.length <= 0) {
            EU.toastInfo('请选择一条记录！');
            return;
        }
        for (var i = 0; i < records.length; i++) {
            sumFeeValue = CU.calculateFloatPrecision(sumFeeValue, records[i].data.sumFee);
        }
        if (payWayValue == 'MP') {//多种支付方式（多种）
            //弹框
            me.onUnPaymentMethod(btn);
            var dialog = me.dialog,
                formPanel = dialog.lookupReference('unPaymentMethod'),
                grid = formPanel.lookupReference('unPaymentMethodGrid'),
                prePayAmount = formPanel.lookupReference('prePayAmount'),
                store = Ext.create('Ext.data.Store', {
                    model: 'Ming.model.fee.settlement.PayWay',
                    data: [
                        {'payWayView': '现金', 'payWay': 'CS', 'payAmount': '0'},
                        {'payWayView': '支票', 'payWay': '支票', 'payAmount': '0'},
                        {'payWayView': '刷卡', 'payWay': 'SK', 'payAmount': '0'},
                        {'payWayView': '预付', 'payWay': 'YF', 'payAmount': '0'}
                    ]
                });

            grid.setStore(store);
            prePayAmount.setValue(sumFeeValue);
        } else {
            me.payMethodSubmit(btn);
        }
        //判断支付方式

        //单种支付方式（现金、刷卡、支票等）
    },

    /**
     * 付款方式，编辑前事件
     */
    onPaymentMethodDetailBeforeEdit: function (editor, e, eOpts) {
        var me = this,
            dialog = me.dialog,
            record = e.record,
            grid = e.grid,
            store = grid.getStore(),
            formPanel = dialog.lookupReference('unPaymentMethod'),
            sumFee = formPanel.lookupReference('prePayAmount'),
            sumFeeValue = sumFee.value;//应付款总额
        var gridSumFee = 0;//当前表格付款金额总和
        for (var i = 0; i < store.getCount(); i++) {
            var payAmount = store.getAt(i).getData().payAmount;
            gridSumFee = CU.calculateFloatPrecision(gridSumFee, payAmount);
        }
        var payAmountBefore = CU.calculateFloatPrecision(sumFeeValue - gridSumFee, record.data.payAmount);
        if (record.data.payAmount <= 0) {
            record.set('payAmount', payAmountBefore);
        }
    },

    /**
     * 付款方式，编辑后事件
     */
    onPaymentMethodDetailEdit: function (editor, e, eOpts) {
        var me = this,
            dialog = me.dialog,
            record = e.record, // 当前编辑行
            grid = e.grid,
            payAmountValue = 0,
            store = grid.getStore(),
            formPanel = dialog.lookupReference('unPaymentMethod'), // 应付款总额（控件）
            sumFee = formPanel.lookupReference('prePayAmount'), // 应付款总额
            sumFeeValue = sumFee.value; // 应付款总额
        var gridSumFee = 0; // 当前表格付款金额总和
        for (var i = 0; i < store.getCount(); i++) {
            var payAmount = store.getAt(i).getData().payAmount;
            gridSumFee = CU.calculateFloatPrecision(gridSumFee, payAmount);
        }
        if (gridSumFee > sumFeeValue) {
            payAmountValue = CU.calculateFloatPrecision(sumFeeValue - gridSumFee, record.data.payAmount);
            record.set('payAmount', payAmountValue);
        }
    },

    /**
     * 批量结算方法
     */
    payMethodSubmit: function (btn) {
        var me = this,
            dialog = me.dialog,
            params = {},
            gridpanel = me.gridpanel,
            gridpanelStore = gridpanel.getStore(),
            records = gridpanel.getSelection(),

            payWayCombox = me.lookupReference('payWay'), // 应付款总额（控件）
//            sumFee = formPanel.lookupReference('prePayAmount'), // 应付款总额
            sumFeeValue = 0; // 应付款总额;
        var tabs = gridpanel.up('tabpanel'),
            feeSettled = tabs.child('#Feesettled'),
            controller;
//        feeSettled.tab.show();
//        tabs.setActiveTab(feeSettled);
//        controller = feeSettled.controller;
//        controller.onSearchClick();
//        return;

        var isMuch = btn.getReference() == 'payMethodSave'; // true 多种结算方式，false非多种结算
        var balanceFees = [];
        for (var i = 0; i < records.length; i++) {
            var feeRecId = records[i].data.feeRecId;
            sumFeeValue = CU.calculateFloatPrecision(sumFeeValue, records[i].data.sumFee);
            var balanceFee = {
                feeRecId: feeRecId
            };
            balanceFees.push(balanceFee);
        }
        params.prePayAmount = sumFeeValue;
        params.balanceFees = balanceFees;
        if (isMuch) {//多种结算方式
            var formPanel = dialog.lookupReference('unPaymentMethod'); // 应付款总额（控件）
            var unPaymentMethodGrid = formPanel.lookupReference('unPaymentMethodGrid');
            var store = unPaymentMethodGrid.getStore();
            var balanceDetails = [];
            var allPayAmount = 0;
            for (var i = 0; i < store.getCount(); i++) {
                var record = store.getAt(i).getData();
                var payAmount = record.payAmount;
                allPayAmount = CU.calculateFloatPrecision(allPayAmount, payAmount);
                delete record.id;
                delete record.payWayView;
                balanceDetails.push(record);
            }
            if (allPayAmount < sumFeeValue) {
                EU.toastInfo('付款明细总额不能小于应付款总额!');
                return;
            }
            params.balanceDetails = balanceDetails;
        } else {//非多种结算方式
            var payWay = payWayCombox.value;
            var balanceDetails = [];
            var balanceDetail = {
                payAmount: sumFeeValue,
                payWay: payWay
            };
            balanceDetails.push(balanceDetail);
            params.balanceDetails = balanceDetails;
        }
        var url = UrlUtil.get('api/fee/balance', 'balanceFee');
        EU.RS({
            url: url,
            scope: me,
            jsonData: params,
            callback: function (result) {
                if (result.success) {
                    gridpanelStore.reload({
                        callback: function (records, operation, success) {
                            me.onSetCountAndSum(records);
                        }
                    });
                    //结算成功，跳转到另一个界面
                    //var users = tabs.child('#Feesettled');
                    //users.tab.show();
                    //tabs.setActiveTab(users);
                    //默认查询
                    //调用另一个controller方法
                    //var controller = users.controller;
                    //controller.onSearchClick();
                } else {
                    EU.toastInfo(result.msg);
                }
            }
        });
    },

    /**
     * 取消
     */
    onFormCancel: function () {
        var me = this,
            dialog = me.dialog,
            formPanel = dialog.lookupReference('unPaymentMethod');
        formPanel.closeWindowVerify();
    },


    /**
     * 打开dialog
     */
    openModule: function (btn, title, params, xtypeValue, referenceValue, callback) {
        var me = this,
            dialog,
            view = me.getView(),
            formPanel;
        dialog = PU.openModule({
            title: title,
            xtype: xtypeValue,
            width: 800,
            //            height: PU.getHeight(),
            height: 500,
            reference: referenceValue,
            params: params,
            scope: this,
            draggable: true,
            animateTarget: btn,
            resizable: true,
            callback: function (result) {
                if (Ext.isEmpty(result)) return;
                this.gridpanel.getStore().reload();
            }
        }, view);
        me.dialog = dialog = view.add(dialog);
    },

    /**
     * 提交费用
     */
    onSubmit: function (btn) {
        var me = this,
            dialog = me.feeEditDialog,
            form = dialog.lookupReference('feeEidt'),
            grid = dialog.lookupReference('feeEditGrid'),
            store = grid.getStore(),
            url = UrlUtil.get('api/fee/balance', 'updateHistoryFee'),
            params,
            theFee = form.getViewModel().getData().theFee,
            authority;
        // 验证费用权限
        authority = PU.hasFunction('FEEMODIFY');
        if (!authority) {
            EU.toastWarn('你没有修改费用权限！');
            return;
        }
        if (form.isValid()) {
            params = {
                data: [{
                    feeBasDto: {},
                    feeDetailList: []
                }]
            };
            var formValues,
                billId,
                feeBasDto = {},
                items,
                itemData,
                feeDetailDto,
                feeDetailDtoBase = {},
                feeDetailList = [];
            formValues = form.getValues();
            billId = formValues.stockTypeId + formValues.stockPre + formValues.stockNo;

            // 收费信息
            Ext.copy(feeBasDto, theFee, 'feeRecId');
            if (!theFee.billId) {
                feeBasDto.feeStatus = theFee.feeStatus ? theFee.feeStatus : '';
                feeBasDto.feeStatusChn = theFee.feeStatusChn ? theFee.feeStatusChn : '未保存';
                feeBasDto.billId = billId;
            } else {
                feeBasDto.billId = theFee.billId;
                feeBasDto.curFeeWt = theFee.curFeeWt;
            }
            feeBasDto.customerId = Ext.String.trim(formValues.customerId);
            feeBasDto.customerName = Ext.String.trim(formValues.customerName);
            Ext.copy(feeBasDto, formValues, 'payMode');

            // 详细费用信息
            items = store.getData().items;
            Ext.Array.each(items, function (item) {
                itemData = item.data;
                feeDetailDto = Ext.clone(feeDetailDtoBase);
                Ext.copy(feeDetailDto, itemData, 'recId');
                feeDetailDto.feeRate = itemData.feeRate ? itemData.feeRate : '0';
                feeDetailDto.feeWt = itemData.feeWt ? itemData.feeWt : '0';
                feeDetailDto.fee = itemData.fee ? itemData.fee : '0';
                feeDetailDto.feeRecId = itemData.feeRecId ? itemData.feeRecId : '0';
                feeDetailDto.feeId = itemData.feeId ? itemData.feeId : '0';

                if (!itemData.feeId) {
                    EU.toastWarn('请选择计费项！');
                    return;
                }
                feeDetailDto.feeShortNm = itemData.feeShortNm;
                feeDetailDto.feeRemark = itemData.feeRemark;
                feeDetailDto.calWay = itemData.calWay;
                feeDetailList.push(feeDetailDto);
            });

            if (!theFee.billId && feeDetailList.length > 0) {
                feeBasDto.curFeeWt = feeDetailList[0].feeWt;
            }

            params.data[0].feeBasDto = feeBasDto;
            params.data[0].feeDetailList = feeDetailList;

            EU.RS({
                url: url,
                scope: me,
                jsonData: params,
                callback: function (result) {
                    if (result && result.success === true && result.resultCode === '0') {
                        EU.toastInfo('保存运单<font color=\'red\'>『' + feeBasDto.billId + '』</font>费用成功');
                        var feeEditGrid = dialog.lookupReference('feeEditGrid');
                        var formPanel = feeEditGrid.up('form');
                        var win = formPanel.up('window');
                        win.close();

                        var sourcePanel = win.up();
                        var sourcePanelRef = sourcePanel.getReference();
                        if (!sourcePanelRef == 'feeUnsettledPanel') {
                            return;
                        }
                        var gridPanel = sourcePanel.down('grid');
                        var gridStore = gridPanel.getStore();
                        var recordData = {};
                        var record;
                        for (var i = 0; i < gridStore.getCount(); i++) {
                            record = gridStore.getAt(i);
                            recordData = gridStore.getAt(i).getData();
                            var billid = recordData.billId;
                            if (billId == billid) {
                                break;
                            }
                        }
                        var feeWt = 0;
                        var sumFee = 0;
                        Ext.Array.each(feeDetailList, function (feeDetailDto) {
                            feeWt = CU.calculateFloatPrecision(feeWt, feeDetailDto.feeWt);
                            sumFee = CU.calculateFloatPrecision(sumFee, feeDetailDto.fee);

                        });
                        recordData.feeWt = feeWt;
                        recordData.sumFee = sumFee;
                        record.data = recordData;
                        record.data.feeDetailList = feeDetailList;
                        record.commit();
                        var internalId = record.internalId + '';

                        //展开对应行
                        //总费用叠加
                        var expander = Ext.getCmp('feeUnsettledList').plugins[0];
                        var internalIds = expander.recordsExpanded;
                        var internalIdList = Object.keys(internalIds);
                        var judge = true;
                        for (var i = 0; i < internalIdList.length; i++) {
                            if (internalIdList[i] == internalId) {
                                judge = false;
                            }
                        }
                        me.onSetCountAndSum(gridStore.getData().items);
                        if (judge) {
                            expander.toggleRow(gridStore.indexOfId(record.get('id')), record);
                        }

                    } else {
                        EU.toastInfo('保存运单<font color=\'red\'>『' + feeBasDto.billId + '』</font>费用失败。' + result.msg);
                    }
                }
            });
        }
    },

    /**
     * 计算票数，金额
     */
    onSetCountAndSum: function (records) {
        var me = this,
            viewModel = me.getViewModel(),
            gridpanel = this.lookupReference('gridPanel'),
            allSum = me.lookupReference('allSum'),
            billCountSum = me.lookupReference('billCountSum'),
            store = gridpanel.getStore();
        var totalFee = 0;
        var totalCount = 0;
        if (records.length > 0) {
            totalCount = records.length;
            for (var i = 0; i < records.length; i++) {
                var sumfee = records[i].data.sumFee;
                totalFee = CU.calculateFloatPrecision(totalFee, sumfee);
            }
        }
        viewModel.set('totalFee', totalFee);
        viewModel.set('totalCount', totalCount);
    }

});