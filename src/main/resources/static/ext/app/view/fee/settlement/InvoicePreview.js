Ext.define('Ming.view.fee.settlement.InvoicePreview', {
    extend: 'ux.form.Panel',
    xtype: 'fee-settlement-invoicepreview',
    reference: 'invoicePreview',
    titleAlign: 'center',
    requires: [
        'Ming.view.fee.settlement.InvoicePreviewModel'
    ],
    controller: 'fee-settlement-invoicepreview',
    viewModel: {
        type: 'fee-settlement-invoicepreview'
    },
    layout: {
        type: 'anchor'
    },
    items: [
        {
            layout: {
                type: 'anchor'
            },
            items: [
                {
                    xtype: 'toolbar',
                    reference: 'titleToolBar',
                    scrollable: true,
                    dock: 'top',
                    style: 'border:0',
                    margin: '-10 0 -30 0',
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            layout: {
                                type: 'vbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    reference: 'invoiceTitle',
                                    name: 'invoiceTitle',
                                    margin: '0 0 -5 0',
                                    submitValue: false
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'toolbar',
                    scrollable: true,
                    dock: 'top',
                    style: 'border:0',
                    margin: '-30 0 -10 0',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                                align: 'center'
                            },
                            items: [
                                {

                                    html: '<font face="Cambria"><h2>00000000</h2></font>'
                                }
                            ]
                        },
                        '->',
                        {
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    html: '<font face="Cambria"><h2>N<u>o</u>:00000000</h2></font>',
                                    margin: '0 0 -10 0'
                                },
                                {
                                    html: '<font face="KaiTi">开票日期:' + Ext.Date.format(new Date(), 'Y年m月d日') + '</font>',
                                    margin: '0 0 10 0'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'form',
                    reference: 'payerId',
                    layout: {
                        type: 'column'
                    },
                    padding: '10 0 0 10',
                    items: [
                        {
                            html: ' <br>购 <br>货 <br>单 <br>位',
                            columnWidth: 0.02
                        }, {
                            columnWidth: 0.98,
                            items: [
                                {
                                    xtype: 'combo',
                                    width: '50%',
                                    fieldLabel: '名&emsp;&emsp;&emsp;&emsp;称',
                                    margin: '0 0 0 0',
                                    reference: 'customer',
                                    valueField: 'costumerName',
                                    displayField: 'costumerName',
                                    blurUppercase: false,
                                    blurValidate4Remote: false,
                                    allowBlank: true,
                                    name: 'customer',
                                    hideLabel: false,
                                    labelSeparator: ':',
                                    maxLength: 60,
                                    labelWidth: 100,
                                    listeners: {
                                        change: 'onCustomerChange'
                                    }
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: '纳税人识别号',
                                    displayField: 'classIfic',
                                    valueField: 'classIfic',
                                    name: 'payerClassific',
                                    margin: '0 0 0 0',
                                    labelWidth: 100,
                                    maxLength: 60,
                                    width: '50%'
                                }, {
                                    xtype: 'combo',
                                    fieldLabel: '地&ensp;址、电&ensp;话',
                                    displayField: 'addressPhone',
                                    valueField: 'addressPhone',
                                    submitValue: false,
                                    name: 'addressPhone',
                                    margin: '0 0 0 0',
                                    labelWidth: 100,
                                    maxLength: 60,
                                    width: '100%'
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: '开户行及账号',
                                    displayField: 'bankAccount',
                                    valueField: 'bankAccount',
                                    submitValue: false,
                                    name: 'bankAccount',
                                    margin: '0 0 0 0',
                                    labelWidth: 100,
                                    maxLength: 60,
                                    width: '100%'
                                }]

                        }

                    ]
                }]
        }, {

            xtype: 'gridpanel',
            reference: 'invoicePreviewGrid',
            enableColumnHide: false,
            sortableColumns: false, // /隐藏排序
            height: 145,
            border: false,
            columnLines: false,
            columns: [
                {
                    text: '货物或应税劳务名称',
                    dataIndex: 'goodsName',
                    flex: 2
                }, {
                    text: '规格型号',
                    dataIndex: 'standard',
                    align: 'center',
                    flex: 1
                }, {
                    text: '单位',
                    dataIndex: 'unit',
                    align: 'center',
                    flex: 1
                }, {
                    text: '数量',
                    dataIndex: 'number',
                    align: 'center',
                    flex: 1
                }, {
                    text: '单价',
                    dataIndex: 'unitPrice',
                    align: 'center',
                    flex: 1
                }, {
                    text: '金额',
                    dataIndex: 'totalAmountProduct',
                    align: 'center',
                    flex: 1
                }, {
                    text: '税率',
                    dataIndex: 'taxRate',
                    align: 'center',
                    flex: 1
                }, {
                    text: '税额',
                    dataIndex: 'taxTotalAmountProduct',
                    align: 'center',
                    flex: 1
                }]

        },
        {
            items: [
                {
                    // xtype: 'fieldset',
                    // title: '发票查询管理',
                    defaults: {
                        xtype: 'textfield',
                        width: '80%',
                        labelAlign: 'right',
                        labelSeparator: '',
                        margin: '0 0 0 30'
                    },

                    layout: {
                        type: 'table',
                        columns: 1,
                        tdAttrs: {
                            style: {
                                //							width: '20%',
                                //							textAlign: 'center',
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'table',
                                columns: 3
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    width: '100%',
                                    fieldLabel: '合&emsp;&emsp;&emsp;&emsp;计&emsp;',
                                    name: 'awbPickId',
                                    submitValue: false,
                                    labelSeparator: '  ',
                                    labelWidth: 100,
                                    border: '0 0 0 0',
                                    margin: '0 0 0 10'
                                }, {
                                    xtype: 'displayfield',
                                    width: '100%',
                                    //								fieldLabel: '(金额)',
                                    name: 'excludeTaxTotalAmount',
                                    submitValue: false,
                                    labelSeparator: '  ',
                                    margin: '0 0 0 550'
                                }, {
                                    xtype: 'displayfield',
                                    width: '100%',
                                    //								fieldLabel: '(税额)',
                                    name: 'taxTotalAmount',
                                    submitValue: false,
                                    labelSeparator: '  ',
                                    margin: '0 0 0 200'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    width: '100%',
                                    fieldLabel: '价税合计(大写)',
                                    labelSeparator: '',
                                    name: 'totalAmountChinese',
                                    submitValue: false,
                                    labelWidth: 100
                                    //								maxLength: 60
                                }, {
                                    xtype: 'displayfield',
                                    width: '100%',
                                    fieldLabel: '(小写)',
                                    name: 'totalAmount',
                                    submitValue: true,
                                    labelSeparator: '  ',
                                    labelWidth: 200,
                                    margin: '0 0 0 150',
                                    maxLength: 60
                                }
                            ]

                        }

                    ]
                }]
        }, {

            xtype: 'form',
            reference: 'payeeId',
            layout: {
                type: 'column'
            },
            padding: '10 0 0 10',
            items: [{
                html: ' <br>销 <br>货 <br>单 <br>位',
                columnWidth: 0.02
            }, {
                columnWidth: 0.58,
                items: [
                    {
                        xtype: 'displayfield',
                        width: '100%',
                        fieldLabel: '名&emsp;&emsp;&emsp;&emsp;称',
                        margin: '0 0 0 0',
                        name: 'payee',
                        submitValue: true,
                        labelWidth: 100,
                        border: '0 0 0 0',
                        value: '广州白云国际机场股份有限公司',
                        maxLength: 60
                    }, {
                        xtype: 'displayfield',
                        width: '100%',
                        fieldLabel: '纳税人识别号',
                        margin: '0 0 0 0',
                        name: 'payEEClassific',
                        submitValue: true,
                        labelWidth: 100,
                        value: '914400007250669553',
                        maxLength: 60
                    }, {
                        xtype: 'displayfield',
                        width: '100%',
                        fieldLabel: '地&ensp;址、电&ensp;话',
                        margin: '0 0 0 0',
                        name: 'awbPickId',
                        labelWidth: 100,
                        value: '广州市白云新国际机场北工作区横15路',
                        maxLength: 60
                    }, {
                        xtype: 'displayfield',
                        width: '100%',
                        fieldLabel: '开户行及账号',
                        margin: '0 0 0 0',
                        name: 'awbPickIdno',
                        labelWidth: 100,
                        value: '中国建设银行白云国际机场支行',
                        maxLength: 60
                    }
                ]

            }, {
                columnWidth: 0.4,
                items: [
                    {
                        xtype: 'textareafield',
                        labelSeparator: '',
                        grow: true,
                        name: 'notes',
                        fieldLabel: '<br>备<br>注',
                        submitValue: false,
                        anchor: '100%',
                        height: 110,
                        width: '100%'
                    }]

            }

            ]

        }, {
            items: [
                {
                    // xtype: 'fieldset',
                    // title: '发票查询管理',
                    defaults: {
                        xtype: 'textfield',
                        width: '80%',
                        labelAlign: 'right',
                        labelSeparator: ''
                        // margin: '10 0 0 0',
                    },

                    layout: {
                        type: 'table',
                        columns: 4,
                        tdAttrs: {
                            style: {
                                width: '20%',
                                textAlign: 'center'
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: '收款人:',
                            width: '92%',
                            name: 'isnocancell',
                            value: 'A',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'val'],
                                data: [{
                                    name: cfg.sub.username,
                                    val: 'A'
                                }
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            submitValue: false,
                            valueField: 'val',
                            triggerAction: 'all',
                            editable: false
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '复核人:',
                            width: '92%',
                            name: 'isnocancell',
                            value: 'A',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'val'],
                                data: [{
                                    name: cfg.sub.username,
                                    val: 'A'
                                }
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            submitValue: false,
                            valueField: 'val',
                            triggerAction: 'all',
                            editable: false
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: '开票人:',
                            width: '92%',
                            name: 'isnocancell',
                            submitValue: false,
                            value: 'A',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'val'],
                                data: [
                                    {
                                        name: cfg.sub.username,
                                        val: 'A'
                                    }
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'val',
                            triggerAction: 'all',
                            editable: false
                        },
                        {
                            xtype: 'displayfield',
                            width: '100%',
                            fieldLabel: '销售单位:(章)',
                            name: 'awbPickId',
                            submitValue: false,
                            labelWidth: 100,
                            maxLength: 60
                        }

                    ]
                }]
        }
    ],
    buttons: [
        {
            text: '打印',
            handler: 'savePrintDetail'
        },
        {
            text: '退出',
            handler: 'invoicePreviewClose'
        }
    ]
});