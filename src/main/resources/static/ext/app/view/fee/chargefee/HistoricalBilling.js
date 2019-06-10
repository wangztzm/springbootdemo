Ext.define('Ming.view.fee.chargefee.HistoricalBilling', {
    extend: 'Ext.form.Panel',
    xtype: 'fee-chargefee-historicalbilling',
    layout: 'fit',
    plugins: [{ptype: 'PRQ'}],
    controller: 'fee-chargefee-historicalbilling',
    items: [
        {
            xtype: 'grid', reference: 'gridPanel', region: 'center',
            columns: [
                {text: '序  号', sortable: false, width: 60, xtype: 'rownumberer', align: 'center'},
                {text: '运单号', dataIndex: 'sBillId', width: 120, sortable: true},
                {text: '品名', dataIndex: 'cargoNm', width: 120, sortable: true},
                {text: '计重', dataIndex: 'curFeeWt', width: 48, sortable: true},
                {text: '总费用', dataIndex: 'sumFee', width: 64, sortable: true},
                {text: '状态', dataIndex: 'feeStatusChn', width: 64, sortable: true},
                {text: '客户', dataIndex: 'customerName', width: 120, sortable: true},
                {text: '方式', dataIndex: 'feeWayDsc', width: 48, sortable: true},
                {text: '发票号', dataIndex: 'invoiceNo', width: 64, sortable: true}
            ],
            plugins: {
                rowwidget: {
                    widget: {
                        xtype: 'grid',
                        bind: {
                            store: {
                                data: '{record.feeDetailList}'
                            }
                        },
                        columns: [
                            {text: '计费项目', dataIndex: 'feeShortNm', width: 74, sortable: true},
                            {text: '费率', dataIndex: 'feeRate', width: 48, sortable: true},
                            {text: '本次计费重量', dataIndex: 'feeWt', width: 100, sortable: true},
                            {text: '费用', dataIndex: 'fee', width: 48, sortable: true},
                            {text: '备注', dataIndex: 'feeRemark', flex: 1, sortable: true}
                        ]
                    }
                }
            }
        }
    ]
});