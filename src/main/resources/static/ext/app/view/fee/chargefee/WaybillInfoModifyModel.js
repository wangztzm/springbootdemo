Ext.define('Ming.view.fee.chargefee.WaybillInfoModifyModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-chargefee-waybillinfomodify',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.chargefee.Waybill'
    ],

    data: {
        theWaybill: {},
        labelWidth: 72
    }
});