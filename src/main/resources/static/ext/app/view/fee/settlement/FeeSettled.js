Ext.define('Ming.view.fee.settlement.FeeSettled', {
    extend: 'Ext.panel.Panel',
    xtype: 'fee-settlement-feesettled',
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
        bizOpe: null
    },
    requires: [
        'Ming.view.fee.settlement.FeeSettledController',
        'Ming.view.fee.settlement.FeeSettledModel'
    ],
    viewModel: {
        type: 'fee-settlement-FeeSettledModel'
    },
    controller: 'fee-settlement-feesettled',
    layout: 'fit',
    reference: 'feeSettled',

    initComponent: function () {
        var me = this;
        me.items = me.makeItems();
        me.callParent();
    },

    makeItems: function () {
        var me = this;
        return [
            {
                xtype: 'grid',
                emptyText: '暂无数据',
                sortableColumns: false,
                enableColumnHide: false,
                reference: 'gridPanel',
                region: 'center',
                bind: {store: '{feeSettleds}'},
                selType: 'checkboxmodel',
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
                                items: [
                                    {
                                        xtype: 'container', layout: {type: 'hbox'},
                                        defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
                                        items: [
                                            {
                                                xtype: 'waybillnumber',
                                                domInt: me.domInt,
                                                width: 480,
                                                prefixTextfieldWidth: 108, numberTextfieldWidth: 140,
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
                                                xtype: 'fieldcontainer', layout: {type: 'hbox'},
                                                defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
                                                fieldLabel: '结算时间', labelWidth: 56,
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        name: 'startCrtOPeTime',
                                                        emptyText: '请选择开始时间',
                                                        inputCls: 'Wdate',
                                                        value: CU.getBeforeTimeMinutes(0),
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
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        fieldLabel: '至',
                                                        labelWidth: 10,
                                                        name: 'endCrtOPeTime',
                                                        emptyText: '请选择结束时间',
                                                        inputCls: 'Wdate',
                                                        value: CU.getBeforeTimeMinutes(-1),
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
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container', layout: {type: 'hbox'}, padding: '5 0 0 0',
                                        defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
                                        items: [
                                            {
                                                xtype: 'fieldcontainer',
                                                fieldLabel: '客户',
                                                layout: {type: 'hbox'},
                                                defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
                                                items: [
                                                    {
                                                        xtype: 'customer',
                                                        allowBlank: true,
                                                        name: 'customerId',
                                                        maxLength: 30,
                                                        listeners: {
                                                            change: 'onAwbPickNameChange'
                                                        }
                                                    },
                                                    {xtype: 'textfield', name: 'customerName'}
                                                ]
                                            },
                                            {name: 'moneyOper', fieldLabel: '结算人'},
                                            {
                                                xtype: 'serialnumber-fieldcontainer',
                                                labelSeparator: '', labelWidth: 56,
                                                readOnlyAll: false,
                                                userIdTextfieldCfg: {},
                                                serialNoTextfieldCfg: {
                                                    allowBlank: true,
                                                    allowOnlyWhitespace: true
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'container', layout: {type: 'hbox'}, padding: '5 0 0 0',
                                        defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
                                        items: [
                                            {name: 'feeCrtOper', fieldLabel: '计费人'},
                                            {
                                                xtype: 'combobox',
                                                name: 'feeStatus',
                                                fieldLabel: '发票状态',
                                                displayField: 'text',
                                                valueField: 'code',
                                                value: '',
                                                store: {
                                                    data: [
                                                        {text: '全部', code: ''},
                                                        {text: '未打', code: 'B'},
                                                        {text: '已打', code: 'C'}
                                                    ]
                                                }
                                            },
                                            {
                                                xtype: 'combobox',
                                                name: 'payMode',
                                                fieldLabel: '计费方式',
                                                displayField: 'text',
                                                valueField: 'code',
                                                value: '',
                                                store: {
                                                    data: [
                                                        {text: '全部', code: ''},
                                                        {text: '现结', code: 'CS'},
                                                        {text: '记账', code: 'MP'}
                                                    ]
                                                }
                                            },
                                            {
                                                xtype: 'feebizoperation',
                                                name: 'bizOpe',
                                                fieldLabel: '计费点',
                                                labelWidth: 56,
                                                optionAll: true,
                                                optionAllValue: '',
                                                value: ''
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'balanceOpeDepartId',
                                                fieldLabel: '结算营业点',
                                                value: cfg.sub.opedepartid,
                                                readOnly: true, labelWidth: 72
                                            },
                                            {
                                                xtype: 'button', text: '查询', style: 'margin-left: 16px;',
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
                            {xtype: 'button', text: '结算取消', handler: 'cancelSettle'},
                            {
                                xtype: 'checkboxfield',
                                reference: 'specialInvoice',
                                width: 80,
                                boxLabel: '专用发票',
                                name: 'customCtl',
                                labelWidth: 80
                            },
                            {xtype: 'button', text: '打印发票', handler: 'onPrintInvoice'},
                            {xtype: 'button', text: '导出', handler: 'exportExcel'}
                        ]
                    }
                ],
                columns: me.makeColumns()
            }
        ];
    },

    makeColumns: function () {
        var me = this,
            columns = [
                {text: '状态', width: 64, sortable: true, dataIndex: 'feeStatusChn'},
                {text: '运单号', width: 120, sortable: true, dataIndex: 'billIdShow'},
                {text: '本次计件', width: 74, dataIndex: 'curPcs', sortable: true},
                {text: '本次计重', width: 74, dataIndex: 'curFeeWt', sortable: true},
                {
                    text: '仓储天数', width: 74, dataIndex: 'whsTime', sortable: true
                },
                {text: '费率', width: 48, dataIndex: 'feeRate', sortable: true},
                {
                    text: '总费用', width: 64, dataIndex: 'sumFee', sortable: true
                },
                {text: '特货代码', width: 74, dataIndex: 'specOpeId', sortable: true},
                {text: '品名', width: 120, dataIndex: 'cargoNm', sortable: true},
                {text: '计费方式', width: 74, dataIndex: 'feeWayDsc', sortable: true},
                {text: '客户', width: 120, dataIndex: 'customerName', sortable: true},
                {
                    xtype: 'widgetcolumn', text: '付款方式', width: 80,
                    widget: {
                        xtype: 'panel', ui: 'row-edit-panel',
                        items: [
                            {
                                xtype: 'button', text: '付款方式', ui: 'row-edit-button', scale: 'small',
                                listeners: {click: 'modifyBalance'}
                            }
                        ]
                    }
                },
                {text: '发票号', width: 74, dataIndex: 'invoiceNo', sortable: true},
                {text: '结算人', width: 90, dataIndex: 'moneyOperChn', sortable: true},
                {text: '结算时间', width: 140, dataIndex: 'moneyOpeTime', sortable: true},
                {text: '打印人', width: 90, dataIndex: 'invoiceCrtOperChn', sortable: true},
                {text: '打印时间', width: 80, dataIndex: 'invoiceCrtOpeTime', sortable: true},
                {text: '流水号', width: 160, dataIndex: 'chargeSeq', sortable: true}
            ];
        return columns;
    }
});