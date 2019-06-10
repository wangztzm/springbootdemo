Ext.define('Ming.view.fee.chargefee.ChargeFee', {
    extend: 'Ext.panel.Panel',
    xtype: 'fee-chargefee-chargefee',
    requires: [
        'Ming.view.fee.chargefee.ChargeFeeController',
        'Ming.view.fee.chargefee.ChargeFeeModel'
    ],
    controller: 'fee-chargefee-chargefee',
    viewModel: {
        type: 'fee-chargefee-chargefee'
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
        expImp: null,

        /**
         * @cfg {Object} bizOpe
         * 计费点
         */
        bizOpe: null,

        /**
         * @cfg {Object} businessSeq
         * 业务号
         */
        businessSeq: null,

        /**
         * @cfg {Object} billList
         * 运单列表
         */
        billList: null
    },

    initComponent: function () {
        var me = this;
        me.items = me.makeItems();
        me.callParent();
    },

    makeItems: function () {
        var me = this,
            bizOpe = me.bizOpe,
            searchFormHidden = true,
            batchPickWaybillBtnHidden = true;
        // 进港计费和出港计费显示挑单、批量挑单控件
        if (bizOpe == 'EFEE' || bizOpe == 'IFEE') {
            searchFormHidden = false;
            batchPickWaybillBtnHidden = false;
        }
        return [
            {
                xtype: 'grid', reference: 'gridPanel', region: 'center',
                sortableColumns: false,
                enableColumnHide: false,
                emptyText: '暂无数据',
                bind: {store: '{fees}'},
                listeners: {select: 'onRowSelect'},
                columnLines: true,
                dockedItems: [
                    {
                        xtype: 'toolbar', layout: {type: 'anchor'},
                        items: [
                            {
                                xtype: 'container', layout: {type: 'hbox'}, defaults: {xtype: 'button'},
                                items: [
                                    {
                                        xtype: 'form', layout: {type: 'hbox'}, reference: 'searchForm', hidden: searchFormHidden,
                                        items: [
                                            {
                                                xtype: 'waybillnumber', labelAlign: 'right', labelWidth: 64, width: 380,
                                                prefixTextfieldWidth: 64, numberTextfieldWidth: 120, labelSeparator: '',
                                                domInt: me.domInt
                                            },
                                            {
                                                xtype: 'button', text: '挑单', formBind: true, listeners: {
                                                    click: 'onPickWaybill'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        text: '批量挑单', reference: 'batchPickWaybillBtn', style: 'margin-left: 10px;', listeners: {
                                            click: 'onBatchPickWaybill'
                                        }, hidden: batchPickWaybillBtnHidden
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset', title: '客户信息', ui: 'fieldset', padding: '0 0',
                                items: [
                                    {
                                        xtype: 'fieldcontainer', fieldLabel: '结算客户', layout: 'hbox', labelSeparator: '',
                                        labelAlign: 'right', labelWidth: 64,
                                        items: [
                                            {
                                                xtype: 'customer', reference: 'settlementCustomer', allowBlank: true,
                                                fieldLabel: '结算客户代码', style: 'margin-bottom: 0px;', width: 80,
                                                listeners: {
                                                    change: 'onSettlementCustomerChange'
                                                }
                                            },
                                            {
                                                xtype: 'textfield', reference: 'settlementCustomerName',
                                                fieldLabel: '结算客户名称', hideLabel: true, width: 200
                                            },
                                            {
                                                xtype: 'combobox',
                                                name: 'payWay',
                                                reference: 'payWay',
                                                fieldLabel: '',
                                                viewname: 'PAYWAY',
                                                value: 'CASH',
                                                width: 100,
                                                style: 'margin-left: 20px;'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'toolbar', dock: 'bottom', defaults: {xtype: 'button', scale: 'small'},
                        ui: 'footer',
                        items: me.makeBottomToolbarItems()
                    },
                    {
                        xtype: 'toolbar', dock: 'bottom', style: 'padding-top: 2px;padding-bottom: 0px;',
                        defaults: {xtype: 'displayfield', labelWidth: 92, labelSeparator: '：'},
                        layout: {type: 'hbox'},
                        items: [
                            {fieldLabel: '【现结】票数', bind: {value: '{csNumber}'}},
                            {fieldLabel: '金额', labelWidth: 40, bind: {value: '{csAmount}'}},
                            {fieldLabel: '【记账】票数', bind: {value: '{mpNumber}'}},
                            {fieldLabel: '金额', labelWidth: 40, bind: {value: '{mpAmount}'}},
                            {fieldLabel: '【总计】票数', bind: {value: '{sumNumber}'}},
                            {fieldLabel: '金额', labelWidth: 40, bind: {value: '{sumAmount}'}}
                        ]
                    }
                ],
                columns: me.makeColumns()
            }
        ];
    },

    makeBottomToolbarItems: function () {
        var me = this,
            domInt = me.domInt,
            expImp = me.expImp,
            bizOpe = me.bizOpe,
            items = [],
            selectAllBtnHidden = false,
            deSelectAllBtnHidden = false,
            removeBtnHidden = false,
            opeDeptUsersHidden = true,
            saveBtnHidden = false,
            saveAndBalanceBtnHidden = false;

        if (bizOpe != 'MP') {// 普通业务点（隐藏：勾选框、全选、全不选、核对、结算；显示：清除、核对取消、核对并现结结算）
            selectAllBtnHidden = true;
            deSelectAllBtnHidden = true;
            saveBtnHidden = true;
        }

        if (bizOpe == 'EFEE' && domInt == 'I' && expImp == 'E') {
            opeDeptUsersHidden = false;
            saveBtnHidden = true;
        }

        return [
            '->',
            {text: '全选', listeners: {click: 'onSelectAll'}, hidden: selectAllBtnHidden},
            {text: '全不选', listeners: {click: 'onDeSelectAll'}, hidden: deSelectAllBtnHidden},
            {text: '清除', listeners: {click: 'onRemove'}, hidden: removeBtnHidden},
            {
                xtype: 'opedeptusers', fieldLabel: '结算人', style: 'margin-bottom: 0px;',
                labelWidth: 64, hidden: opeDeptUsersHidden
            },
            {text: '保存', listeners: {click: 'save'}, hidden: saveBtnHidden},
            {text: '取消核对', listeners: {click: 'cancelFee'}, reference: 'cancelFeeBtn', hidden: true},
            {text: '核对并现结结算', listeners: {click: 'saveAndCsBalance'}, hidden: saveAndBalanceBtnHidden}
        ];
    },

    makeColumns: function () {
        var me = this,
            columns = [
                {sortable: false, width: 40, xtype: 'rownumberer', align: 'center'},
                {text: '状态', dataIndex: 'feeStatusChn', width: 64, sortable: false},
                {text: '运单号', dataIndex: 'sBillId', width: 120, sortable: false},
                {text: '计费件数', dataIndex: 'curPcs', width: 74, sortable: false},
                {
                    text: '计费重量', dataIndex: 'curFeeWt', width: 74, sortable: false
                },
                {text: '仓储天数', dataIndex: 'whsTime', width: 74, sortable: false},
                {text: '费率', dataIndex: 'feeRate', width: 48, sortable: false},
                {text: '总费用', dataIndex: 'sumFee', width: 64, sortable: false},
                {
                    xtype: 'widgetcolumn', text: '历史', width: 48,
                    widget: {
                        xtype: 'button', text: '￥', ui: 'row-edit-button', scale: 'small',
                        listeners: {click: 'onHistoryClick'}
                    },
                    renderer: function (value, metaData, record) {
                        var data = record.data;
                        if (data.sameBizOpe === true) {
                            metaData.tdAttr = 'bgcolor=red';
                        }
                        return value;
                    },
                    onWidgetAttach: function (column, widget, record) {
                        var data = record.data;
                        if (data.hasHistory === true) {
                            widget.setDisabled(false);
                        } else {
                            widget.setDisabled(true);
                        }
                    }
                },
                {text: '航班', dataIndex: 'awbInfo_fltInfo', width: 140, sortable: false},
                {text: '特货代码', dataIndex: 'awbInfo_specOpeId', width: 74, sortable: false},
                {text: '品名', dataIndex: 'awbInfo_cargoNm', width: 120, sortable: false},
                {text: '方式', dataIndex: 'payModeDsc', width: 48, sortable: false},
                {text: '客户', dataIndex: 'customerId', width: 72, sortable: false},
                {text: '收/发货人', dataIndex: 'customerName', width: 80, sortable: false},
                {
                    xtype: 'widgetcolumn', text: '编辑', width: 56,
                    widget: {
                        xtype: 'panel', ui: 'row-edit-panel',
                        items: [
                            {
                                xtype: 'button', text: '编辑', ui: 'row-edit-button', scale: 'small',
                                listeners: {click: 'onFeeEditClick'}
                            }
                        ]
                    }
                },
                {
                    xtype: 'widgetcolumn', text: '运单', width: 56,
                    widget: {
                        xtype: 'panel', ui: 'row-edit-panel',
                        items: [
                            {
                                xtype: 'button', text: '运单', ui: 'row-edit-button', scale: 'small',
                                listeners: {click: 'onWaybillClick'}
                            }
                        ]
                    }
                }
            ];
        if (me.expImp == 'D') {
            columns.push({text: '发货人名称', dataIndex: 'awbInfo.shprName', width: 120, sortable: false});
            columns.push({text: '代理人名称', dataIndex: 'awbInfo.shpCustomerName', width: 120, sortable: false});
            columns.push({text: '始发站', dataIndex: 'awbInfo.sAirportId', width: 64, sortable: false});
            columns.push({text: '目的站', dataIndex: 'awbInfo.eAirportId', width: 64, sortable: false});
            columns.push({text: '海关监管', dataIndex: 'awbInfo.customCtl', width: 74, sortable: false});
        }

        return columns;
    }
})
;