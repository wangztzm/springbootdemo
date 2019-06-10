/**
 * 图标列
 */
Ext.define('Ming.expand.widget.IconColumn', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.iconColumn',
	renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		return value;
		/*var me = this;
		var bool=(value == '1'||value==true||value=="Y"||value=="是");
		var cls = bool ? "x-fa fa-check" : "x-fa fa-times";		
		var color = bool ? "#048D70" : "gray";
		if(!bool && value==""){
			return value;
		}
		return "<spne class='" + cls + "' style='font-size:18px;color:" + color + ";'/>";
*/
	}
});