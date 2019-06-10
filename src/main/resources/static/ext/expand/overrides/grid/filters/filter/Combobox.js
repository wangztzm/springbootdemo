Ext.define('classic.expand.overrides.grid.filters.filter.Combobox', {
    extend: 'Ext.grid.filters.filter.SingleFilter',
    alias: 'grid.filter.combobox',

    type: 'combobox',

    operator: '=',

    itemDefaults: {
        xtype: 'combobox',
        viewname: '',
        hideEmptyLabel: false,
        iconCls: Ext.baseCSSPrefix + 'grid-filters-find',
        labelSeparator: '',
        labelWidth: 29,
        margin: 0
    },

    menuDefaults: {
        bodyPadding: 3,
        showSeparator: false
    },

    createMenu: function () {
        var me = this,
            config;

        me.callParent();

        config = Ext.apply({}, me.getItemDefaults());
        if (config.iconCls && !('labelClsExtra' in config)) {
            config.labelClsExtra = Ext.baseCSSPrefix + 'grid-filters-icon ' + config.iconCls;
        }

        me.inputItem = me.menu.add(config);

        me.inputItem.on({
            scope: me,
            select: me.onValueChange
        });
    },

    setValue: function (value) {
        var me = this;

        if (me.inputItem) {
            me.inputItem.setValue(value);
        }

        me.filter.setValue(value);

        if (value && me.active) {
            me.value = value;
            me.updateStoreFilter();
        } else {
            me.setActive(!!value);
        }
    },

    onValueChange: function (field, e) {
        var me = this;
        me.setValue(me.getValue(field));
        me.menu.hide();
    },

    activateMenu: function () {
        this.inputItem.setValue(this.filter.getValue());
    }
});
