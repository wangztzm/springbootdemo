Ext.define('expand.overrides.form.Panel', {
	override: 'Ext.form.Panel',
/*	afterRender: function(thisForm, options) {
		var els = Ext.DomQuery.select('input[type!=hidden]');
		Ext.create("Ext.util.KeyMap", {
			target:this,
			key: 13,
			fn: function(key, e) {
				var el = e.target,
					target = els,
					ln = target.length;
				for(var i = 0; i < ln; i++) {
					if(target[i] == el) {
						if(i + 1 == ln) {
							target[0].focus();
						} else {
							target[i + 1].focus();
						}
					}
				}
			},
			scope: this
		});
	},*/
/**
 * 设置表单是否只读模式
 * 判断如果字段readOnly：true，且参数readOnly=false对该字段状态无效
 * @param {} readOnly  true=只读模式  false=可操作
 * @param {} notchange  缺省：true ， 不改变readOnly：true的字段
 */
setReadOnly: function(readOnly, notchange) {
	notchange = Ext.isEmpty(notchange) ? true : notchange;
	readOnly = Ext.isEmpty(readOnly) ? true : readOnly;
	var me = this,
		items = me.getForm().getFields().items;
	Ext.each(items, function(rec) {
		if(Ext.isEmpty(rec.isReadOnly)) rec.isReadOnly = rec.readOnly;
		if(Ext.isFunction(rec.setReadOnly) && (!rec.isReadOnly || !notchange)) {
			rec.setReadOnly(readOnly);
			rec.cReadOnly = readOnly;
		}
	});
},

/**
 * 移除修改数据后提醒，使隐藏字段和显示字段一致
 * @param {} values
 */
updateDirty: function() {
	var me = this,
		fields = me.getForm().getFields().items;
	Ext.each(fields, function(field) {
		field.resetOriginalValue();
	});
},

setValues: function(values) {
	return this.getForm().setValues(values);
},

findField: function(name) {
	return this.getForm().findField(name);
}
});