Ext.define('Ming.view.fee.settlement.FeeUnsettled', {
    extend: 'Ext.panel.Panel',
    xtype: 'fee-settlement-feeunsettled',
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
        bizOpe: null
    },
    requires: [
        'Ming.view.fee.settlement.FeeUnsettledController',
        'Ming.view.fee.settlement.FeeUnsettledModel'
    ],
    reference: 'feeUnsettledPanel',
    viewModel: {
        type: 'fee-settlement-feeunsettled'
    },
    controller: 'fee-settlement-feeunsettled',
    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            sortableColumns:false,
            enableColumnHide:false,
            reference: 'gridPanel',
            id: 'feeUnsettledList',
            region: 'center',
            bind: {store: '{feeUnsettleds}'},
            selType: 'checkboxmodel',
            enableColumnResize: true,
            dockedItems: [
                {
                    xtype: 'toolbar',
                    scrollable: true,
                    reference: 'searchToolBar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'form',
                            reference: 'searchForm',
                            layout: {
                                type: 'table',
                                columns: 3
                            },
                            defaults: {xtype: 'textfield', labelAlign: 'right', labelSeparator: ''},
                            items: [
                                {
                                    xtype: 'waybillnumber',
                                    padding: '6 0 0 5',
                                    border: false,
                                    maxPrefixTextfieldWidth: 50,
                                    maxNumberTextfieldWidth: 110,
                                    owner: this,
                                    selectAfterLoad: false,
                                    labelWidth: 40,
                                    labelSeparator: '',
                                    prefixTextfieldCfg: {
                                        allowBlank: true,
                                        allowOnlyWhitespace: true
                                    },
                                    numberTextfieldCfg: {
                                        allowBlank: true,
                                        allowOnlyWhitespace: true
                                    },
                                    typeComboCfg: {
                                        readOnly: false,
                                        allowBlank: true,
                                        forceSelection: false,
                                        editable: true
                                    }
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    padding: '0 0 0 56',
                                    colspan: 2,
                                    items: [
                                        {
                                            fieldLabel: '计费日期',
                                            labelWidth: 53,
                                            width: 240,
                                            labelSeparator: '',
                                            name: 'startCrtOPeTime',
                                            emptyText: '请选择开始时间',
                                            inputCls: 'Wdate',
                                            value: CU.getBeforeTimeMinutes(0),
                                            xtype: 'textfield',
                                            format: 'Y-m-d H:i:s',
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
                                        {
                                            padding: '0 0 0 10',
                                            fieldLabel: '至',
                                            labelSeparator: '',
                                            labelWidth: 20,
                                            width: 200,
                                            name: 'endCrtOPeTime',
                                            emptyText: '请选择结束时间',
                                            inputCls: 'Wdate', value: CU.getBeforeTimeMinutes(-1), xtype: 'textfield',
                                            listeners: {
                                                render: function (p) {
                                                    p.getEl().on('click', function () {
                                                        WdatePicker({
                                                        	el: p.getInputId(),
                                                            doubleCalendar: true,
                                                            dateFmt: 'yyyy-MM-dd HH:mm'
                                                            // maxDate:'%y-%M-%d',
                                                        });
                                                    });
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'column',
                                    padding: '0 0 5 4', /* margin: '0 0 0 5', */
                                    width: '100%',
                                    items: [
                                        {
                                            xtype: 'customer',
                                            columnWidth: 0.5,
                                            fieldLabel: '客户',
                                            allowBlank: true,
                                            name: 'customerId',
                                            hideLabel: false,
                                            labelSeparator: '',
                                            maxLengonSubmitth: 30,
                                            labelWidth: 40,
                                            width: 130,
                                            listeners: {
                                                change: 'onCustomerChange'
                                            }
                                        }, {
                                            xtype: 'textfield', columnWidth: 0.5, name: 'customerName'
                                        }
                                    ]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '-5 0 0 67',
                                    colspan: 2,
                                    defaults: {xtype: 'textfield', labelAlign: 'right', labelSeparator: ''},
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            name: 'bizOpe',
                                            fieldLabel: '计费点',
                                            labelWidth: 43,
                                            width: 140,
                                            store: new Ext.data.ArrayStore({
                                                id: 0,
                                                fields: [
                                                    'myId', // numeric value is the key
                                                    'displayText'
                                                ],
                                                data: [['', '全部'], ['', '进港计费'], ['', '收运'], ['', '交单'], ['', '提单'], ['', '提货办单']] // data is local
                                            }),
                                            valueField: 'myId',
                                            displayField: 'displayText'
                                        }, {
                                            xtype: 'opedepartment',
                                            name: 'opeDepartId',
                                            fieldLabel: '营业点',
                                            labelWidth: 43,
                                            width: 150
                                        }, {
                                            xtype: 'combobox',
                                            name: 'payMode',
                                            fieldLabel: '计费方式',
                                            labelWidth: 60,
                                            width: 150,
                                            store: new Ext.data.ArrayStore({
                                                id: 0,
                                                fields: [
                                                    'myId', // numeric value is the key
                                                    'displayText'
                                                ],
                                                data: [['', '全部'], ['', '现结'], ['', '记账']] // data is local
                                            }),
                                            valueField: 'myId',
                                            displayField: 'displayText'
                                        }
                                    ]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 0 1',
                                    defaults: {xtype: 'textfield', labelAlign: 'right', labelSeparator: ''},
                                    items: [
                                        {
                                            name: 'crtOper', fieldLabel: '计费人', labelWidth: 43, width: 150
                                        },
                                        {
                                            xtype: 'combobox',
                                            name: 'needCheck',
                                            fieldLabel: '审核',
                                            labelWidth: 43,
                                            width: 153,
                                            store: new Ext.data.ArrayStore({
                                                id: 0,
                                                fields: [
                                                    'myId', // numeric value is the key
                                                    'displayText'
                                                ],
                                                data: [['', '全部'], ['Y', '是'], ['N', '否']] // data is local
                                            }),
                                            valueField: 'myId',
                                            displayField: 'displayText'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'serialnumber-fieldcontainer',
                                    margin: '0 0 0 10',
                                    labelSeparator: '',
                                    readOnlyAll: false,
                                    dateFieldCfg: {},
                                    userIdTextfieldCfg: {
                                        width: 80
                                    },
                                    serialNoTextfieldCfg: {
                                        width: 100,
                                        allowBlank: true,
                                        allowOnlyWhitespace: true
                                    }
                                },
                                {
                                    xtype: 'panel',
                                    layout: 'hbox',
                                    margin: '-2 0 0 0',
                                    items: [
                                        {
                                            xtype: 'button', text: '查询', width: 80,
                                            listeners: {click: 'onSearchClick'}
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [
                        '->',
                        {xtype: 'button', text: '全选', handler: 'selectAll'},
                        {xtype: 'button', text: '全不选', handler: 'deSelectAll'},
                        {xtype: 'button', text: '计费取消', handler: 'unCharging'},
                        {
                            xtype: 'combobox',
                            name: 'payWay',
                            reference: 'payWay',
                            fieldLabel: '',
                            viewname: 'PAYWAY',
                            value: 'CS',
                            width: 100
                        },
                        {xtype: 'button', text: '批量结算', reference: 'onBatchSettlePay', handler: 'onBatchSettle'},
                        {xtype: 'button', text: '导出excel'},
                        {xtype: 'button', text: '打印计费单'}
                    ]
                }, {
                    xtype: 'toolbar', dock: 'bottom', style: 'padding-top: 2px;padding-bottom: 0px;',
                    defaults: {xtype: 'displayfield', labelWidth: 92, labelSeparator: '：'},
                    layout: {type: 'hbox'},
                    items: [
                    	{fieldLabel: '【总计】票数', reference:'billCountSum', bind: {value: '{totalCount}'}},
                    	{fieldLabel: '金额', labelWidth: 40, reference:'allSum',bind: {value: '{totalFee}'}}
                    ]
                }
            ],
            features: [{ftype: 'summary'}],
            viewConfig: {
                listeners: {
                    expandbody: 'onExpandbody'
                }
            },
            columns: [
                {
                    text: '编辑',
                    xtype: 'widgetcolumn',
                    align: 'center',
                    flex: 1,
                    widget: {
                        xtype: 'panel',
                        ui: 'row-edit-panel',
                        items: [
                            {
                                xtype: 'button',
                                text: '编辑',
                                ui: 'row-edit-button',
                                params: 'oneDelete',
                                scale: 'small',
                                handler: 'onFeeEditClick'
                            }
                        ]
                    }

                },
                {text: '承运人', flex: 1, sortable: true, hidden: true, dataIndex: 'airLineId', align: 'center'},
                {text: '', flex: 1, sortable: true, hidden: true, dataIndex: 'feeRecId', align: 'center'},
                {text: '运单号', flex: 1, sortable: true, dataIndex: 'billIdShow', align: 'center'},
                {text: '品名代码', flex: 1, dataIndex: 'cargoMail', sortable: true, align: 'center'},
                {text: '品名', flex: 1, dataIndex: 'cargoNm', sortable: true, align: 'center'},
                {text: '计重', flex: 1, dataIndex: 'feeWt', sortable: true, align: 'center'},
                {
                    text: '总费用', flex: 1, dataIndex: 'sumFee', sortable: true, align: 'center',
                    summaryType: 'sum',
                    summaryRenderer: 'columnSummaryRenderer'
                },
                {text: '重量', flex: 1, dataIndex: 'weight', sortable: true, align: 'center'},
                {text: '收发货人名称', flex: 1, dataIndex: 'shporCnsCustomer', sortable: true, align: 'center'},
                {text: '收发货代理人名称', flex: 1, dataIndex: 'shporCnsCustomerN', sortable: true, align: 'center'},
                {text: '需审核', flex: 1, dataIndex: 'needCheck', sortable: true, align: 'center'},
                {text: '客户', flex: 1, dataIndex: 'customerId', hidden: true, sortable: true, align: 'center'},
                {text: '客户', flex: 1, dataIndex: 'customerName', sortable: true, align: 'center'},
                {text: '计费方式', flex: 1, dataIndex: 'feeWayDsc', sortable: true, align: 'center'},
                {text: '计费人', flex: 1, dataIndex: 'crtOperChn', sortable: true, align: 'center'},
                {text: '计费点', flex: 1, dataIndex: 'bizOpeDes', sortable: true, align: 'center'},
                {text: '计费点', flex: 1, dataIndex: 'bizOpe', sortable: true, hidden: true, align: 'center'},
                {text: '计费时间', flex: 1, dataIndex: 'crtOpeTime', sortable: true, align: 'center'},
                {text: '流水号', flex: 1, dataIndex: 'chargeSeq', sortable: true, align: 'center'}
            ],
            plugins: {
                rowwidget: {
                    widget: {
                        xtype: 'grid',
                        sortableColumns:false,
                        enableColumnHide:false,
                        ui: 'global-border-layout-center-panel',
                        border: true,
                        bind: {
                            store: {
                                data: '{record.feeDetailList}'
                            }
                        },
                        columns: [
                            {
                                text: '收费项目', dataIndex: 'feeShortNm', flex: 1
                            },
                            {
                                text: '费率', dataIndex: 'feeRate', flex: 1
                            },
                            {
                                text: '计费重量', dataIndex: 'feeWt', flex: 1
                            },
                            {
                                text: '费用', dataIndex: 'fee', flex: 1
                            }]
                    }
                }
            }
        }
    ]
});