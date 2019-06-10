Ext.define('expand.overrides.form.ComboBox', {
    override: 'Ext.form.ComboBox',
    requires: [
        'Ext.util.Filter'
    ],
    valueField: 'id',
    displayField: 'text',
    emptyText: '请选择',
	editable : true,
    queryMode: 'local',
    triggerAction: 'all',
    minChars: 1,
    forceSelection: true,
    anyMatch: true,
    config: {
        /**
         * @cfg {Object} filterFields
         * localQuery时要查询过滤的字段
         */
        filterFields: [],
        /**
         * @cfg {boolean} optionAll
         * 添加全部选择项
         */
        optionAll: false,
        /**
         * @cfg {Object} optionAllText
         */
        optionAllText: '全部',
        /**
         * @cfg {Object} optionAllValue
         */
        optionAllValue: 'all',
        /**
         * @cfg {Object} viewname
         * 字典代码 查询数据字典
         */
        viewname: '',
        /**
         * @cfg {Object} queryCode
         * 基础数据查询代码
         */
        queryCode: null,
        /**
         * @cfg {Object} queryParamMap
         * 基础数据查询参数
         */
        queryParamMap: null,

        /**
         * @cfg {Object} storeFilters
         * store的过滤器
         */
        storeFilters: null,

        /**
         * @cfg {Object} blurUppercase
         * 失去焦点转大写
         */
        blurUppercase: false,

        /**
         * @cfg {Object} blurUppercase
         * 对于动态查询的基础数据，失去焦点时验证。
         */
        blurValidate4Remote: false,

        /**
         * @cfg {Object} exactMatch
         * true强制精确匹配（^和$字符添加到正则表达式）。忽略任何匹配是否为真。 本地查询使用。
         */
        exactMatch: false
    },

    initComponent: function () {
        var me = this, store,
            callBack = function (data) {
                if (!data) {
                    return;
                }
                var me = this, optionAllItem = {}, storeConfig, filters = [];
                if (me.optionAll) {
                    data = data ? data : [];
                    optionAllItem[me.valueField] = me.optionAllValue;
                    optionAllItem[me.displayField] = me.optionAllText;
                    data.unshift(optionAllItem);
                }
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
                store = Ext.create('Ext.data.Store', storeConfig);
                me.store = store;
            };
        if (!Ext.isEmpty(me.viewname)) {
            EU.RSOrCache(
                {
                    scope: me,
                    async: false,
                    params: {viewname: me.viewname}
                }, callBack
            );
        } else if (me.queryCode && me.queryMode === 'local') {
            EU.RSOrCache(
                {
                    type: 'basic',
                    async: false,
                    scope: me,
                    params: {code: me.queryCode, paramMap: me.queryParamMap}
                }, callBack
            );
        } else if (me.queryCode && me.queryMode === 'remote') {
            if (me.blurValidate4Remote) {
                me.on('blur', me.onBlurValidate4Remote, me, {priority: -100});
            }
        }

        if (me.hideTrigger) {
            me.fieldCls = Ext.baseCSSPrefix + 'custom-widget-input';
        }
        me.callParent(arguments);

        if (me.blurUppercase) {
            me.on('blur', me.onBlurUppercase, me, {priority: -100});
        }

    },

    getParams: function (queryString) {
        var me = this,
            params, param;
        if (me.queryCode && me.queryMode === 'remote' && me.queryCode != 'CUSTOMER') {
            params = {paramMap: {}};
            param = this.queryParam;

            if (param) {
                params.paramMap[param] = queryString;
            }
            return params;
        }

        // 框架的获取查询参数处理
        params = {};
        param = me.queryParam;
        if (param) {
            params[param] = queryString;
        }
        return params;
    },

    /**
     * 对于动态查询的基础数据，失去焦点时验证。
     */
    onBlurValidate4Remote: function () {
        var me = this,
            queryString = me.getRawValue(),
            store = me.store,
            storeQueryResult,
            loadCallback = function (records, operation, success) {
                var recArray = me.store.query(me.valueField, queryString, false, false, true);
                if (!me.destroyed) {
                    if (recArray && recArray.length > 0) {
                        me.onValidityChange(true);
                    } else {
                        me.markInvalid('数据不存在。');
                        me.onValidityChange(false);
                    }
                }
            };
        if (!queryString) {
            me.onValidityChange(true);
            return;
        }
        storeQueryResult = store.query(me.valueField, queryString, false, false, true);
        if (storeQueryResult && storeQueryResult.length > 0) {
            me.onValidityChange(true);
            return;
        }
        me.store.load({
            params: me.getParams(queryString),
            callback: loadCallback
        });
    },

    /**
     * 覆盖父类方法，queryFilter的创建有改动。
     */
    doLocalQuery: function (queryPlan) {
        var me = this,
            queryString = queryPlan.query,
            store = me.getStore(),
            value = queryString,
            filter;

        me.clearLocalFilter();

        // Querying by a string...
        if (queryString) {
            // User can be typing a regex in here, if it's invalid
            // just swallow the exception and move on
            if (me.enableRegEx) {
                try {
                    value = new RegExp(value);
                } catch (e) {
                    value = null;
                }
            }
            if (value !== null) {
                // Must set changingFilters flag for this.checkValueOnChange.
                // the suppressEvents flag does not affect the filterchange event
                me.changingFilters = true;
                filter = me.queryFilter = new Ext.util.Filter({
                    id: me.id + '-filter',
                    // anyMatch: me.anyMatch,
                    // caseSensitive: me.caseSensitive,
                    root: 'data',
                    // property: me.displayField,
                    value: value,
                    filterFn: function (item) {
                        var matchResult = false,
                            anyMatch = !!me.anyMatch,
                            exact = !!me.exactMatch;
                        // 空格返回
                        if (value.trim().length == 0) {
                            return matchResult;
                        }
                        var matcher = Ext.String.createRegex(value,
                            !anyMatch, // startsWith
                            !anyMatch && exact, // endsWith
                            !me.caseSensitive);
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
                store.addFilter(filter, true);
                me.changingFilters = false;
            }
        }

        // Expand after adjusting the filter if there are records or if emptyText is configured.
        if (me.store.getCount() || me.getPicker().emptyText) {
            // The filter changing was done with events suppressed, so
            // refresh the picker DOM while hidden and it will layout on show.
            me.getPicker().refresh();
            me.expand();
        } else {
            me.collapse();
        }

        me.afterQuery(queryPlan);
    },

    onBlurUppercase: function (combo, event, eOpts) {
        var value = combo.getValue();
        if (value) {
            combo.setValue(Ext.util.Format.uppercase(combo.getValue()));
        }
    },

    /**
     * 查找下拉列表框所属的表单，表单子组件有"formBind=true"的，根据验证结果设置可用/不可用。
     */
    onValidityChange: function (valid) {
        var me = this,
            formPanel = me.up('form'), form;
        if (formPanel) {
            form = formPanel.getForm();
            form.onValidityChange(valid);
        }
    }
});