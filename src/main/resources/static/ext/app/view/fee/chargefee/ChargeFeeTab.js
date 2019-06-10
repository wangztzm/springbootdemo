Ext.define('Ming.view.fee.chargefee.ChargeFeeTab', {
    extend: 'Ext.tab.Panel',
    xtype: 'fee-chargefee-chargefeetab',
    config: {
        /**
         * @cfg {Object} domInt
         * 国内国际
         */
        domInt: null,

        /**
         * @cfg {Object} expImp
         * 进港出港
         */
        expImp: null,

        /**
         * @cfg {Object} bizOpe
         * 计费点
         */
        bizOpe: null,

        /**
         * @cfg {Object} businessSeq
         * 业务号
         */
        businessSeq: null,

        /**
         * @cfg {Object} billList
         * 运单列表
         */
        billList: null,

        /**
         * @cfg {Object} customerId
         * 结算客户代码
         */
        customerId: null,

        /**
         * @cfg {Object} customerName
         * 结算客户名称
         */
        customerName: null,

        /**
         * @cfg {Object} isGetNewFee
         * 增加新计费 true:显示计费 false：显示已结算
         */
        isGetNewFee: null
    },
    requires: [
        'Ming.view.fee.chargefee.ChargeFeeTabController'
    ],
    controller: 'fee-chargefee-chargefeetab',
    width: 300,
    height: 200,
    activeTab: 0,
    listeners: {
        beforeclose: 'beforeClose'
    },
    initComponent: function () {
        var me = this,
            isGetNewFee = me.isGetNewFee,
            chargeFeeBillList,
            feeSettledBillList;
        if(isGetNewFee === false) {
            me.activeTab = 1;
            feeSettledBillList = me.billList;
        } else {
            me.activeTab = 0;
            chargeFeeBillList = me.billList;
        }
        me.items = [
            {
                title: '计费',
                xtype: 'fee-chargefee-chargefee',
                domInt: me.domInt,
                expImp: me.expImp,
                bizOpe: me.bizOpe,
                businessSeq: me.businessSeq,
                billList: chargeFeeBillList,
                customerId: me.customerId,
                customerName: me.customerName
            },
            {
                title: '已结算',
                xtype: 'fee-settlement-feesettled',
                domInt: me.domInt,
                expImp: me.expImp,
                bizOpe: me.bizOpe,
                billList: feeSettledBillList
            }
        ];
        me.callParent();
    }
});
