Ext.define('Ming.view.fee.common.PayWay', {
    extend: 'Ext.panel.Panel',
    xtype: 'fee-common-payway',
    reference: 'payWay',
    requires: [
        'Ming.view.fee.common.PayWayModel',
        'Ming.view.fee.common.PayWayController'
    ],
    plugins: [{ptype: 'PRQ'}],
    controller: 'fee-common-payway',
    viewModel: {type: 'fee-common-payway'},
    config: {
        /**
         * @cfg {Object} opeMode
         * A结算操作，B取消结算操作，C修改结算方式操作
         */
        opeMode: null
    },
    layout: {
        type: 'anchor'
    },

    initComponent: function () {
        var me = this;
        me.items = me.makeItems();
        me.callParent();
    },

    makeItems: function () {
        var me = this, totalTitle;
        if (me.opeMode == 'A') {
            totalTitle = '应付款总额';
        } else if (me.opeMode == 'B') {
            totalTitle = '取消付款总额';
        } else {
            totalTitle = '修改付款总额';
        }
        return [
            {
                xtype: 'fieldset', title: '',
                padding: '10 10 10 10',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'displayfield',
                        reference: 'prePayAmount',
                        fieldLabel: '<font size="3">' + totalTitle + '</font>',
                        labelSeparator: '：',
                        labelWidth: 150,
                        bind: {
                            value: '{totalBalanceAmount}'
                        }
                    }
                ]
            },
            me.makeGrid()
        ];
    },

    makeGrid: function () {
        var me = this,
            gridPanel,
            gridStore;
        gridPanel = {
            xtype: 'gridpanel',
            title: '付款明细',
            reference: 'gridPanel',
            sortableColumns: false,
            enableColumnHide: false,
            border: false,
            columnLines: true,
            columns: me.makeColumns()
        };

        if (me.opeMode == 'A') {
            gridPanel.plugins = {
                cellediting: {
                    clicksToEdit: 1,
                    listeners: {
                        beforeedit: 'onPayWayBeforeEdit',
                        validateedit: 'onPayWayValidateEdit'
                    }
                }
            };
            gridStore = {
                data: [
                    {payWayDsc: '现金', payWay: 'CASH', payAmount: 0},
                    {payWayDsc: '支票', payWay: 'CHAQUE', payAmount: 0},
                    {payWayDsc: '刷卡', payWay: 'CARD', payAmount: 0},
                    {payWayDsc: '预付', payWay: 'PREPAY', payAmount: 0}
                ]
            };
        } else if (me.opeMode == 'B') {
        } else {
            gridPanel.plugins = {
                rowwidget: {
                    widget: {
                        xtype: 'grid',
                        plugins: {
                            cellediting: {
                                clicksToEdit: 1,
                                listeners: {
                                    beforeedit: 'onPayWayBeforeEdit',
                                    validateedit: 'onPayWayValidateEdit'
                                }
                            }
                        },
                        bind: {
                            store: {
                                data: '{record.balanceDetailList}'
                            }
                        },
                        columns: [
                            {text: '付款方式', dataIndex: 'dsc', flex: 1},
                            {text: '付款金额', dataIndex: 'payAmount', flex: 1},
                            {
                                text: '修改后付款金额', dataIndex: 'modifyPayAmount', flex: 1,
                                editor: {
                                    xtype: 'numberfield',
                                    allowBlank: false
                                }
                            }
                        ]
                    }
                }
            };
            gridStore = {
                data: me.getViewModel().get('gridData')
            };
        }
        gridPanel.store = gridStore;

        return gridPanel;
    },

    makeColumns: function () {
        var me = this,
            columns = [];
        // 结算操作
        if (me.opeMode == 'A') {
            columns.push({text: '付款方式', dataIndex: 'payWay', flex: 1.5, hidden: true});
            columns.push({text: '付款方式', dataIndex: 'payWayDsc', flex: 1.5});
            columns.push({
                text: '付款金额', dataIndex: 'payAmount', flex: 1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false
                }
            });
        } else if (me.opeMode == 'B') {
            columns.push({text: '结算总额', dataIndex: 'sumPayAmount', flex: 1});
            columns.push({text: '取消总额', dataIndex: 'sumCancelPayAmount', flex: 1});
            columns.push({text: '结算人', dataIndex: 'moneyOperChn', flex: 1});
            columns.push({text: '营业点', dataIndex: 'opeDepartId', flex: 1});
            columns.push({text: '结算时间', dataIndex: 'moneyOpeTime', flex: 1});
            columns.push({text: '结算方式id', dataIndex: 'payWay', flex: 1, hidden: true});
            columns.push({text: '结算方式', dataIndex: 'dsc', flex: 1});
            columns.push({text: '付款金额', dataIndex: 'payAmount', flex: 1});
            columns.push({
                text: '取消金额', dataIndex: 'cancelPayAmount', flex: 1,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false
                }
            });
        } else {
            // 修改结算方式
            columns.push({text: '结算总额', dataIndex: 'sumPayAmount', flex: 1});
            columns.push({text: '付款总额', dataIndex: 'sumModifyPayAmount', flex: 1});
            columns.push({text: '结算人', dataIndex: 'moneyOperChn', flex: 1});
            columns.push({text: '营业点', dataIndex: 'opeDepartId', flex: 1});
            columns.push({text: '结算时间', dataIndex: 'moneyOpeTime', flex: 1});
        }
        return columns;
    },
    buttons: [
        {text: '保存', reference: 'save', listeners: {click: 'savePayWay'}},
        {text: '取消', reference: 'cancel', listeners: {click: 'cancelPayWay'}}
    ]
});