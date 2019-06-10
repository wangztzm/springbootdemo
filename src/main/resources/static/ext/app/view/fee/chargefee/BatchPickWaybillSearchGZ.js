Ext.define('Ming.view.fee.chargefee.BatchPickWaybillSearchGZ', {
    extend: 'Ext.form.Panel',
    xtype: 'fee-chargefee-batchpickwaybillsearch-gz',
    reference: 'searchForm',
    defaults: {style: 'margin-bottom: 5px;'},
    config: {
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
                        xtype: 'customer',
                        fieldLabel: '收货人',
                        name: 'cusCode',
                        reference: 'cusCode',
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
                        fieldLabel: '实配航班号',
                        layout: {type: 'hbox'},
                        labelSeparator: '',
                        labelAlign: 'right',
                        labelWidth: 72,
                        width: 500,
                        items: [
                            {
                                xtype: 'carrier', fieldLabel: '航空公司，承运人', name: 'carrier',
                                flex: 1, allowBlank: true
                            },
                            {
                                xtype: 'textfield', fieldLabel: '航班号', name: 'flightNo',
                                hideLabel: true, flex: 2
                            },
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
                    },
                    {
                        xtype: 'opedepartment',
                        flex: 1,
                        displayField: 'opeDepartId',
                        value: cfg.sub.opedepartid,
                        name: 'opeDepart'
                    }
                ]
            },
            {
                xtype: 'container', layout: {type: 'hbox'},
                defaults: {labelSeparator: '', labelAlign: 'right', labelWidth: 64},
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: '收费方式',
                        name: 'payMode',
                        viewname: '',
                        labelWidth: 64,
                        labelSeparator: '', flex: 1,
                        displayField: 'text',
                        valueField: 'code',
                        store: {
                            data: [
                                {text: '全部', code: ''},
                                {text: '现结', code: 'CS'},
                                {text: '记账', code: 'MP'}
                            ]
                        }
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: '计费状态',
                        name: 'feeStatus',
                        viewname: '',
                        labelWidth: 64,
                        labelSeparator: '', flex: 1,
                        displayField: 'text',
                        valueField: 'code',
                        value: 'N',
                        store: {
                            data: [
                                {text: '全部', code: ''},
                                {text: '已核对', code: 'Y'},
                                {text: '未核对', code: 'N'}
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
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: '预配航班号',
                        layout: {type: 'hbox'},
                        labelSeparator: '',
                        labelAlign: 'right',
                        labelWidth: 72,
                        width: 500,
                        items: [
                            {
                                xtype: 'carrier', fieldLabel: '预配航空公司，承运人', name: 'preCarrier',
                                flex: 1, allowBlank: true
                            },
                            {
                                xtype: 'textfield', fieldLabel: '预配航班号', name: 'preFlightNo',
                                hideLabel: true, flex: 2
                            },
                            {
                                xtype: 'checkboxfield', name: 'startDtPreFlightDateFlag',
                                hideLabel: true,
                                submitValue: false,
                                bind: '{startDtPreFlightDateFlag}'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '预配航班开始时间', name: 'startDtPreFlightDate',
                                reference: 'startDtPreFlightDate',
                                bind: {disabled: '{!startDtPreFlightDateFlag}'},
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
                                xtype: 'checkboxfield', name: 'endDtPreFlightDateFlag',
                                hideLabel: true,
                                submitValue: false,
                                bind: '{endDtPreFlightDateFlag}'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '预配航班结束时间', name: 'endDtPreFlightDate',
                                reference: 'endDtPreFlightDate',
                                bind: {disabled: '{!endDtPreFlightDateFlag}'},
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
                        xtype: 'specialcode-textfield-selector', flex: 1,
                        inputTextfieldCfg: {
                            hideLabel: false,
                            labelAlign: 'right',
                            labelSeparator: '',
                            allowBlank: true,
                            labelWidth: 64,
                            width: '100%',
                            style: 'margin-bottom: 0px;'
                        }
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
                        maxLength: 5,
                        labelWidth: 64,
                        hideLabel: false,
                        allowBlank: true, flex: 1
                    },
                    {
                        xtype: 'airport',
                        fieldLabel: '终点站',
                        name: 'eAirport',
                        maxLength: 5,
                        labelWidth: 64,
                        hideLabel: false,
                        allowBlank: true, flex: 1,
                        readOnly: true,
                        value: cfg.sub.airportId
                    },
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
                        viewname: '',
                        labelWidth: 64,
                        labelSeparator: '', flex: 1,
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
                        xtype: 'combobox',
                        fieldLabel: '审核状态',
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
                        xtype: 'button', text: '查询', width: 64,
                        listeners: {click: 'onBatchPickWaybillSearch'}
                    }
                ]
            }
        ];
    }
});