Ext.define('Ming.view.fee.settlement.FeeSettledModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-settlement-FeeSettledModel',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.settlement.FeeSettled',
        'Ming.model.fee.settlement.TaxPayer',
        'Ming.model.fee.common.FeeItem'
    ],
    data: {
        flag: false
    },
    stores: {

        // 已结算数据
        feeSettleds: {
            autoLoad: false,
            model: 'Ming.model.fee.settlement.FeeSettled'
        },

        // 费用项
        feeItemAndBizOpe: {model: 'Ming.model.fee.common.FeeItem'}
    }
});