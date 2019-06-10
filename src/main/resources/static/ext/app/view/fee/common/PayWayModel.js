Ext.define('Ming.view.fee.common.PayWayModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-common-payway',

    requires: [
        'Ming.utils.Store'
    ],

    data: {
        // 总额
        totalBalanceAmount: 0,
        // 结算或修改结算方式时,向父窗体传递付款明细数据。
        balance: null,
        // 取消结算时向父窗体传递付款明细数据。
        balanceList: [],
        // 表格显示的数据
        gridData: null
    }
});