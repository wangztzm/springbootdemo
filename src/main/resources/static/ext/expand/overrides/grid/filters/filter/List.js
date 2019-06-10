Ext.define('expand.overrides.grid.filters.filter.List', {
    override: 'Ext.grid.filters.filter.List',

    setValue: function () {
        var me = this,
            items = me.menu.items,
            value = [],
            i, len, checkItem;
        me.preventDefault = true;

        for (i = 0, len = items.length; i < len; i++) {
            checkItem = items.getAt(i);

            if (checkItem.checked) {
                value.push(checkItem.value);
            }
        }

        me.filter.setValue(value.join(','));
        len = value.length;

        if (len && me.active) {
            me.updateStoreFilter();
        } else {
            me.setActive(!!len);
        }

        me.preventDefault = false;
    }
});