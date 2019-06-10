/**
 * The main application class. An instance of this class is created by Ming.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Ming.Application', {
	extend: 'Ext.app.Application',

	name: 'Ming',

	stores: [
		'NavigationTree'
	],

	requires: [
		'Ming.locale.Locale',
		/*        'Ming.expand.trigger.Clear',
		         'Ming.util.Failed'*/
		/* , 'Ming.utils.Loader',
		 'Ming.utils.ExtUtils',
		 'Ming.utils.ExtFactory',
		 'Ming.utils.ProjectUtils',
		 'Ming.utils.WebSocket',

		 'Ming.expand.ux.FormPanel',
		 'Ming.expand.ux.GridIndex',
		 'Ming.expand.ux.SelectField',
		 'Ming.expand.ux.IconClsField',
		 'Ming.expand.ux.BtnGridQuery',
		 'Ming.expand.ux.TreeFilterField',
		 'Ming.expand.ux.UploadField',
		 'Ming.expand.ux.DateTimeField',

		 'Ming.expand.widget.ColorColumn',
		 'Ming.expand.widget.ViewColumn',
		 'Ming.expand.widget.RadioColumn',
		 'Ming.expand.plugin.PageRequest',
		 'Ming.expand.trigger.Clear'*/

		'Ming.utils.Loader',
		'Ming.utils.ExtUtils',
		'Ming.utils.ExtFactory',
		'Ming.utils.ProjectUtils',
		'Ming.utils.WebSocket',

		'Ming.expand.ux.FormPanel',
		'Ming.expand.ux.GridIndex',
		'Ming.expand.ux.SelectField',
		'Ming.expand.ux.IconClsField',
		'Ming.expand.ux.BaseDataGridPanel',
		'Ming.expand.ux.BtnGridQuery',
		'Ming.expand.ux.TreeFilterField',
		'Ming.expand.ux.UploadField',
		'Ming.expand.ux.DateTimeField',
		'Ming.expand.ux.ToggleSlide',

		'Ming.expand.widget.ColorColumn',
		'Ming.expand.widget.ViewColumn',
		'Ming.expand.widget.RadioColumn',
		'Ming.expand.plugin.PageRequest',
		'Ming.expand.trigger.Clear',
		'Ming.view.main.frame.default.Main'
	],

	quickTips: false,
	platformConfig: {
		desktop: {
			quickTips: true
		}
	},
	init: function() {

	},
	onLaunch: function() {
		console.debug("onLaunch");
		//loadAsyncJs("resources/js/MyDatas.js");

	},
	/**
	 * 设置enter键盘为tab
	 */
	setEnterToTab: function() {
		$('body').on('keydown', 'input, select', function(e) {
			if(e.keyCode == 13) {
				autoJumpNextFormElement(this);
				return false;
			}
		});
	},
	launch: function() {
		//设置enter键盘为tab
		this.setEnterToTab();
		//请求基础数据
		Ext.Ajax.request({
			method: 'GET',
			url: 'api/bas/basConfig/getConfigValue',
			params: {
				'key': 'JSCACHE_VERSION' // 要删除记录的id
			},
			success: function(response, config) {
				var version = response.responseText;
				//加载数据源 
				loadJs(cfg.requestUrl + "js/datas.js?v=" + version, function() {
					loadJs("resources/js/MyDatas.js");
				});
			}
		});

		Ext.get('loading').remove();
		Ext.get('progress').remove();
		// TODO - Launch the application
		Ext.util.Format.defaultValue = function(value, defaultValue) {
			return Ext.isEmpty(value) ? defaultValue : value;
		};

		//配置快捷键
		// map multiple keys to multiple actions by strings and array of codes
		var map = new Ext.util.KeyMap({
			target: document,
			binding: [{
				//ENTER 13
				key: [13],
				handler: function(btn, b, c) {
					//debugger;
					//	 console.debug(event.srcElement);
					// return false;
					// alert("Return was pressed");
				}
			}, {
				key: "abc",
				handler: function() {
					//alert('a, b or c was pressed');
				}
			}, {
				key: "\t",
				ctrl: true,
				shift: true,
				handler: function() {
					// alert('Control + shift + tab was pressed.');
				}
			}]
		});
	},

	onAppUpdate: function() {
		Ext.Msg.confirm(I18N.ApplicationUpdate, I18N.ApplicationUpdateMsg,
			function(choice) {
				if(choice === 'yes') {
					window.location.reload();
				}
			}
		);
	}
});