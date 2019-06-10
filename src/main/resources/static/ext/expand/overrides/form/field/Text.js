Ext.define('expand.overrides.form.field.Text', {
	override: 'Ext.form.field.Text',
	config: {
		staticType: ''
	},
	constructor: function(config) {
		var me = this;
		if(config.allowBlank == false && !Ext.isEmpty(config.fieldLabel)) {
			// addbyzihui 有父容器就会导致config.fieldLabel的值记住上一次的，不知道原因何在，暂时
			// 只能这样,不知道会不会导致内存泄漏 20180927
			if(config.fieldLabel.indexOf('<font color=') == -1) {
				config.fieldLabel += '<font color=\'red\'>*</font>';
			}
		}

		// if(!config.triggers){
		// 	config.triggers = {};
		// }
		//
		// if(config.triggers.clear == false){
		// 	delete config.triggers.clear;
		// }else if(!(config.allowBlank == false && me instanceof Ext.form.field.ComboBox)){
		//  	config.triggers.clear = {type:'clear',hideWhenMouseOut: true};
		// }
		me.callParent(arguments);
	},
	initComponent: function() {
		var me = this;
		
		if(me.staticType) {
			MyDatas.bindEvents(me);
			//向下叫箭头
			/*this.addListener('specialkey', function(field, e) {
				if(e.getKey() == "40") {
					localDataSource.show({
						type: localDataSource.CARRIER,
						scope: this,
						callback: function(result) {
							if(Ext.isEmpty(result)) return;
							this.setValue(result);
						}
					});
				}
			});
			
			this.addListener('blur', function(textfiled) {
				localDataSource.validate(textfiled);
			});*/
		}

		me.callParent(arguments);
	},

	// applyTriggers: function(triggers) {
	// 	var length = Object.keys(triggers).length;
	// 	if(length>1 && triggers.clear){
	// 		var map = {clear:triggers['clear']};
	// 		delete triggers.clear;
	// 		for(var key in triggers){
	// 			map[key] = triggers[key];
	// 		}
	// 		triggers = map;
	// 	}
	//     return this.callParent(arguments);
	// },
	destroy: function() {
		var me = this;
		// console.debug(me.fieldLabel+":destrory");
		me.callParent(arguments);
	}
});