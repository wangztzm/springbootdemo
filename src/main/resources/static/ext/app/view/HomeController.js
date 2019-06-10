Ext.define('Ming.view.HomeController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.home',

	routes: {
		':xtype': 'handleRoute' // 执行路由
	},

	handleRoute: function(xtype) {
		var home = null;
		try {
			home = Ext.widget({
				xtype: xtype
			});
		} catch(e) {
			console.debug('handleRoute', xtype, home, e);
			home = Ext.widget({
				xtype: cfg.xtypeLogin
			});
		}
		Ext.FramePanel.removeAll(true);
		Ext.FramePanel.add(home);
	},

	init: function() {
		this.initCfg();
		Ext.Panel = this;
		Ext.Viewport = this.getView();
		Ext.FramePanel = Ext.Viewport.items.items[0]; // 主窗口面板
		Ext.lockPanel = Ext.Viewport.items.items[1]; // 锁屏面板
		var islogin = session.get('isLogin') || false;
		console.debug('HomeController.init', islogin);
		if(CU.getBoolean(islogin) == true) {
			Ext.util.History.setHash(''); // 移除浏览器指定的路由对象
			EU.RS({
				url: UrlUtil.get('api/sysframe', 'getUserSub'),
				msg: false,
				scope: this,
				callback: function(result) {
					if(!result || result.success !== true) {
						EU.toastErrorInfo('读取用户信息失败');

						return;
					}
					cfg.sub = result.data;
					if(cfg.sub == null) {
						session.clean();
						this.redirectTo(cfg.xtypeLogin);

						return;
					}
					PU.createUrlFunction(cfg.sub.systemurls);
					this.redirectTo(cfg.xtypeFrame);
				}
			});
		} else {
			this.redirectTo(cfg.xtypeLogin);
		}
	},

	initCfg: function() {
		var me = this;
		Ext.getDoc().on('contextmenu', function(e) {
			e.stopEvent();
		});
		/*  Ext.Ajax.on('requestexception', function (conn, response, options) {
		      if (response.status == '401') {
		          session.remove('isLogin');
		          var wins = PU.wins;
		          for (var key in wins) wins[key].close();
		          if (Ext.msgWin) Ext.msgWin.sysclose();
		          if (cfg.sub == null || Ext.isEmpty(cfg.sub.username)) {
		              me.redirectTo(cfg.xtypeLogin);
		          } else {
		              Ext.Viewport.getLayout().setActiveItem(1);
		          }
		      } else if (response.status == '998') {
		          Ext.Msg.show({
		              title: '警告',
		              message: '没有访问权限！',
		              buttons: Ext.Msg.CANCEL,
		              icon: Ext.Msg.WARNING
		          });

		          //				EU.toastErrorInfo('没有访问权限！');
		          return false;
		      }
		  });*/

		// Ext.ajax 通用设置
		Ext.Ajax.setListeners({
			beforerequest: function(conn, options, eOpts) {
				console.debug(cfg.crossdomain, options.url);
				if(options.url.indexOf("resources/")!=-1){
					
				}
				else{
				if(cfg.crossdomain) {
					options.url = cfg.requestUrl + options.url;
				}
				}

				if(options.url.indexOf(UrlUtil.get('api/sysframe', 'login')) != -1) {
					return;
				}
				if(options.url.indexOf("bas/basConfig/getConfigValue")!=-1){	
					return;
				}
				
				var urlParts = options.url.split('?'),
					url = urlParts[0],
					urlParams = [],
					headers = options.headers ? options.headers : {},
					ts = new Date().getTime(),
					transNo = new Date().getTime().toString(),
					userInfo = local.get('userinfo'),
					token = userInfo.token,
					md5 = hex_md5(ts.toString() + transNo + token);

				if(urlParts.length > 1) {
					urlParts.shift();
					urlParams = urlParams.concat(urlParts);
				}
				urlParams.push('ts=' + ts);
				urlParams.push('transNo=' + transNo);
				url = url + '?' + urlParams.join('&');
				headers.Authorization = Ext.util.Base64.encode(userInfo.username + ':' + md5);

				options.url = url;
				options.headers = headers;
			//}
			},
			requestexception: function(conn, response, options) {
				if(response.status == '401') {
					EU.showMsg({title:"警告",msg:response.responseText,callback:function(){
						session.remove('isLogin');
					var wins = PU.wins;
					for(var key in wins) wins[key].close();
					if(Ext.msgWin) Ext.msgWin.sysclose();
					me.redirectTo(cfg.xtypeLogin);
					/*if(cfg.sub == null || Ext.isEmpty(cfg.sub.username)) {
						me.redirectTo(cfg.xtypeLogin);
					} else {
						Ext.Viewport.getLayout().setActiveItem(1);
					}	*/					
					}});
					
					return false;
				} else if(response.status == '998') {
					Ext.Msg.show({
						title: '警告',
						message: '没有访问权限！',
						buttons: Ext.Msg.CANCEL,
						icon: Ext.Msg.WARNING
					});

					//				EU.toastErrorInfo('没有访问权限！');
					return false;
				}else if(response.status == '404'){
					session.remove('isLogin');
					Ext.Msg.show({
						title: '警告',
						message: "访问的服务不存在",
						buttons: Ext.Msg.CANCEL,
						icon: Ext.Msg.WARNING
					});
					return false;
				}
			}
		});
	}
});