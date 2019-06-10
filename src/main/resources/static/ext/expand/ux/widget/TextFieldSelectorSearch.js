/**
 * 该组件包括一个搜索框和一个表格。
 * 选择条目后可将该条目指定字段的值回填到父组件的文本框。
 * 参照的MultiSelectorSearch
 * 查询使用自定义的默认过滤器：模糊匹配所有属性、忽略大小写。
 */
Ext.define('Ming.expand.ux.widget.TextFieldSelectorSearch', {
    extend: 'Ext.window.Window',

    xtype: 'textfieldselector-search',

    requires: [
        'Ext.util.DelayedTask'
    ],

    header: false,

    /**
     * @cfg floating
     * @inheritdoc
     */
    floating: true,

    /**
     * @cfg alignOnScroll
     * @inheritdoc
     */
    alignOnScroll: false,

    /**
     * @cfg minWidth
     * @inheritdoc
     */
    minWidth: 200,

    /**
     * @cfg minHeight
     * @inheritdoc
     */
    minHeight: 200,

    /**
     * @cfg border
     * @inheritdoc
     */
    border: true,

    /**
     * @cfg keyMap
     * @inheritdoc
     */
    keyMap: {
        scope: 'this',
        ESC: 'hide'
    },

    platformConfig: {
        desktop: {
            resizable: true
        },
        'tablet && rtl': {
            resizable: {
                handles: 'sw'
            }
        },
        'tablet && !rtl': {
            resizable: {
                handles: 'se'
            }
        }
    },

    /**
     * @cfg defaultListenerScope
     * @inheritdoc
     */
    defaultListenerScope: true,

    config: {

        /**
         * @cfg {Object} owner
         * 所属组件
         */
        owner: null,

        /**
         * @cfg {Object} searchTextfieldCfg
         * 搜索文本框配置
         */
        searchTextfieldCfg: {},

        /**
         * @cfg {Object} searchGridCfg
         * 表格配置
         */
        searchGridCfg: {},

        /**
         * @cfg {Object} filterFields
         * localQuery时要查询的字段
         */
        filterFields: [],

        /**
         * @cfg {Object} queryMode
         * 可选值为：remote或者local
         * remote 查询时调用后台api
         */
        queryMode: 'local',

        /**
         * @cfg {Object} queryMode
         * 当queryMode为remote时，gridPanel的store传给后台接口的查询参数的名称，默认为query，
         */
        queryParam: 'query',

        /**
         * @cfg {Number} pageSize
         * 每页页数，大于0时，表示要用分页查询，gridpanel会在底部添加分页工具栏。
         * 仅当queryMode为remote时用到，gridPanel的store传给后台接口的参数。
         */
        pageSize: 0,

        /**
         * @cfg {Number} pageNo
         * 查询的页码
         * 仅当queryMode为remote时用到，gridPanel的store传给后台接口的参数。
         */
        pageNo: 1,

        /**
         * 保存返回结果中valueField属性的值。
         */
        valueArray: []
    },

    initComponent: function () {
        var me = this,
            isDefined = Ext.isDefined,
            isLocalMode,
            bindStore;

        // 如果bind到viewModel的store，则删除store配置项。
        var bind = me.searchGridCfg.bind;
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

            if (bindStore) {
                var pageSize = bindStore.pageSize ? bindStore.pageSize : me.pageSize;
                if (me.queryMode === 'remote' && pageSize) {
                    bindStore.pageSize = pageSize;
                }
                // 监听load事件
                me.mon(bindStore, 'load', 'onLoad', me);
                delete me.searchGridCfg.store;
            }
        }

        me.dockedItems = me.makeDockedItems();
        me.items = me.makeItems();

        // 监听自定义的表格行选择改变事件
        me.listeners = {
            customselectionchange: 'setFieldValue',
            scope: me.getOwner()
        };

        me.callParent();

        me.searchTextfieldItemId = me.searchTextfieldCfg.itemId;
        me.searchGridItemId = me.searchGridCfg.itemId;

        // 延迟查询任务
        isLocalMode = me.queryMode === 'local';
        if (!isDefined(me.queryDelay)) {
            me.queryDelay = isLocalMode ? 10 : 500;
        }
        me.doQueryTask = new Ext.util.DelayedTask(me.search, me);
    },

    afterShow: function () {
        var me = this;
        me.callParent(arguments);

        // Do not focus if this was invoked by a touch gesture
        if (!me.invocationEvent || me.invocationEvent.pointerType !== 'touch') {
            var searchField = me.getSearchTextfieldCmp();
            if (searchField) {
                searchField.focus();
            }
        }
        me.invocationEvent = null;
    },

    /**
     * 获取搜索框组件
     * @return {Object}
     */
    getSearchTextfieldCmp: function () {
        var me = this;

        return me.getComponent(me.searchTextfieldItemId);
    },

    /**
     * 获取表格组件
     * @return {Object}
     */
    getSearchGridCmp: function () {
        var me = this;

        return me.getComponent(me.searchGridItemId);
    },

    /**
     * 获取选中的记录
     */
    getSelectedRecords: function () {
        var me = this,
            searchGrid;
        searchGrid = me.getSearchGridCmp();

        return searchGrid.getSelection();
    },

    /**
     * Returns the store that holds searchCfg results. By default this comes from the
     * "searchCfg grid". If this aspect of the view is changed sufficiently so that the
     * searchCfg grid cannot be found, this method should be overridden to return the proper
     * store.
     * @return {Ext.data.Store}
     */
    getSearchStore: function () {
        var me = this;

        return me.store || me.getSearchGridCmp().getStore();
    },

    makeDockedItems: function () {
        var me = this,
            searchTextfieldCfg;

        me.searchTextfieldCfg = searchTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            itemId: 'searchField',
            dock: 'top',
            hideFieldLabel: true,
            emptyText: '搜索...',
            isFormField: false,
            cls: Ext.baseCSSPrefix + 'multiselector-search-input',
            triggers: {
                clear: {
                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    handler: 'onClearSearch',
                    hidden: true
                }
            },
            listeners: {
                specialKey: 'onSpecialKey',
                change: {
                    fn: 'onSearchChange',
                    buffer: 300
                }
            },
            keyMap: {
                scope: me,
                ENTER: 'onSearchFieldEnterKey',
                DOWN: 'onSearchFieldDownKey'

            }
        }, me.searchTextfieldCfg);

        return [
            searchTextfieldCfg
        ];
    },

    onSpecialKey: function (field, event) {
        if (event.getKey() === event.TAB && event.shiftKey) {
            event.preventDefault();
        }
    },

    makeItems: function () {
        var me = this,
            searchGridCfg,
            searchGridCfgStore;
        me.searchGridCfg = searchGridCfg = Ext.merge({
            xtype: 'grid',
            itemId: 'searchGrid',
            trailingBufferZone: 2,
            leadingBufferZone: 2,
            maxHeight: 400,
            viewConfig: {
                deferEmptyText: false,
                emptyText: '搜索无结果。'
            },
            columns: [{
                flex: 1,
                dataIndex: me.getOwner().getValueField()
            }],
            selModel: {
                type: 'checkboxmodel',
                pruneRemoved: false,
                mode: 'SINGLE',
                listeners: {
                    selectionchange: 'onSelectionChange'
                }
            },
            listeners: {
                rowdblclick: 'onRowDblClick',
                rowkeydown: 'onRowKeyDown'
            }
        }, me.searchGridCfg);

        if (me.queryCode && me.queryMode === 'local') {
            var callBack = function (data) {
                if (!data) {
                    return;
                }
                var me = this, optionAllItem = {}, storeConfig, filters = [];
                storeConfig = {data: data};
                if (me.storeFilters) {
                    if (Ext.isArray(me.storeFilters)) {
                        filters = me.storeFilters;
                    } else if (Ext.isFunction(me.storeFilters)) {
                        filters.push(me.storeFilters);
                    }
                }
                if (filters) {
                    storeConfig.filters = filters;
                }
                me.store = me.searchGridCfg.store = Ext.create('Ext.data.Store', storeConfig);
                me.saveValueArray();
            };
            EU.RSOrCache(
                {
                    type: 'basic',
                    async: false,
                    scope: me,
                    params: {code: me.queryCode, paramMap: me.queryParamMap}

                }, callBack
            );
        } else {
            searchGridCfgStore = me.searchGridCfg.store;
            // 分页查询添加底部分页插件
            var pageSize = searchGridCfgStore && searchGridCfgStore.pageSize ? searchGridCfgStore.pageSize : me.pageSize;
            if (me.queryMode === 'remote' && pageSize) {
                searchGridCfg.bbar = {
                    xtype: 'pagingtoolbar',
                    displayInfo: true
                };
                if (searchGridCfgStore) {
                    searchGridCfgStore.pageSize = pageSize;
                }
            }
            searchGridCfgStore = Ext.data.StoreManager.lookup(searchGridCfgStore);
            if (searchGridCfgStore && !searchGridCfgStore.isEmptyStore) {
                searchGridCfgStore.listeners = {
                    load: me.onLoad.bind(me)
                };
            }
        }
        return [
            searchGridCfg
        ];
    },

    getMatchingRecords: function () {
        var me = this,
            store = me.getSearchStore(),
            selections = [],
            owner = me.getOwner(),
            targetTextfieldValue, targetTextfieldValueArray,
            records;

        targetTextfieldValue = owner.getInputTextfieldCmp().getValue();
        targetTextfieldValueArray = targetTextfieldValue.split(owner.getInputTextfieldCfg().spliter);
        records = store.queryRecordsBy(function (record) {
            if (Ext.Array.contains(targetTextfieldValueArray, record.getData()[owner.getValueField()])) {
                return true;
            }
        });
        selections = Ext.isArray(records) ? records : [records];

        return selections;
    },

    /**
     * 选择表格中的条目
     * @param isSuspendSelChange 标记是否挂起选择事件
     */
    selectRecords: function (isSuspendSelChange) {
        var me = this,
            searchGrid,
            records;
        searchGrid = me.getSearchGridCmp();
        // match up passed records to the records in the searchCfg store so that the right internal ids are used
        records = me.getMatchingRecords();

        isSuspendSelChange && searchGrid.getSelectionModel().suspendEvent('selectionchange');
        if (records.length == 0) {
            searchGrid.getSelectionModel().deselectAll();
        } else {
            searchGrid.getSelectionModel().select(records);
        }
        isSuspendSelChange && searchGrid.getSelectionModel().resumeEvent('selectionchange');

        return records;
    },

    /**
     * 删掉store中自定义的过滤器
     */
    clearLocalFilter: function () {
        var me = this,
            filter = me.queryFilter;

        if (filter) {
            me.queryFilter = null;
            me.getSearchStore().removeFilter(filter);
        }
    },

    /**
     * 使用store的过滤器查询数据
     * @param queryString
     */
    search: function (queryString) {
        var me = this,
            queryPlan = {
                query: queryString || ''
            };
        if (me.queryMode === 'local') {
            me.doLocalQuery(queryPlan);

        } else {
            me.doRemoteQuery(queryPlan);
        }
    },

    /**
     * @param queryPlan
     */
    doLocalQuery: function (queryPlan) {
        var me = this,
            filter,
            filters = me.getSearchStore().getFilters(),
            queryString = queryPlan.query;
        me.clearLocalFilter();
        if (queryString) {
            filters.beginUpdate();
            me.queryFilter = filter = new Ext.util.Filter({
                id: me.id + '-filter',
                root: 'data',
                value: queryString,
                filterFn: function (item) {
                    var matchResult = false;
                    var matcher = Ext.String.createRegex(queryString,
                        false, // startsWith
                        false, // endsWith
                        true);
                    // 指定的过滤字段
                    var filterFields = me.getFilterFields();
                    if (filterFields && filterFields.length > 0) {
                        Ext.Array.each(filterFields, function (field, index) {
                            matchResult = matcher ? matcher.test(item.data[field]) : false;
                            if (matchResult) {
                                return false;
                            }
                        });
                    } else {
                        Ext.Object.each(item.data, function (key, value, myself) {
                            matchResult = matcher ? matcher.test(value) : false;
                            if (matchResult) {
                                return false;
                            }
                        });
                    }

                    return matchResult;
                }
            });
            filters.add(filter);
            filters.endUpdate();
        }
    },

    doRemoteQuery: function (queryPlan) {
        var me = this,
            loadCallback = Ext.emptyFn,
            store = me.getSearchStore();
        // In queryMode: 'remote', we assume Store filters are added by the developer as remote filters,
        // and these are automatically passed as params with every load call, so we do *not* call clearFilter.
        if (me.pageSize) {
            // if we're paging, we've changed the query so start at page 1.
            me.loadPage(1, {
                params: me.getParams(queryPlan.query),
                callback: loadCallback
            });
        } else {
            store.load({
                params: me.getParams(queryPlan.query),
                callback: loadCallback
            });
        }
    },

    /**
     * @private
     */
    getParams: function (queryString) {
        var params = {},
            param = this.queryParam;

        if (param) {
            params[param] = queryString;
        }

        return params;
    },

    loadPage: function (pageNum, options) {
        var me = this,
            store = me.getSearchStore();

        me.isPaging = true;
        store.loadPage(pageNum, options);
    },

    /**
     * 保存返回结果valueField属性的值
     */
    saveValueArray: function () {
        var me = this,
            owner = me.getOwner(),
            allRecords,
            store = me.getSearchStore();
        allRecords = store.queryRecords();
        allRecords && allRecords.forEach(
            function (item, index, array) {
                me.valueArray.push(item.getData()[owner.getValueField()]);
            }
        );
    },

    doDestroy: function () {
        var me = this;
        me.doQueryTask.cancel();
        me.callParent();
    },

    privates: {
        /**
         * 清除搜索框
         */
        onClearSearch: function () {
            var me = this,
                searchField;
            searchField = this.getSearchTextfieldCmp();
            searchField.setValue(null);
            searchField.focus();
        },

        /**
         * 查询
         * @param searchField
         */
        onSearchChange: function (searchField) {
            var me = this,
                value,
                trigger;
            value = searchField.getValue();
            trigger = searchField.getTrigger('clear');

            trigger.setHidden(!value);
            me.doQueryTask.delay(me.queryDelay, null, null, [value]);
        },

        /**
         * 选择条目改变后更新父组件的文本框的值。
         * @param selModel
         * @param selection
         */
        onSelectionChange: function (selModel, selection) {
            var me = this,
                owner = me.getOwner(),
                dataLength,
                value = [],
                i,
                inputTextfieldCfg,
                valueField = owner.getValueField();
            inputTextfieldCfg = owner.getInputTextfieldCfg();

            // 设置选定的值
            dataLength = selection.length;
            for (i = 0; i < dataLength; i++) {
                value.push(selection[i].getData()[valueField]);
            }

            value = value.join(inputTextfieldCfg.spliter);
            me.fireEvent('customselectionchange', value);
        },

        /**
         * 表格行单选模式，双击隐藏。
         */
        onRowDblClick: function (table, record, element, rowIndex, e, eOpts) {
            var me = this;
            me.hide();
        },

        /**
         * 表格行ENTER键隐藏。
         */
        onRowKeyDown: function (table, record, element, rowIndex, e, eOpts) {
            var me = this;
            if (e.keyCode === Ext.event.Event.ENTER) {
                me.hide();
            }
        },

        /**
         * 搜索输入框按下ENTER键时，选中第一条数据。
         */
        onSearchFieldEnterKey: function (event) {
            var me = this;
            me.selectFirstRow();

        },

        /**
         * 搜索输入框按下向下键时，选中第一条数据。
         */
        onSearchFieldDownKey: function (event) {
            var me = this;
            me.selectFirstRow(event);
        },

        /**
         * 搜索输入框按下ENTER键时，选中第一条数据。
         */
        selectFirstRow: function (event) {
            var me = this,
                searchGrid = me.getSearchGridCmp(),
                store = me.getSearchStore(),
                firstRecord = store.getAt(0);
            if (firstRecord) {
                searchGrid.getView().focusRow(firstRecord, 100);
                searchGrid.getSelectionModel().select(firstRecord, true);
            }
        },

        /**
         * 数据加载完的处理
         */
        onLoad: function (store, records, successful, operation, eOpts) {
            var me = this;
            me.store = store;
            if (!me.destroyed) {
                me.selectRecords(true);
                me.saveValueArray();

                // check输入框的值
                var owner = me.getOwner(),
                    inputTextfield = owner.getInputTextfieldCmp(),
                    value = inputTextfield.getValue();
                if (value) {
                    inputTextfield.validateValue(value);
                }
                owner.fireTextfieldSelectorChangeEvent(value, me.getSelectedRecords());
            }
        }
    }
});