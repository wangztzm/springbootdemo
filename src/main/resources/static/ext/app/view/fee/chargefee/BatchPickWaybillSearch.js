Ext.define('Ming.view.fee.chargefee.BatchPickWaybillSearch', {
    extend: 'Ext.form.Panel',
    xtype: 'fee-chargefee-batchpickwaybillsearch',
    reference: 'searchForm',
    defaults: {style: 'margin-bottom: 5px;'},
    items: [
        {
            xtype: 'container', layout: {type: 'hbox'},
            defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
            items: [
                {
                    xtype: 'customer',
                    fieldLabel: '代理人',
                    name: 'sfDl',
                    reference: 'sfDl',
                    hideLabel: false,
                    allowBlank: true,
                    labelWidth: 64,
                    flex: 1
                },
                {
                    xtype: 'carrier',
                    fieldLabel: '承运人',
                    name: 'carrier',
                    reference: 'carrier',
                    hideLabel: false,
                    allowBlank: true,
                    labelWidth: 64,
                    flex: 1
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '收货人名称',
                    name: 'shprname',
                    labelWidth: 72,
                    flex: 1
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '航班日期',
                    layout: {type: 'hbox'},
                    labelSeparator: '',
                    labelAlign: 'right',
                    labelWidth: 72,
                    flex: 2,
                    items: [
                        {
                            xtype: 'checkboxfield',
                            name: 'startDtFlightDateFlag',
                            hideLabel: true,
                            submitValue: false,
                            bind: '{startDtFlightDateFlag}'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '实配航班开始时间', name: 'startDtFlightDate',
                            reference: 'startDtFlightDate',
                            bind: {disabled: '{!startDtFlightDateFlag}'},
                            hideLabel: true, width: 100,
                            inputCls: 'Wdate', value: CU.getBeforeDate(3),
                            listeners: {
                                render: function (p) {
                                    p.getEl().on('click', function () {
                                        WdatePicker({
                                            el: p.getInputId(),
                                            doubleCalendar: true,
                                            dateFmt: 'yyyy-MM-dd'
                                            // maxDate:'%y-%M-%d'
                                        });
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield', name: 'endDtFlightDateFlag',
                            hideLabel: true,
                            submitValue: false,
                            bind: '{endDtFlightDateFlag}'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '实配航班结束时间', name: 'endDtFlightDate',
                            reference: 'endDtFlightDate',
                            bind: {disabled: '{!endDtFlightDateFlag}'},
                            hideLabel: true, width: 100,
                            inputCls: 'Wdate', value: CU.getBeforeDate(-1),
                            listeners: {
                                render: function (p) {
                                    p.getEl().on('click', function () {
                                        WdatePicker({
                                            el: p.getInputId(),
                                            doubleCalendar: true,
                                            dateFmt: 'yyyy-MM-dd'
                                            // maxDate:'%y-%M-%d'
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
            xtype: 'container', layout: {type: 'hbox'},
            defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
            items: [
                {
                    xtype: 'airport',
                    fieldLabel: '起始站',
                    name: 'sAirport',
                    reference: 'sAirport',
                    maxLength: 5,
                    labelWidth: 64,
                    hideLabel: false,
                    allowBlank: true, flex: 1
                },
                {
                    xtype: 'airport',
                    fieldLabel: '中转站',
                    name: 'dest1',
                    maxLength: 5,
                    labelWidth: 64,
                    hideLabel: false,
                    allowBlank: true, flex: 1
                },
                {
                    xtype: 'airport',
                    fieldLabel: '终点站',
                    name: 'eAirport',
                    reference: 'eAirport',
                    maxLength: 5,
                    labelWidth: 72,
                    hideLabel: false,
                    allowBlank: true, flex: 1
                },
                {
                    xtype: 'combobox',
                    fieldLabel: '单货审核',
                    name: 'chked',
                    viewname: '',
                    labelWidth: 64,
                    labelSeparator: '', flex: 1,
                    displayField: 'text',
                    valueField: 'code',
                    value: '',
                    store: {
                        data: [
                            {text: '全部', code: ''},
                            {text: '已审核', code: 'Y'},
                            {text: '未审核', code: 'N'}
                        ]
                    }
                },
                {
                    xtype: 'combobox',
                    fieldLabel: '结算状态',
                    name: 'balanceStatus',
                    viewname: '',
                    labelWidth: 64,
                    labelSeparator: '', flex: 1,
                    displayField: 'text',
                    valueField: 'code',
                    value: 'N',
                    store: {
                        data: [
                            {text: '全部', code: ''},
                            {text: '已结算', code: 'Y'},
                            {text: '未结算', code: 'N'}
                        ]
                    }
                }
            ]
        },
        {
            xtype: 'container', layout: {type: 'hbox'},
            defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
            items: [
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '制单时间',
                    layout: {type: 'hbox'}, width: 320,
                    items: [
                        {
                            xtype: 'checkboxfield',
                            name: 'startConFirmOpeTimeFlag',
                            hideLabel: true,
                            submitValue: false,
                            bind: '{startConFirmOpeTimeFlag}'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '制单开始日期', name: 'startConFirmOpeTime',
                            reference: 'startConFirmOpeTime',
                            bind: {disabled: '{!startConFirmOpeTimeFlag}'},
                            hideLabel: true, width: 100,
                            inputCls: 'Wdate', value: CU.getBeforeDate(3),
                            listeners: {
                                render: function (p) {
                                    p.getEl().on('click', function () {
                                        WdatePicker({
                                            el: p.getInputId(),
                                            doubleCalendar: true,
                                            dateFmt: 'yyyy-MM-dd'
                                            // maxDate:'%y-%M-%d'
                                        });
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield', name: 'endConfirmOpeTimeFlag',
                            hideLabel: true,
                            submitValue: false,
                            bind: '{endConfirmOpeTimeFlag}'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '制单班结束日期', name: 'endConfirmOpeTime',
                            reference: 'endConfirmOpeTime',
                            bind: {disabled: '{!endConfirmOpeTimeFlag}'},
                            hideLabel: true, width: 100,
                            inputCls: 'Wdate', value: CU.getBeforeDate(-1),
                            listeners: {
                                render: function (p) {
                                    p.getEl().on('click', function () {
                                        WdatePicker({
                                            el: p.getInputId(),
                                            doubleCalendar: true,
                                            dateFmt: 'yyyy-MM-dd'
                                            // maxDate:'%y-%M-%d'
                                        });
                                    });
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'combobox',
                    fieldLabel: '监管',
                    name: 'customCtl',
                    reference: 'customCtl',
                    viewname: '',
                    labelWidth: 64,
                    width: 136,
                    labelSeparator: '',
                    displayField: 'text',
                    valueField: 'code',
                    value: 'Y',
                    store: {
                        data: [
                            {text: '全部', code: ''},
                            {text: '是', code: 'Y'},
                            {text: '否', code: 'N'}
                        ]
                    }
                },
                {
                    xtype: 'button', text: '查询', width: 64,
                    style: 'margin-left: 16px;',
                    listeners: {click: 'onBatchPickWaybillSearch'}
                }
            ]
        }
    ]
});