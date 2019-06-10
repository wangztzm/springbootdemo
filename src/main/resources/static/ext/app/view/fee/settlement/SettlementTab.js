Ext.define('Ming.view.fee.settlement.SettlementTab', {
    extend: 'Ext.tab.Panel',
    xtype: 'fee-settlement-settlementtab',
    requires: [
        'Ming.view.fee.settlement.FeeUnsettled',
        'Ming.view.fee.settlement.FeeSettled'
    ],
    config: {
        /**
         * @cfg {Object} domInt
         * 国内国际
         */
        domInt: 'D',

        /**
         * @cfg {Object} expImp
         * 进港出港
         */
        expImp: 'I',

        /**
         * @cfg {Object} bizOpe
         * 计费点
         */
        bizOpe: 'IFEE'
    },
    width: 300,
    height: 200,
    activeTab: 0,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                title: '未结算查询',
                itemId: 'FeeUnsettled',
                xtype: 'fee-settlement-feeunsettled',
                domInt: me.domInt,
                expImp: me.expImp,
                bizOpe: me.bizOpe
            }, {
                title: '已结算查询',
                itemId: 'Feesettled',
                xtype: 'fee-settlement-feesettled',
                domInt: me.domInt,
                expImp: me.expImp,
                bizOpe: me.bizOpe
            }
        ];
        me.callParent();
    }
});
