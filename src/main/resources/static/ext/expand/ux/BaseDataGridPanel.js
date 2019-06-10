Ext.define('Ming.expand.ux.BaseDataGridPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'basedata-grid',

    // 开启列字段过滤
    gridfilters: true,

    initComponent: function () {
        var me = this,
            bind,
            bindStore,
            myStore;
        bind = me.config.bind;
        if (bind && me.lookupViewModel()) {
            var bindStoreCfg,
                bindStoreName;
            if (Ext.isString(bind)) {
                bindStoreCfg = bind;
            } else if (Ext.isObject(bind) && bind.store) {
                bindStoreCfg = bind.store;
            }
            bindStoreName = bindStoreCfg && bindStoreCfg.replace('{', '').replace('}', '');
            bindStore = bindStoreName && me.lookupViewModel().getStore(bindStoreName);
            delete me.store;
        }
        myStore = bindStore ? bindStore : me.store;
        if (!(myStore instanceof Ext.data.Store)) {
            me.store = myStore = Ext.create(me.store);
        }
        if (me.paging) {
            if (myStore.getRemoteSort()) {
                myStore.on('beforeload', function (store, operation, eOpts) {
                    // console.debug(store,operation,eOpts);
                    var params = store.proxy.extraParams;
                    // //addbyzihui 添加分页逻辑 20180920
                    params.page = {};
                    params.page.pageNo = operation.getPage();
                    params.page.pageSize = operation.getLimit();
                    delete params.paging;
                    var proxy = store.getProxy();
                    proxy.startParam = proxy.pageParam = proxy.limitParam = proxy.sortParam = '';
                    if (store.filters && store.filters.items.length > 0) {
                        for (var i = store.filters.items.length - 1; i >= 0; i--) {
                            var item = store.filters.items[i];
                            if (item.source == 'searchfield') {
                                params[item._property] = item._value;
                                store.getFilters().remove(item);
                            }
                        }
                    }
                    var sorters = operation.getSorters();
                    if (Ext.isArray(sorters)) {
                        // addbyzihui 添加排序逻辑 20180920
                        // params.sortField = sorters[0].getProperty();
                        // params.sortOrder = sorters[0].getDirection();

                        params.page.orderBy = sorters[0].getProperty() + ' ' + sorters[0].getDirection();
                        // params.page.pageSize=operation.getLimit();

                    }
                });
            }

            if (Ext.isEmpty(me.bbar)) {
                var cfg = Ext.apply({store: me.store, displayInfo: true}, me.ptcfg);
                me.bbar = new Ext.PagingToolbar(cfg);
            } else {
                if (me.bbar instanceof Ext.toolbar.Paging) {
                    me.bbar.bindStore(me.store);
                } else {
                    me.bbar.store = me.store;
                }
            }
        }

        if (Ext.isEmpty(me.viewConfig)) me.viewConfig = {};
        if (Ext.isEmpty(me.viewConfig.emptyText)) me.viewConfig.emptyText = '暂无数据';
        if (me.gridfilters == true && myStore && myStore.proxy && !(me.plugins && me.plugins.gridfilters === true)) {
            if (Ext.isEmpty(me.plugins)) me.plugins = [];
            if (Ext.isString(me.plugins)) me.plugins = [me.plugins];
            if (Ext.isEmpty(myStore.proxy.extraParams)) myStore.proxy.extraParams = {};
            myStore.proxy.filterParam = 'sys_grid_filterparams';
            // 临时注释
            // me.store.proxy.extraParams.filterParams = true;
            myStore.remoteFilter = true;
            me.plugins.push(Ext.create('Ext.grid.filters.Filters', {menuFilterText: '筛选条件'}));
            me.initGridFilters();
        }
        this.callParent();
    },

    /**
     * 添加字段过滤条件
     */
    initGridFilters: function () {
        Ext.each(this.columns, function (column) {
            if (Ext.isEmpty(column.qcfg)) return;
            var filter = column.filter = {type: column.qcfg.type};
            switch (column.qcfg.type) {
                case 'datetime' : {
                    filter.type = 'date';
                    filter.dateFormat = 'Y-m-d';
                    filter.fields = {
                        lt: {text: '小于'},
                        gt: {text: '大于'},
                        eq: {text: '等于'}
                    };
                    break;
                }
                case 'combobox' : {
                    filter.itemDefaults = {
                        viewname: column.viewname
                    };
                    break;
                }
                case 'string' : {
                    filter.emptyText = '输入过滤条件…';
                    break;
                }
                default: {
                    break;
                }
            }
        });
    },

    /**
     * 增加永久条件
     * @param {} params
     */
    setBaseParam: function (params) {
        var me = this;
        me.store.proxy.extraParams = Ext.apply(me.store.proxy.extraParams, params);
    },

    /**
     * 清空永久条件
     * @param {} params
     */
    removeBaseParam: function (params) {
        var me = this;
        me.store.proxy.extraParams = {paging: me.paging};
    },

    /**
     * 加载数据
     * @param {} params  参数
     * @param {} callback 成功回调
     * @param {} config
     */
    load: function (params, callback, config) {
        var me = this;
        var config = Ext.isEmpty(config) ? {} : config;
        config.params = config.params || params;
        config.isCacheParams = Ext.isEmpty(config.isCacheParams) ? true : config.isCacheParams;
        config.callback = config.callback || callback;
        if (config.isCacheParams) {
            me.store.proxy.extraParams = Ext.apply(me.store.proxy.extraParams, config.params);
        }
        if (me.paging) {
            me.getStore().loadPage(1, config);
        } else {
            me.getStore().load(config);
        }
    },

    /**
     * 获取grid全部数据
     * @return {}
     */
    getValues: function () {
        var me = this;
        var rowIndex = me.getStore().getCount();
        var data = [];
        for (var i = 0; i < rowIndex; i++) {
            data.push(me.getStore().getAt(i).data);
        }

        return data;
    },

    /**
     * 获取选中数据
     * @return {}
     */
    getSelectValues: function () {
        var me = this;
        var data = [];
        Ext.each(me.getSelection(), function (rec) {
            data.push(rec.data);
        });

        return data;
    },

    /**
     * 判断数据是否修改 true = 修改
     * @return {}
     */
    isDirty: function () {
        var me = this;
        var store = me.getStore();
        var myNew = store.getNewRecords();
        var myRemove = store.getRemovedRecords();
        var myUpdate = store.getUpdatedRecords();

        return myNew.length > 0 || myRemove.length > 0 || myUpdate.length > 0;
    },

    /**
     * 获取增加、删除、修改后的数据集合。row.state 为added/updateded/removed。
     * @return {}
     */
    getChanges: function () {
        var me = this;
        var store = me.getStore();
        var changes = [];
        var myNew = store.getNewRecords();
        var myRemove = store.getRemovedRecords();
        var myUpdate = store.getUpdatedRecords();
        Ext.each(myNew, function (rec) {
            rec.state = 'added';
            changes.push(rec);
        });
        Ext.each(myRemove, function (rec) {
            rec.state = 'removed';
            changes.push(rec);
        });
        Ext.each(myUpdate, function (rec) {
            rec.state = 'updateded';
            changes.push(rec);
        });

        return changes;
    },

    /**
     * 根据ID获取行数据对象
     * @param {} id
     * @return {}
     */
    getRecord: function (id) {
        var store = this.getStore();
        var rowIndex = store.indexOfId(id);
        var rec = store.getAt(rowIndex);

        return rec;
    },

    /**
     * 获取grid全部行数据对象
     * @return {}
     */
    getRecValues: function () {
        var me = this;
        var rowIndex = me.getStore().getCount();
        var data = [];
        for (var i = 0; i < rowIndex; i++) {
            data.push(me.getStore().getAt(i));
        }

        return data;
    },

    /**
     * 获取grid单列数据
     * @param field  dataIndex 或 方法
     * @return 数组
     */
    getFieldDataAt: function (field) {
        var me = this, datas = [];
        Ext.each(me.getStore().data.items, function (rec) {
            if (Ext.isFunction(field)) {
                datas.push(Ext.callback(field, this, [rec]));
            } else {
                var value = rec.get(field);
                datas.push(value);
            }
        });

        return datas;
    }
});
