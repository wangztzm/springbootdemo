var MyDatas = (function(mod, JSC) {
	var config = {}; //内部配置
	/**
	 * 承运人配置
	 */
	config.carrier = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		maxLength: 2,
		datasource: JSC.carrier,
		window_title: '『承运人』选择',
		window_grid_fields: [{
				name: 'carrierId'
			},
			{
				name: 'stockpre'
			}, // 运单号序号ID
			{
				name: 'carrierDescChn'
			}, // 板箱号
			{
				name: 'carrierDescEng'
			}, // 板箱归属承运人
			{
				name: 'carrierShortNameChn'
			}
		],
		window_grid_columns: [{
				text: '航空公司',
				sortable: true,
				dataIndex: 'carrierId',
				align: 'left'
			},
			{
				text: '运单前缀',
				sortable: true,
				dataIndex: 'stockpre',
				align: 'left'
			},
			{
				text: '中文描述',
				dataIndex: 'carrierDescChn',
				sortable: true,
				align: 'left'
			},
			{
				text: '英文描述',
				dataIndex: 'carrierDescEng',
				sortable: true,
				align: 'center'
			},
			{
				text: '简称',
				dataIndex: 'carrierShortNameChn',
				sortable: true,
				align: 'left'
			},
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			this.setValue(result.get("carrierId"));
		}
	};
	/**
	 * 航站配置
	 */
	config.airport = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		maxLength: 3,
		datasource: JSC.airport,
		window_title: '『航站』选择',
		window_grid_fields: [{
				name: 'airportId'
			},
			{
				name: 'airportDescchn'
			},
			{
				name: 'cityDescChn'
			},
			{
				name: 'areaDescChn'
			}
		],
		window_grid_columns: [{
				text: '机场代码',
				sortable: true,
				dataIndex: 'airportId',
				align: 'center'
			},
			{
				text: '机场名称',
				sortable: true,
				dataIndex: 'airportDescchn',
				align: 'center'
			},
			{
				text: '城市名称',
				dataIndex: 'cityDescChn',
				sortable: true,
				align: 'center'
			},
			{
				text: '所在区域',
				dataIndex: 'areaDescChn',
				sortable: true,
				align: 'center'
			}
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			this.setValue(result.get("airportId"));
		}
	};
	/**
	 * ULD
	 */
	config.uldtype = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		datasource: JSC.uldtype,
		window_title: '『ULD类型』选择',
		window_grid_fields: [{
				name: 'uldtype'
			},
			{
				name: 'apptype'
			},
			{
				name: 'pc'
			},
			{
				name: 'tareweight'
			},
			{
				name: 'aircrafttypes'
			}
		],
		window_grid_columns: [{
				text: '板箱类型',
				sortable: true,
				dataIndex: 'uldtype',
				flex: 1
			},
			{
				text: '应用类型',
				sortable: true,
				dataIndex: 'apptype',
				flex: 1
			},
			{
				text: '板箱分类',
				dataIndex: 'pc',
				sortable: true,
				flex: 1
			},
			{
				text: '标准自重',
				dataIndex: 'tareweight',
				sortable: true,
				flex: 1
			},
			{
				text: '适用机型',
				dataIndex: 'aircrafttypes',
				sortable: true,
				flex: 4
			}
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			this.setValue(result.get("uldtype"));
		}
	};
	/**
	 * 特货代码
	 */
	config.spec_ope_cls = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		maxLength: 3,
		mutiSplitChar: '/', //多选模式时分隔符
		datasource: JSC.spec_ope_cls,
		window_title: '『 特货代码』选择',
		window_grid_fields: [{
				name: 'specopeId'
			},
			{
				name: 'dsc'
			},
			{
				name: 'edsc'
			},
			{
				name: 'cargoCraftOnly'
			}
		],
		window_grid_columns: [{
				text: '特殊处理代码',
				sortable: true,
				dataIndex: 'specopeId',
				flex: 1
			},
			{
				text: '中文描述',
				sortable: true,
				dataIndex: 'dsc',
				flex: 2
			},
			{
				text: '英文描述',
				dataIndex: 'edsc',
				sortable: true,
				flex: 2
			},
			{
				text: '只能装货机',
				dataIndex: 'cargoCraftOnly',
				sortable: true,
				flex: 1
			}
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			//单选
			if(!Ext.isArray(result)) {
				this.setValue(result.get("specopeId"));
				return;
			}
			var values = "";
			//多选
			for(var i = 0; i < result.length; i++) {
				values += result[i].get("specopeId") + "/";
			}
			if(values.length > 0) {
				this.setValue(values.substring(0, values.length - 1));
			}
		}
	};
	/**
	 * 货物品名
	 */
	config.cargosort = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		//maxLength:3,
		//mutiSplitChar: '/', //多选模式时分隔符
		datasource: JSC.cargosort,
		window_title: '『 品名』选择',
		window_grid_fields: [{
				name: 'cargosort'
			},
			{
				name: 'sortNm'
			},
			{
				name: 'esortNm'
			},
			{
				name: 'dsc'
			},
			{
				name: 'specId'
			}
		],
		window_grid_columns: [{
				text: '货物代码',
				sortable: true,
				dataIndex: 'cargosort',
				flex: 1
			},
			{
				text: '货物名称',
				sortable: true,
				dataIndex: 'sortNm',
				flex: 1
			},
			{
				text: '英文名称',
				dataIndex: 'esortNm',
				sortable: true,
				flex: 1
			},
			{
				text: '描述',
				dataIndex: 'dsc',
				sortable: true,
				flex: 1
			},
			{
				text: '特货代码',
				dataIndex: 'specId',
				sortable: true,
				flex: 1
			}
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			//单选
			if(!Ext.isArray(result)) {
				this.setValue(result.get("cargosort"));
				return;
			}
		}
	};
	/**
	 * 代理人
	 */
	config.customertype = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		//maxLength:3,
		//mutiSplitChar: '/', //多选模式时分隔符
		datasource: JSC.customertype,
		window_title: '『 代理人』选择',
		window_grid_fields: [{
				name: 'customerId'
			},
			{
				name: 'customerType'
			},
			{
				name: 'typeDesc'
			},
			{
				name: 'cityId'
			},
			{
				name: 'customerNameChn'
			},
			{
				name: 'customerNameEng'
			}
		],
		window_grid_columns: [{
				text: '客户代码',
				sortable: true,
				dataIndex: 'customerId',
				flex: 1
			},
			{
				text: '客户类型',
				sortable: true,
				dataIndex: 'customerType',
				flex: 1
			},
			{
				text: '客户类型',
				dataIndex: 'typeDesc',
				sortable: true,
				flex: 1
			},
			{
				text: '城市代码',
				dataIndex: 'cityId',
				sortable: true,
				flex: 1
			},
			{
				text: '客户中文名称',
				dataIndex: 'customerNameChn',
				sortable: true,
				flex: 2
			},
			{
				text: '客户英文名称',
				dataIndex: 'customerNameEng',
				sortable: true,
				flex: 1
			}
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			//单选
			if(!Ext.isArray(result)) {
				this.setValue(result.get("customerId"));
				return;
			}
		}
	};
	/**
	 * 营业点
	 */
	config.opedepart = {
		valueUpperCase: true,
		validateFieldIndex: 0, //carrierId
		//maxLength:3,
		//mutiSplitChar: '/', //多选模式时分隔符
		datasource: JSC.opedepart,
		window_title: '『 营业点』选择',
		window_grid_fields: [{
				name: 'opeDepartId'
			},
			{
				name: 'opeDepShortNm'
			},
			{
				name: 'opeDepName'
			}
		],
		window_grid_columns: [{
				text: '操作营业点',
				sortable: true,
				dataIndex: 'opeDepartId',
				flex: 1
			},
			{
				text: '营业点简称',
				sortable: true,
				dataIndex: 'opeDepShortNm',
				flex: 1
			},
			{
				text: '营业点名称',
				dataIndex: 'opeDepName',
				sortable: true,
				flex: 1
			}
		],
		callback: function(result) {
			if(Ext.isEmpty(result)) return;
			//单选
			if(!Ext.isArray(result)) {
				this.setValue(result.get("opeDepartId"));
				return;
			}
		}
	};
	var insideFun = {}; //内部函数对象
	/**
	 * 双击弹出窗口
	 * @param {Object} compConfig
	 * @param {Object} params
	 * @param {Object} textfield
	 */
	insideFun.dblclick = function(compConfig, params, textfield) {
		if(compConfig.valueUpperCase) {
			params.keyValue = textfield.value.toUpperCase();
			textfield.setValue("");
		}

		PU.openModule({
			title: compConfig.window_title,
			xtype: 'dataSourceQuery',
			width: 800,
			height: 500,
			params: params,
			scope: textfield,
			//关闭按钮时，回调函数，根据resut的值可以做出不同的反应
			callback: compConfig.callback
		});
	};
	/**
	 * 校验文本框的值
	 * @param {Object} textfield
	 */
	insideFun.validate = function(textfield) {
		var value = textfield.getValue(),
			compConfig = config[textfield.staticType],
			validateFieldIndex = compConfig.validateFieldIndex,
			datasource = compConfig.datasource;
		if(Ext.isEmpty(value) || !textfield.staticType) {
			return;
		}

		var values = [];
		//	debugger;
		if(textfield.muti) {
			if(compConfig.mutiSplitChar) {
				//debugger;
				var arr = value.split(compConfig.mutiSplitChar);
				for(var i = 0; i < arr.length; i++) {
					if(!Ext.isEmpty(arr[i]) && values.indexOf(arr[i]) == -1) {
						values.push(arr[i]);
					}
				}
				var oldValuesLength = values.length;
				var count = datasource.length;
				var result = false;
				for(var j = values.length - 1; j >= 0; j--) {
					var isFind = false;
					for(var i = 0; i < count; i++) {
						if(values[j] == datasource[i][validateFieldIndex]) {
							isFind = true;
							break;
						}
					}
					if(!isFind) {
						values.splice(j, 1);
					}
				}
				var newValuesLength = values.length;
				if(newValuesLength != oldValuesLength) {
					EU.toastWarn("输入的值有在系统中不存在,已自动清理", {
						callback: function() {
							textfield.setValue(values.join(compConfig.mutiSplitChar));
							textfield.focus();
						}
					});
				}
			}
		} else {
			var count = datasource.length;
			var result = false;
			for(var i = 0; i < count; i++) {
				//console.debug(JSC.carriers[i].carrierId);
				if(value == datasource[i][validateFieldIndex]) {
					result = true;
					//特殊化处理
					//货物品名自动取名称
					if(textfield.staticType == "cargosort") {
						textfield.up("carsortCompnent").down("textfield[name=sortNm]").setValue(datasource[i][1]);
					}
					if(textfield.staticType == "customertype") {
						textfield.up("customertypeCompnent").down("textfield[name=customerNameChn]").setValue(datasource[i][4]);
					}

					break;
				}
			}
			if(!result) {
				EU.toastWarn("输入的值系统不存在", {
					callback: function() {
						textfield.setValue("");
						textfield.focus();
					}
				});
			}
		}

	};
	/**
	 * 给文本框绑定事件
	 * @param {Object} textfield
	 */
	insideFun.bindEvents = function(textfield) {
		/**
		 * 组件绑定的静态数据源
		 */
		if(!textfield.staticType) {
			return;
		}
		//添加有弹出框的黄色底色
		textfield.fieldCls = Ext.baseCSSPrefix + 'custom-widget-input';

		var me = textfield,
			scope = textfield,
			params = {};

		params.staticType = textfield.staticType;
		//是否多选
		if(textfield.muti) {
			params.muti = textfield.muti;
		}
		var compConfig = config[textfield.staticType];
		/**
		 * 显示大写
		 */
		if(compConfig.valueUpperCase) {
			//me.setCls("uppercase");
			me.inputCls = "uppercase";
		}
		/**
		 * 点击↓箭头，弹出选择框
		 */
		me.addListener('specialkey', function(field, e) {
			if(e.getKey() == "40") { //↓
				insideFun.dblclick(compConfig, params, textfield);
				//防止触发blur事件 触发校验
				/*if(compConfig.valueUpperCase){
					params.keyValue=textfield.value.toUpperCase();
					textfield.setValue("");
				}
			
				PU.openModule({
					title: compConfig.window_title,
					xtype: 'dataSourceQuery',
					width: 800,
					height: 500,
					params: params,
					scope: scope,
					//关闭按钮时，回调函数，根据resut的值可以做出不同的反应
					callback: compConfig.callback
				});*/
			}
		});
		//支持按键事件，并且自动跳转
		if(compConfig.maxLength) {
			me.enableKeyEvents = true;
			me.addListener('keyup', function(field, e) {
				if(!textfield.muti && field.value.length >= compConfig.maxLength) {
					//a-z-0-9 96-105
					if((event.keyCode >= 65 && event.keyCode <= 90) ||
						(event.keyCode >= 48 && event.keyCode <= 57) ||
						(event.keyCode >= 96 && event.keyCode <= 105)) {
						autoJumpNextFormElement($("#" + field.getInputId()));
					}
				}
			});
		}
		/**
		 * 焦点离开，校验文本框的值
		 */
		me.addListener('blur', function(textfield) {
			var compConfig = config[textfield.staticType];
			if(compConfig.valueUpperCase) {
				textfield.setValue(Ext.util.Format.uppercase(textfield.getValue()));
			}
			insideFun.validate(textfield);
		});
		
		/**
		 * 双击事件，弹出选择框
		 */
		var timer = null;
		me.addListener("render", function(textfield) {
			var compConfig = config[textfield.staticType];
			textfield.getEl().on("click", function() {
				clearTimeout(timer);
				timer = setTimeout(function() { //在单击事件中添加一个setTimeout()函数，设置单击事件触发的时间间隔 
					console.debug("<p>click事件</p>");
				}, 300);
			}).on("dblclick", function() {
				clearTimeout(timer);
				insideFun.dblclick(compConfig, params, textfield);
			});
		});
	};

	insideFun.getDataSource = function(staticType) {
		if(!staticType) {
			return {};
		}
		var compConfig = config[staticType];
		return {
			fields: compConfig.window_grid_fields,
			columns: compConfig.window_grid_columns,
			data: compConfig.datasource
		};
	};

	insideFun.getConfig = function(staticType) {
		if(!staticType) {
			return {};
		}
		return config[staticType];
	};

	mod.bindEvents = insideFun.bindEvents;
	mod.getDataSource = insideFun.getDataSource;
	mod.getConfig = insideFun.getConfig;
	return mod;

})(window.MyDatas || {}, JSC || {});