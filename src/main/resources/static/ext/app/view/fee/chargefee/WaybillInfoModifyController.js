Ext.define('Ming.view.fee.chargefee.WaybillInfoModifyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-chargefee-waybillinfomodify',

    init: function () {
        var me = this,
            theWaybill,
            waybillNumber,
            viewModel = me.getViewModel();
        theWaybill = viewModel.get('theWaybill');
        waybillNumber = me.lookupReference('waybillinfomodify-waybillnumber');
        waybillNumber.setBillId({
            stockType: theWaybill.stockTypeId,
            stockPre: theWaybill.stockPre,
            stockNo: theWaybill.stockNo
        });

        // 到达站与中转站相同时，隐藏中转站。
        if (theWaybill.eAirportId == theWaybill.dest1) {
            me.lookupReference('dest1').hide();
        }
    },

    /*
     * 运单信息保存。存在即已核对的情况下，运单信息修改后需要挑单。
    */
    onWaybillModifySubmit: function () {
        var me = this,
            form = me.getView(),
            dialog = form.up('window'),
            billId = me.lookupReference('waybillinfomodify-waybillnumber').getBillId(),
            feeRecId = form.getViewModel().get('feeRecId');

        if (form.isValid()) {
            var params = {data: {}},
                url;
            Ext.apply(params.data, form.getValues());
            url = UrlUtil.get('api/fee/chargeHandling', 'updateAWB');
            EU.RS({
                url: url, scope: me, jsonData: params, target: dialog,
                callback: function (result) {
                    if (result.success && result.resultCode == '0') {
                        EU.toastInfo('运单保存成功。');
                        form.closeWindow({
                            billId: billId,
                            feeRecId: feeRecId
                        });
                    } else {
                        var msg = '运单保存失败。' + result.msg;
                        EU.toastErrorInfo(msg);
                    }
                }
            });
        }
    },

    /*
     * 关闭运单修改弹出框
   */
    onWaybillModifyCancel: function () {
        var me = this,
            view = me.getView();
        view.up('window').close();
    },

    /**
     * 运单修改用，设置选择的客户的名称。
     */
    onWaybillInfoModifyCustomerChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            selectedRecord = combo.getSelectedRecord(),
            customerNameTextfield = me.lookupReference(combo.dataRelateToRef);
        if (selectedRecord) {
            customerNameTextfield.setValue(selectedRecord.data.customerNameChn);
        }
    }

});