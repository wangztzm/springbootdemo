Ext.define('expand.overrides.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',

    // 预览模式是否开启
    previewMode: true,

    getPagingItems: function () {
        var me = this,
            pagingItems = me.callParent(),
            items = [],
            pageSizeCombox = null;
        // pagingItems[4].triggers = {
        //     clear: false
        // };
        if (me.previewMode) {
            items = items.concat([{
                xtype: 'label',
                text: '预览模式:'
            },
                {
                    xtype: 'toggleslide',
                    state: false,
                    onText: '是',
                    offText: '否',
                    listeners: {
                        change: function (thiz, v) {
                            var grid = me.up('grid');
                            if (grid == null) return;
                            if (v && me.bufstore == null) {
                                me.bufstore = Ext.create('Ext.data.BufferedStore', {
                                    leadingBufferZone: 300,
                                    pageSize: 100,
                                    autoLoad: true,
                                    proxy: {
                                        type: 'ajax',
                                        actionMethods: {
                                            read: 'POST'
                                        },
                                        paramsAsJson: true,
                                        url: me.store.proxy.url,
                                        extraParams: {
                                            paging: true
                                        },
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'data.list'
                                        }
                                    },
                                    listeners: {
                                        beforeload: function (store, operation, eOpts) {
                                            var params = me.bufstore.proxy.extraParams;
                                            params.page = {};
                                            params.page.pageNo = 1;
                                            params.page.pageSize = 100;
                                            delete params.paging;
                                            var proxy = store.getProxy();
                                            proxy.startParam = proxy.pageParam = proxy.limitParam = proxy.sortParam = '';
                                        },
                                        load: function (thiz, records, successful, eOpts) {
                                            grid.reconfigure(me.bufstore);
                                        }
                                    }
                                });
                            } else {
                                grid.reconfigure(v ? me.bufstore : me.store);
                            }
                            pageSizeCombox.setDisabled(v);
                            Ext.each(pagingItems, function (rec) {
                                if (Ext.isString(rec)) return;
                                var item = me.child('#' + rec.itemId);
                                if (item) {
                                    rec.old_disabled = v ? item.isDisabled() : rec.old_disabled;
                                    var disabled = v == true ? true : rec.old_disabled;
                                    item.setDisabled(disabled);
                                }
                            });
                        }
                    }
                }
            ]);
        }

        pageSizeCombox = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: '页大小',
            labelWidth: 50,
            labelAlign: 'right',
            width: 140,
            isFormField: false,
            store: {
                data: [{
                    Value: 10
                },
                    {
                        Value: 20
                    },
                    {
                        Value: 50
                    }
                ]

            },
            /* viewname : 'v_pagesize', datas:[15]*/
            displayField: 'Value',
            valueField: 'Value',
            value: 20,
            emptyText: null,
            // triggers: {
            //     clear: false
            // },
            listeners: {
                select: function (combo, record, eOpts) {
                    if (me.store instanceof Ext.data.BufferedStore) return;
                    console.debug(record);
                    // var pagesize = record.get("id");
                    me.store.pageSize = combo.value;
                    me.store.loadPage(1);
                }
            }
        });
        items.push(pageSizeCombox);

        return items.concat(pagingItems);
    }
});