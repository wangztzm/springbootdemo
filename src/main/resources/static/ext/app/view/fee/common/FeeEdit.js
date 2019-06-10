Ext.define('Ming.view.fee.common.FeeEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'fee-common-feeedit',
    reference: 'feeEidt',
    requires: [
        'Ming.view.fee.common.FeeEditModel',
        'Ming.view.fee.common.FeeEditController'
    ],
    plugins: [{ptype: 'PRQ'}],
    controller: 'fee-common-feeedit',
    viewModel: {type: 'fee-common-feeedit'},
    layout: {type: 'anchor'},
    items: [
        {
            xtype: 'fieldset', title: '计费信息', height: 80,
            margin: '5 5',
            items: [
                {
                    defaults: {xtype: 'textfield'},
                    items: [
                        {
                            xtype: 'waybillnumber',
                            reference: 'feeedit-waybillnumber',
                            selectAfterLoad: false,
                            labelWidth: 56,
                            labelSeparator: '',
                            labelAlign: 'right',
                            readOnlyAll: true,
                            typeComboCfg: {
                                readOnly: false,
                                allowBlank: true,
                                forceSelection: false,
                                editable: true
                            },
                            prefixTextfieldCfg: {
                                allowBlank: true,
                                allowOnlyWhitespace: true
                            },
                            numberTextfieldCfg: {
                                allowBlank: true,
                                allowOnlyWhitespace: true
                            }
                        },
                        {
                            xtype: 'container',
                            layout: {type: 'hbox'},
                            items: [
                                {
                                    xtype: 'fieldcontainer', layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'customer',
                                            fieldLabel: '结算客户',
                                            name: 'customerId',
                                            hideLabel: false,
                                            allowBlank: true,
                                            maxLength: 30,
                                            labelWidth: 56,
                                            width: 130,
                                            bind: {
                                                value: '{theFee.customerId}',
                                                readOnly: '{customerReadOnly}'
                                            },
                                            listeners: {
                                                // change: 'onAwbPickNameChange'
                                            }
                                        },
                                        {
                                            xtype: 'textfield', name: 'customerName',
                                            bind: {
                                                value: '{theFee.customerName}',
                                                readOnly: '{customerReadOnly}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'radiogroup', simpleValue: true, bind: '{theFee.payMode}',
                                    items: [
                                        {boxLabel: '现结', name: 'payMode', inputValue: 'CS'},
                                        {boxLabel: '记账', name: 'payMode', inputValue: 'MP'}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'fieldset', title: '费用明细', anchor: '100% -85',
            margin: '5 5',
            items: [
                {
                    xtype: 'gridpanel',
                    reference: 'feeEditGrid',
                    sortableColumns: false,
                    enableColumnHide: false,
                    bind: {
                        store: {
                            data: '{theFee.feeDetailList}'
                        }
                    },
                    plugins: {
                        cellediting: {
                            clicksToEdit: 1
                        }
                    },
                    listeners: {
                        beforeedit: 'beforeedit',
                        validateedit: 'validateedit',
                        edit: 'edit'
                    },
                    border: false,
                    columnLines: true,
                    columns: [
                        {
                            text: '计费项名称',
                            dataIndex: 'feeId',
                            editor: {
                                field: {
                                    xtype: 'combo',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    displayField: 'feeShortNm',
                                    valueField: 'feeId',
                                    bind: {store: '{feeItemAndBizOpe}'}
                                }
                            },
                            renderer: 'feeItemColumnRenderer',
                            flex: 1.5
                        }, {
                            text: '费率',
                            dataIndex: 'feeRate',
                            editor: {
                                field: {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    hideTrigger: true,
                                    allowBlank: false
                                }
                            },
                            flex: 1
                        }, {
                            text: '计费重量',
                            dataIndex: 'feeWt',
                            flex: 1
                        }, {
                            text: '费用',
                            dataIndex: 'fee',
                            editor: {
                                field: {
                                    xtype: 'numberfield',
                                    minValue: 0,
                                    hideTrigger: true,
                                    allowBlank: false
                                }
                            },
                            flex: 1
                        }, {
                            text: '备注',
                            dataIndex: 'feeRemark',
                            editor: {
                                field: {
                                    xtype: 'textfield'
                                }
                            },
                            flex: 1
                        }, {
                            text: '计算途径',
                            dataIndex: 'calWay',
                            flex: 1,
                            renderer: 'calWayColumnRenderer'
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {text: '新增', handler: 'onFeeEditAddFee', bind: {disabled: '{btnDisable}'}},
        {text: '移除', handler: 'onFeeEditRemoveFee', bind: {disabled: '{btnDisable}'}},
        {text: '确定', handler: 'onFeeEditSubmit', bind: {disabled: '{btnDisable}'}}
    ]
});