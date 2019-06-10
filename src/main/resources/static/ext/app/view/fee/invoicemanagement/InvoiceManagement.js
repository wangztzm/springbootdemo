Ext.define('Ming.view.fee.invoicemanagement.InvoiceManagement', {
    extend: 'Ext.panel.Panel',
    xtype: 'fee-invoicemanagement-invoicemanagement',
    controller: 'fee-invoicemanagement-invoicemanagement',
    requires: [
        'Ming.view.fee.invoicemanagement.InvoiceManagementController',
        'Ming.view.fee.invoicemanagement.InvoiceManagementModel',
    ],
    viewModel: {
        type: 'fee-invoicemanagement-invoicemanagement'
    },
    layout: 'fit',
    items: [{
        xtype: 'grid',
        reference: 'gridPanel',
        region: 'center',
        id:'mygrid',
        overflowX: 'scroll',
        bind: {
            store: '{waybills}'
        },
        selModel: {
            type: 'checkboxmodel',
            mode: 'MULTI',
        },
        // listeners: {
        //     'selectionchange':'totalAmount'
        // },
        dockedItems: [{
                xtype: 'form',
                reference: 'myform',
                items: [{
                    xtype: 'fieldset',
                    title: '发票查询管理',
                    defaults: {
                        xtype: 'textfield',
                        width: '80%',
                        labelAlign: 'right',
                        labelSeparator: ''
                    },

                    layout: {
                        type: 'table',
                        columns: 3,
                        tdAttrs: {
                            style: {
                                width: '33%',
                                textAlign: 'center',
                            }
                        }
                    },
                    items: [{
                            fieldLabel: '发票代码',
                            width: '350',
                            name: 'invoiceId',
                        },
                        {
                            fieldLabel: '发票起始号码',
                            name: 'startInvoiceNo',
                            width: '350',
                        },
                        {
                            fieldLabel: '发票结束号码',
                            name: 'endInvoiceNo',
                            width: '360',
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '付款方名称',
                            layout: 'hbox',
                            labelSeparator: '',
                            labelAlign: 'right',
                            width: '350',
                            items: [{
                                    xtype: 'customer',
                                    fieldLabel: '客户代码',
                                    style: 'margin-bottom: 0px;',
                                    width: 50,
                                    listeners: {
                                        change: 'onCustomerChange'
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    reference: 'customerName',
                                    name: 'payer',
                                    fieldLabel: '客户名称',
                                    hideLabel: true,
                                    width: 125,
                                },
                            ]
                        },
                        {
                            xtype: 'opedepartment',
                            name:'invoiceOpeDePart',
                            width: '350',
                        },
                        {
                            xtype: 'opedeptusers',
                            fieldLabel: '打印人',
                            name:'invoiceCrtOper',
                            width: '350',
                            margin: '0 0 0 35',
                            labelWidth: 64,
                            blurValidate4Remote: 'true',
                        },
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '开票时间',
                            layout: {
                                type: 'table',
                                columns: 6
                            },
                            labelSeparator: '',
                            labelAlign: 'right',
                            labelWidth: 72,
                            // style: 'margin-bottom: 0px;',
                            margin: '0 0 0 12',
                            items: [
                                // {
                                //     xtype: 'checkboxfield',
                                //     name: 'startInvoiceCrtOpeTimeFlag',
                                //     inputValue: 'Y',
                                //     uncheckedValue: 'N',
                                //     hideLabel: true
                                // },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '开票开始时间',
                                    name: 'startInvoiceCrtOpeTime',
                                    hideLabel: true,
                                    width: '300',
                                    inputCls: 'Wdate',
                                    value: CU.getBeforeTimeMinutes(0),
                                    //  value: CU.getTime(),
                                    listeners: {
                                        render: function (p) {
                                            p.getEl().on('click', function () {
                                                WdatePicker({
                                                    el: p.getInputId(),
                                                    doubleCalendar: true,
                                                    dateFmt: 'yyyy-MM-dd HH:mm'
                                                    // maxDate:'%y-%M-%d'
                                                });
                                            });
                                        }
                                    }
                                },
                                // {
                                //     xtype: 'checkboxfield',
                                //     name: 'endInvoiceCrtOpeTimeFlag',
                                //     inputValue: 'Y',
                                //     uncheckedValue: 'N'
                                // },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '开票结束时间',
                                    name: 'endInvoiceCrtOpeTime',
                                    hideLabel: true,
                                    width: '300',
                                    inputCls: 'Wdate',
                                    value: CU.getBeforeTimeMinutes(-1),
                                    listeners: {
                                        render: function (p) {
                                            p.getEl().on('click', function () {
                                                WdatePicker({
                                                    el: p.getInputId(),
                                                    doubleCalendar: true,
                                                    dateFmt: 'yyyy-MM-dd HH:mm'
                                                });
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '是否作废',
                            margin: '0 0 0 150',
                            width: '200',
                            name: 'invoiceDelOper',
                            value: null,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'val'],
                                data: [{
                                        name: '全部',
                                        val: null
                                    },
                                    {
                                        name: '是',
                                        val: 'Y'
                                    },
                                    {
                                        name: '否',
                                        val: 'N'
                                    }
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'val',
                            triggerAction: 'all',
                            editable: false,
                        },
                        {
                            xtype: 'button',
                            text: '查询',
                            margin: '0 0 0 -150',
                            width: '200',
                            handler: 'invoiceSearch'
                        }
                    ]
                }]
            },
            {
                xtype: 'toolbar',
                dock: 'bottom',
                defaults: {
                    xtype: 'displayfield',
                    // ui: 'display-field-bottom',
                    // height:'30'
                    // labelWidth:60
                },
                items: [{
                        fieldLabel: '总票数',
                        bind:{
                            value:'{ams}'
                        },
                        labelWidth:60
                    },
                    {
                        fieldLabel: '总金额',
                        bind:{
                            value:'{grossam}'
                        },
                        labelWidth:70
                    },
                    {
                        fieldLabel: '剩余可打发票',
                        value: null,
                        labelWidth:100
                    },
                ],
            },
            {
                // xtype: 'fieldset',
                dock: 'bottom',
                defaults: {
                    xtype: 'textfield',
                    width: '33%',
                    labelAlign: 'right',
                    labelSeparator: '',
                },
                layout: {
                    type: 'table',
                    columns: 2,
                    tdAttrs: {
                        style: {
                            width: '33%',
                            // textAlign: 'center'
                        }
                    }
                },
                items: [{
                        xtype: 'button',
                        text: '下一张可打发票',
                        rowspan: '2',
                        width: '200',
                        margin: '0 0 0 10'
                    },
                    {
                        fieldLabel: '发票代码',
                        xtype: 'textfield',
                        name: 'incodes',
                        width: '150',
                        margin: '0 0 5 -120'
                    },
                    {
                        fieldLabel: '发票号',
                        xtype: 'textfield',
                        name: 'innumber',
                        width: '150',
                        margin: '0 0 0 -120'
                    },
                    {
                        boxLabel: '专票',
                        xtype: 'checkboxfield',
                        name: 'sticket',
                        width: '150',
                        margin: '0 0 0 10'
                    }
                ]
            },
            {
                xtype: 'toolbar',
                dock: 'bottom',
                defaults: {
                    xtype: 'button'
                },
                items: [{
                        text: '导出',
                    },
                    {
                        text: '作废发票',
                        handler:'invalidInvoice'
                    },
                ]
            },
        ],
        features: [{
            ftype: 'summary'
        }],
        // viewConfig: {
        //     listeners: {
        //         expandbody: 'onExpandbody'
        //     }
        // },
        columns: [{
                text: '发票号码',
                dataIndex: 'INVOICENO',
                flex: 1,
                sortable: true,
                align: 'center',
            },
            {
                text: '总金额',
                dataIndex: 'TOTALFEE',
                flex: 1,
                sortable: true,
                align: 'center',
                // summaryType: 'sum',
                // summaryRenderer: 'chargeFeeColumnSummaryRenderer'
            },
            {
                text: '付款方名称',
                dataIndex: 'PAYER',
                // flex: 1,
                sortable: true,
                align: 'center',
                // width:'150%'
                width: 170
            },
            {
                text: '打印人',
                dataIndex: 'CRTOPER',
                flex: 1,
                sortable: true,
                align: 'center',
            },
            {
                text: '开票时间',
                dataIndex: 'CRTOPETIME',
                flex: 1,
                sortable: true,
                align: 'center',
            },
            {
                text: '作废',
                dataIndex: 'DELO',
                flex: 1,
                sortable: true,
                align: 'center',
            },
            {
                text: '作废人',
                dataIndex: 'DELOPER',
                flex: 1,
                sortable: true,
                align: 'center',
            },
            {
                text: '作废时间',
                dataIndex: 'DELOPETIME',
                flex: 1,
                sortable: true,
                align: 'center',
            },
        ],
        plugins: {
            rowwidget: {
                widget: {
                    xtype: 'grid',
                    ui: 'global-border-layout-center-panel',
                    border: true,
                    bind: {
                        store: {
                            data: '{record.list}'
                        }
                    },
                    columns: [{
                            text: '业务编号',
                            dataIndex: 'feeId',
                            flex: 1,
                            sortable: true,
                            align: 'center',
                        },
                        {
                            text: '品名',
                            dataIndex: 'feeName',
                            flex: 1,
                            sortable: true,
                            align: 'center',
                        },
                        {
                            text: '收费项目',
                            dataIndex: 'feeShortNm',
                            flex: 1,
                            sortable: true,
                            align: 'center',
                        },
                        {
                            text: '计费重量',
                            dataIndex: 'awbFeeWt ',
                            flex: 1,
                            sortable: true,
                            align: 'center',
                        },
                        {
                            text: '费率',
                            dataIndex: 'feeRate',
                            flex: 1,
                            sortable: true,
                            align: 'center',
                        },
                        {
                            text: '费用',
                            dataIndex: 'fee',
                            flex: 1,
                            sortable: true,
                            align: 'center',
                        }
                    ]
                }
            }
        }

    }],

});