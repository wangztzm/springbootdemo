Ext.define('Ming.view.fee.chargefee.BatchPickWaybillModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-chargefee-batchpickwaybill',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.chargefee.Waybill'
    ],

    data: {
        // 实配航班日期
        startDtFlightDateFlag: false,
        endDtFlightDateFlag: false,
        // 预配航班日期
        startDtPreFlightDateFlag: true,
        endDtPreFlightDateFlag: true,
        // 制单日期
        startConFirmOpeTimeFlag: true,
        endConfirmOpeTimeFlag: true
    },

    stores: {
        waybills: {model: 'Ming.model.fee.chargefee.Waybill'}
    }
});