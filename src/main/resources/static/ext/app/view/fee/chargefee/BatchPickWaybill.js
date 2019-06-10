Ext.define('Ming.view.fee.chargefee.BatchPickWaybill', {
    extend: 'Ext.panel.Panel',
    xtype: 'fee-chargefee-batchpickwaybill',
    requires: [
        'Ming.view.fee.chargefee.BatchPickWaybillModel'
    ],
    plugins: [{ptype: 'PRQ'}],
    controller: 'fee-chargefee-batchpickwaybill',
    viewModel: {
        type: 'fee-chargefee-batchpickwaybill'
    },
    layout: 'fit',


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
        expImp: null
    },

    initComponent: function () {
        var me = this;
        me.items = me.makeItems();
        me.callParent();
    },

    makeItems: function () {
        var me = this;
        return [
            {
                xtype: 'grid', reference: 'gridPanel', region: 'center',
                sortableColumns: false,
                enableColumnHide: false,
                emptyText: '暂无数据',
                bind: {store: '{waybills}'},
                listeners: {rowdblclick: 'onModuledblClick'},
                selModel: {type: 'checkboxmodel', mode: 'MULTI'},
                columnLines: true,
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        reference: 'searchToolBar',
                        layout: 'fit',
                        items: [me.makeSearchForm()]
                    },
                    {
                        xtype: 'toolbar', dock: 'bottom', defaults: {xtype: 'button'},
                        ui: 'footer',
                        items: [
                            '->',
                            {text: '全选', listeners: {click: 'onBatchPickWaybillSelectAll'}},
                            {text: '全不选', listeners: {click: 'onBatchPickWaybillDeSelectAll'}},
                            {text: '确定', listeners: {click: 'onBatchPickWaybillConfirm'}}
                        ]
                    }
                ],
                columns: [
                    {sortable: false, width: 40, xtype: 'rownumberer', align: 'center'},
                    {text: '运单号', width: 120, sortable: true, dataIndex: 'sBillId'},
                    {text: '件数', width: 56, dataIndex: 'pcs', sortable: true},
                    {text: '重量', width: 56, dataIndex: 'weight', sortable: true},
                    {text: '计费重量', width: 74, dataIndex: 'feeWt', sortable: true},
                    {text: '品名', width: 120, dataIndex: 'cargoNm', sortable: true},
                    {text: '发货代理人', width: 120, dataIndex: 'shpCustomerId', sortable: true},
                    {text: '收货代理人', width: 120, dataIndex: 'csgCustomerId', sortable: true},
                    {text: '制单时间', width: 140, dataIndex: 'confirmOpeTime', sortable: true},
                    {text: '起始站', width: 64, dataIndex: 'sAirportId', sortable: true},
                    {text: '终点站', width: 64, dataIndex: 'eAirportId', sortable: true},
                    {text: '是否监管', width: 74, dataIndex: 'customCtl', sortable: true},
                    {text: '是否转关', width: 74, dataIndex: 'customStrans', sortable: true}
                ]
            }
        ];
    },
    makeSearchForm: function () {
        var me = this,
            xtype = 'fee-chargefee-batchpickwaybillsearch';
        return {xtype: xtype};
    }
});