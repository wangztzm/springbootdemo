Ext.define('Ming.view.fee.chargefee.ChargeFeeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-chargefee-chargefee',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.chargefee.Fee',
        'Ming.model.fee.common.FeeItem'
    ],

    data: {
        // 现结票数
        csNumber: 0,
        // 现结金额
        csAmount: 0,
        // 记账票数
        mpNumber: 0,
        // 记账金额
        mpAmount: 0,
        // 总票数
        sumNumber: 0,
        // 总金额
        sumAmount: 0
    },

    stores: {
        fees: {model: 'Ming.model.fee.chargefee.Fee'},
        // 费用项
        feeItemAndBizOpe: {model: 'Ming.model.fee.common.FeeItem'}
    }
});