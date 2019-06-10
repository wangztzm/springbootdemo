Ext.define('Ming.view.fee.settlement.FeeUnsettledModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-settlement-feeunsettled',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.settlement.FeeUnsettled'
    ],
    data: {
        // 票数
    	totalFee: 0,
        // 金额
    	totalCount: 0
    },
    stores: {
        feeUnsettleds: function () {
            return StoreUtil.getConfig({
                model: 'Ming.model.fee.settlement.FeeUnsettled',
                autoLoad: false,
                url: UrlUtil.get('api/fee/balance', 'queryFeeNotBalance')
            });
        }(),

        // 费用项
        feeItemAndBizOpe: function () {
            return StoreUtil.getConfig({
                model: 'Ming.model.fee.common.FeeItem',
                autoLoad: false,
                url: UrlUtil.get('api/fee/chargeHandling', 'queryFeeItemAndBizOpe')
            });
        }()
    }
});