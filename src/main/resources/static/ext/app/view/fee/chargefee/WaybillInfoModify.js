Ext.define('Ming.view.fee.chargefee.WaybillInfoModify', {
    extend: 'Ext.form.Panel',
    xtype: 'fee-chargefee-waybillinfomodify',
    requires: [
        'Ming.view.fee.chargefee.WaybillInfoModifyModel'
    ],
    plugins: [{ptype: 'PRQ'}],
    controller: 'fee-chargefee-waybillinfomodify',
    viewModel: {
        type: 'fee-chargefee-waybillinfomodify'
    },
    reference: 'waybillForm',
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
    padding: '0 5',
    initComponent: function () {
        var me = this;

        // 设置组件
        me.items = me.makeItems();
        me.callParent();
    },
    makeItems: function () {
        var me = this,
            items;
        items = [
            {
                xtype: 'fieldset', title: '运单信息', padding: '0 5 5 0',
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'billId',
                        bind: '{theWaybill.billId}'
                    },
                    {
                        xtype: 'waybillnumber',
                        reference: 'waybillinfomodify-waybillnumber',
                        labelAlign: 'right', labelWidth: 80,
                        labelSeparator: '', readOnlyAll: true,
                        typeComboCfg: {
                            reference: 'waybillinfomodify-waybillnumber-type',
                            bind: '{theWaybill.stockTypeId}'
                        },
                        prefixTextfieldCfg: {
                            reference: 'waybillinfomodify-waybillnumber-pre',
                            bind: '{theWaybill.stockPre}'
                        },
                        numberTextfieldCfg: {
                            reference: 'waybillinfomodify-waybillnumber-number',
                            bind: '{theWaybill.stockNo}'
                        }
                    },
                    {
                        xtype: 'container', layout: {type: 'table', columns: 3},
                        defaults: {xtype: 'airport'},
                        items: [
                            {
                                fieldLabel: '始发站', name: 'sAirportId', maxLength: 5, allowBlank: false,
                                hideLabel: false, width: '100%', labelWidth: 80,
                                bind: '{theWaybill.sAirportId}'
                            },
                            {
                                fieldLabel: '中转站', name: 'dest1', maxLength: 5, allowBlank: true,
                                reference: 'dest1', hideLabel: false, width: '100%',
                                bind: '{theWaybill.dest1}'
                            },
                            {
                                fieldLabel: '目的站', name: 'eAirportId', maxLength: 5, allowBlank: false,
                                hideLabel: false, width: '100%',
                                bind: '{theWaybill.eAirportId}'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer', fieldLabel: '托运人', layout: 'hbox', labelSeparator: '',
                        labelAlign: 'right', labelWidth: 80,
                        items: [
                            {
                                xtype: 'customer',
                                fieldLabel: '托运人代码', name: 'shpCustomer', bind: '{theWaybill.shpCustomer}',
                                width: '25%', allowBlank: true, dataRelateToRef: 'shprName',
                                listeners: {change: 'onWaybillInfoModifyCustomerChange'}
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '托运人名称',
                                name: 'shprName',
                                bind: '{theWaybill.shprName}',
                                reference: 'shprName',
                                hideLabel: true,
                                width: '75%'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer', fieldLabel: '发货代理人', layout: 'hbox', labelSeparator: '',
                        labelAlign: 'right', labelWidth: 80,
                        items: [
                            {
                                xtype: 'customer',
                                fieldLabel: '发货代理人代码',
                                name: 'shpCustomerId',
                                bind: '{theWaybill.shpCustomerId}',
                                width: '25%',
                                allowBlank: true,
                                dataRelateToRef: 'shpCustomerName',
                                listeners: {change: 'onWaybillInfoModifyCustomerChange'}
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '发货代理人名称',
                                name: 'shpCustomerName',
                                bind: '{theWaybill.shpCustomerName}',
                                reference: 'shpCustomerName',
                                hideLabel: true,
                                width: '75%',
                                readOnly: true
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer', fieldLabel: '收货代理人', layout: 'hbox', labelSeparator: '',
                        labelAlign: 'right', labelWidth: 80,
                        items: [
                            {
                                xtype: 'customer',
                                fieldLabel: '收货代理人代码', name: 'csgCustomerId', bind: '{theWaybill.csgCustomerId}',
                                width: '25%', dataRelateToRef: 'csgCustomerName',
                                listeners: {change: 'onWaybillInfoModifyCustomerChange'}
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '收货代理人名称',
                                name: 'csgCustomerName',
                                bind: '{theWaybill.csgCustomerName}',
                                reference: 'csgCustomerName',
                                hideLabel: true,
                                width: '75%',
                                readOnly: true
                            }
                        ]
                    },
                    {
                        xtype: 'container', layout: {type: 'table', columns: 3},
                        defaults: {
                            hideTrigger: true,
                            xtype: 'numberfield',
                            labelAlign: 'right',
                            labelSeparator: '',
                            width: '100%',
                            allowBlank: false
                        },
                        items: [
                            {
                                fieldLabel: '件数', name: 'pcs', bind: '{theWaybill.pcs}', labelWidth: 80,
                                allowDecimals: false, vtype: 'greaterThanZero'
                            },
                            {fieldLabel: '重量', name: 'weight', bind: '{theWaybill.weight}', vtype: 'greaterThanZero'},
                            {fieldLabel: '计费重量', name: 'feeWt', bind: '{theWaybill.feeWt}', vtype: 'greaterThanZero'}
                        ]
                    },
                    {
                        xtype: 'cargosort', labelAlign: 'right', labelSeparator: '', labelWidth: 80,
                        codeComboCfg: {allowBlank: false, width: '25%', bind: '{theWaybill.cargoNo}'},
                        nameTextfieldCfg: {
                            allowBlank: false, width: '75%', bind: '{theWaybill.cargoNm}', name: 'cargoNm'
                        },
                        domInt: me.domInt,
                        expImp: me.expImp
                    },
                    {
                        xtype: 'specialcode', labelAlign: 'right', labelSeparator: '', labelWidth: 80,
                        textFieldSelCfg: {
                            width: '25%',
                            inputTextfieldCfg: {name: 'specOpeId', width: '100%', bind: '{theWaybill.specOpeId}'}
                        },
                        extTextFieldSelCfg: {
                            width: '75%',
                            inputTextfieldCfg: {name: 'specOpeIdExt', width: '100%', bind: '{theWaybill.specOpeIdExt}'}
                        }
                    },
                    {
                        xtype: 'container', layout: {type: 'table', columns: 3},
                        defaults: {labelAlign: 'right', labelSeparator: ''},
                        items: [
                            {
                                xtype: 'combobox',
                                fieldLabel: '冷藏',
                                labelWidth: 80,
                                name: 'refrigerated',
                                bind: '{theWaybill.refrigerated}',
                                viewname: 'REFRIGERATEDTYPE',
                                width: '100%'
                            },
                            {
                                xtype: 'checkboxgroup', width: '100%', fieldLabel: ' ',
                                items: [
                                    {
                                        xtype: 'checkboxfield',
                                        boxLabel: '海关监管',
                                        name: 'customCtl',
                                        bind: '{theWaybill.customCtl}',
                                        inputValue: 'Y',
                                        uncheckedValue: 'N',
                                        width: '100%'
                                    },
                                    {
                                        xtype: 'checkboxfield',
                                        boxLabel: '是否转关',
                                        name: 'customStrans',
                                        bind: '{theWaybill.customStrans}',
                                        inputValue: 'Y',
                                        uncheckedValue: 'N',
                                        width: '100%'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container', layout: {type: 'table', columns: 2},
                        defaults: {
                            xtype: 'textfield', labelAlign: 'right', labelSeparator: '', readOnly: true, width: '100%'
                        },
                        items: [
                            {
                                fieldLabel: '制单人',
                                name: 'confirmOper',
                                bind: '{theWaybill.confirmOper}',
                                labelWidth: 80,
                                submitValue: false
                            },
                            {
                                fieldLabel: '制单时间',
                                name: 'confirmOpeTime',
                                value: CU.getTimeMinutes(),
                                bind: '{theWaybill.confirmOpeTime}'
                            }
                        ]
                    }
                ]
            }
        ];
        return items;
    },
    buttons: [
        {text: '保存', handler: 'onWaybillModifySubmit'},
        {text: '退出', handler: 'onWaybillModifyCancel'}
    ]
});