/**
 * 自定义
 */
Ext.define('Ming.expand.ux.widget.CustomComboBox', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'customcombo',

    requires: [
        'Ext.util.Filter'
    ],

    config: {

        /**
         * @cfg {Object} filterFields
         * localQuery时要查询的字段
         */
        filterFields: []
    },

    /**
     * trigger隐藏时，输入框绑定双击事件。
     */
    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        if (me.getHideTrigger()) {
            me.inputEl.on('dblclick', me.onInputElClick, me);
        }
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
                        var matchResult = false;
                        // 空格返回
                        if (value.trim().length == 0) {
                            return matchResult;
                        }
                        var matcher = Ext.String.createRegex(value,
                            !me.anyMatch, // startsWith
                            !me.anyMatch && me.exactMatch, // endsWith
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
    }

});
