Ext.define('Ming.view.fee.chargefee.BatchPickWaybillController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-chargefee-batchpickwaybill',

    init: function () {
        var me = this,
            view = me.getView(),
            domInt = view.domInt,
            expImp = view.expImp,
            sAirport = me.lookupReference('sAirport'),
            eAirport = me.lookupReference('eAirport'),
            customCtl = me.lookupReference('customCtl'),
            airportId = cfg.sub.airportId;

        // 国内出港账单
        if (domInt == 'D' && expImp == 'E') {
            sAirport.setValue(airportId);
            sAirport.setReadOnly(true);
            customCtl.setValue('N');
        }

        // 国际出港账单
        if (domInt == 'I' && expImp == 'E') {
            sAirport.setValue(airportId);
            sAirport.setReadOnly(true);
            customCtl.setValue('Y');
        }

        // 国内进港账单
        if (domInt == 'D' && expImp == 'I') {
            eAirport.setValue(airportId);
            eAirport.setReadOnly(true);
            customCtl.setValue('N');
        }

        // 国际进港账单
        if (domInt == 'I' && expImp == 'I') {
            eAirport.setValue(airportId);
            eAirport.setReadOnly(true);
            customCtl.setValue('Y');
        }

    },

    /*
    * 批量挑取运单，查询。
    */
    onBatchPickWaybillSearch: function () {
        var me = this,
            view = me.getView(),
            form = me.lookupReference('searchForm'),
            params,
            store = me.lookupReference('gridPanel').getStore(),
            url = UrlUtil.get('api/fee/chargeHandling', 'queryPatchAwbInfo');
        if (form.isValid()) {
            params = {
                data: {
                    bizOpe: view.bizOpe,
                    domInt: view.domInt,
                    expImp: view.expImp
                }
            };
            Ext.apply(params.data, Ext.JSON.decode(Ext.JSON.encode(form.getValues())));
            EU.RS({
                url: url,
                scope: me,
                target: view,
                jsonData: params,
                callback: function (result) {
                    if (result.success && result.resultCode === '0') {
                        store.loadRawData(result.data);
                    } else {
                        store.removeAll();
                    }
                }
            });
        }
    },

    /*
     * 批量挑取运单，确定后查询挑取的运单的费用。
    */
    onBatchPickWaybillConfirm: function () {
        var me = this,
            view = me.getView(),
            dialog = view.up('window'),
            gridBatchPick = me.lookupReference('gridPanel'),
            selections = gridBatchPick.getSelection();
        if (!selections || selections.length == 0) {
            EU.showMsg({
                title: '确认',
                message: '未选中任何记录，确认关闭窗口？',
                option: 3,
                callback: function (btn) {
                    if (btn === 'cancel') {
                        return;
                    }
                    dialog.close();
                }
            });
        } else {
            var billIds = [];
            Ext.each(selections, function (selection) {
                var data = selection.data;
                billIds.push(data.billId);
            });
            view.closeWindow(billIds.join(','));
        }
    },

    /*
     * 批量挑单全选
    */
    onBatchPickWaybillSelectAll: function () {
        var me = this,
            grid = me.lookupReference('gridPanel');
        grid.getSelectionModel().selectAll();
    },

    /*
     * 批量挑单全不选
     */
    onBatchPickWaybillDeSelectAll: function () {
        var me = this,
            grid = me.lookupReference('gridPanel');
        grid.getSelectionModel().deselectAll();
    }
});