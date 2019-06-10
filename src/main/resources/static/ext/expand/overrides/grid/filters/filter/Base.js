Ext.define('expand.overrides.grid.filters.filter.Base', {
    override: 'Ext.grid.filters.filter.Base',

    onValueChange: function (field, e) {
        var me = this,
            updateBuffer = me.updateBuffer;
        if (e.getKey() != e.RETURN) return;
        if (!field.isFormField) {
            Ext.raise('`field` should be a form field instance.');
        }
        if (field.isValid()) {
            if (updateBuffer) {
                me.task.delay(updateBuffer, null, null, [me.getValue(field)]);
            } else {
                me.setValue(me.getValue(field));
            }
            me.menu.hide();
        }
    }
});