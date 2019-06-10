/**
 * 真假值图标列
 */
Ext.define('Ming.expand.widget.BooleanColumn', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.booleanColumn',
	renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		var me = this;
		var bool=(value == '1'||value==true||value=="Y"||value=="是");
		var cls = bool ? "x-fa fa-check" : "x-fa fa-times";		
		var color = bool ? "#048D70" : "gray";
		if(!bool && value==""){
			return value;
		}
		return "<spne class='" + cls + "' style='font-size:18px;color:" + color + ";'/>";

	}
});