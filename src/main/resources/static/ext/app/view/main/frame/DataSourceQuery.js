/**
 * extjs 组件数据源view
 * createby zihui
 *
 */
Ext.define('Ming.view.main.frame.DataSourceQuery', {
    extend: 'Ext.panel.Panel',
    xtype: 'dataSourceQuery',
    layout: 'fit',
    referenceHolder: true,
    controller: 'dataSourceQuery',
    plugins: [{
        ptype: 'PRQ'
    }],
    config: {
        multiple: false
    },
    listeners: {
        'beforeRender': 'onBeforeRender',
        'afterRender': 'onAfterRender'
    },

    initComponent: function () {
        var me = this;
        me.items = me.makeItems();
        me.callParent();
    },

    makeItems: function () {
        var me = this,
            selModel,
            muti = me.params.muti;//是否是多选
        if (muti) {
            selModel = {
                type: 'checkboxmodel',
                mode: 'MULTI'
            };
        } else {
            selModel = {
                type: 'rowmodel',
                mode: 'SINGLE'
            };
        }
        return [{
            'xtype': 'grid',
            reference: 'gridPanel',
            forceFit: true,
            selModel: selModel,
            listeners: {
                specialkey: 'onGridSubmit',
                rowdblclick: 'onWindowSubmit',
                rowkeydown: 'onGridKeyDown'
            }
        }];
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            reference: 'searchToolBar',
            items: [
                {
                    xtype: 'form',
                    reference: 'searchForm',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        xtype: 'textfield',
                        labelAlign: 'right',
                        margin: '0 0 0 5'
                    },
                    items: [
                        {
                            name: 'key',
                            reference: 'key',
                            fieldLabel: '关键字',
                            margin: '0 0 0 0',
                            labelWidth: 60,
                            enableKeyEvents: true,
                            listeners: {
                                keyup: 'onKeyUp',
                                specialkey: 'onNextRow'
                            }
                        },
                        {
                            xtype: 'button',
                            text: '查询',
                            width: 80,
                            listeners: {
                                click: 'onFilter'
                            }
                        }
                    ]
                }]
        }],

    buttons: [
        {
            text: '提交',
            handler: 'onWindowSubmit'
        },
        {
            text: '关闭',
            handler: 'onWindowClose'
        }
    ]
});