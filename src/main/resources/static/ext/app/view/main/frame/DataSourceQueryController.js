/**
 * extjs 组件数据源viewController
 * createby zihui
 *
 */
Ext.define('Ming.view.main.frame.DataSourceQueryController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.dataSourceQuery',
	mySpeicalKeys: {
		Enter: 13,
		Down: 40
	},
	init: function() {
		this.gridPanel = this.lookupReference("gridPanel");
	},
	onBeforeRender: function() {
		var view = this.getView();
		var staticType = view.get("staticType");
		var datsource = MyDatas.getDataSource(staticType);
		var jsonData = [];
		/**
		 * data数组必须于fields的数目，顺序一致
		 */
		for(var j = 0; j < datsource.data.length; j++) {
			var record = {};
			for(var i = 0; i < datsource.fields.length; i++) {
				record[datsource.fields[i].name] = datsource.data[j][i];
			}
			jsonData.push(record);
		}
		var store = Ext.create('Ext.data.Store', {             
			fields: datsource.fields, //把json的fieldsNames赋给fields   
			          data: jsonData        //把json的data赋给data 
			          
		}); 


		var columns = [{
			text: '序  号',
			sortable: false,
			width: 60,
			xtype: 'rownumberer',
			align: 'center'
		}];
		columns = columns.concat(datsource.columns);
		//重新配置grid
		this.gridPanel.reconfigure(store, columns);

		/*var config=MyDatas.getConfig(staticType);
		if(config.valueUpperCase){
			this.lookupReference("key").inputCls="uppercase";
		}*/
		
		//给key文本框复制
		var keyValue=view.get("keyValue");
		
		if(!Ext.isEmpty(keyValue)){
			this.lookupReference("key").setValue(keyValue);
			this.onFilter();			
		}
	},
	onAfterRender: function() {
		this.lookupReference("key").focus();
		//console.debug("focus");
	},
	/**
	 * 下一行
	 * @param {Object} field
	 * @param {Object} e
	 */
	onNextRow: function(field, e) {
		if(e.getKey() == this.mySpeicalKeys.Down) {
			//this.gridPanel.getView().focusRow(0);
			this.gridPanel.getView().focus();
			this.gridPanel.getSelectionModel().select(0, true); //选择一行
		}
	},
	onGridSubmit: function(field, e) {
		if(e.getKey() == this.mySpeicalKeys.Enter) {
			this.onWindowSubmit();
		}
	},
	/**
	 *
	 * @param {Object} view
	 * @param {Object} rowBodyEl
	 * @param {Object} e
	 * @param {Object} eOpts
	 */
	onGridKeyDown: function(view, rowBodyEl, e, eOpts) {
		//debugger;
		//console.debug(e);
		if(event.keyCode == this.mySpeicalKeys.Enter) {
			this.onWindowSubmit();
		}
	},
	onWindowClose: function() {
		this.getView().closeWindow();
	},
	onWindowSubmit: function() {
		var me = this;
		var selModel = me.gridPanel.getSelectionModel(); //得到选择模型
		var selection = selModel.getSelection(); //得到被选择的记录数组
		if(selection.length > 1) {
			this.getView().setReturnValue(selection);
		} else {
			for(var i = 0; i < selection.length; i++) {
				var model = selection[i]; //得到model
				this.getView().setReturnValue(model);
				break;
			}
		}
		this.getView().closeWindow();
	},
	onKeyUp: function(textField, e) {
		// if(e.getKey() == 13){
		this.onFilter();
		// }
	},
	onFilter: function() {
		var key = this.getView().down("form").down("textfield").getValue();
		var _store = this.gridPanel.getStore();
		var regExp = new RegExp(".*" + key + ".*");
		// 执行检索
		_store.clearFilter();
		_store.filterBy(function(record, id) {
			// 检索的正则
			var regExp = new RegExp(".*" + key + ".*");
			// 执行检索
			var fields = record.getFields();
			var i = 0;
			while(i < fields.length - 1) {
				var text = record.get(fields[i].name);
				if(!regExp.test(text)) {
					i++;
				} else {
					return true;
				}
			}
		});
	}
});