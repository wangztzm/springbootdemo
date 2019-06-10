Ext.define('Ming.view.main.frame.default.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.defaultThemeController',

	init: function() {
		// addbyzihui  禁止
		// this.initWebSocketMessageWin();

		var b_style = this.lookupReference('b_style');
		var b_theme = this.lookupReference('b_theme');
		EU.RSView('V_THEME', function(result) {
			Ext.each(result, function(rec) {
				console.debug('zihui', rec);
				rec.code = rec.id;
				delete rec.id;
				rec.handler = function(btn) {
					local.set('theme', btn.code);
					PU.onAppUpdate();
				};
			});
			b_theme.setMenu(result);
		});
		EU.RSView('V_STYLE', function(result) {
			Ext.each(result, function(rec) {
				delete rec.id;
				rec.handler = function(btn) {
					localStorage.setItem('style', btn.text);
					PU.onAppUpdate();
				};
			});
			b_style.setMenu(result);
		});
		
		/*if(local.get("ming-fullscreen") == "1") {
			local.set("ming-fullscreen","0");
			this.OnScreenFull();
		}*/
	},

	/**
	 * 系统webSocket初始化
	 */
	initWebSocketMessageWin: function() {
		var me = this;
		var b_tips = me.lookupReference('b_tips');
		Ext.msgWin = me.msgWin = Ext.create('Ming.view.main.frame.default.MessageWin', {
			onMessageChange: function(tipsnum) {
				var sumnum = b_tips.sumnum || 0;
				if(Ext.isNumber(tipsnum)) sumnum += tipsnum;
				if(sumnum > 0) {
					b_tips.addCls('icon-animated-bell');
				} else {
					b_tips.removeCls('icon-animated-bell');
				}
				b_tips.sumnum = sumnum;
			}
		});
	},

	onMenuTreeItemClick: function(tree, record, item, index, e, eOpts) {
		PU.openTabModule(record.data);
	},

	onFavoritesContextmenu: function(tree, record, item, index, e, eOpts) {
		var me = this,
			menu = me.menu;
		if(Ext.isEmpty(menu)) {
			me.menu = menu = Ext.create('Ext.menu.Menu', {
				items: [{
					text: '取消收藏',
					iconCls: 'x-fa fa-bitbucket',
					handler: function(btn, e) {
						var record = me.menu.record;
						EU.RScfgDel(record.data.themecfgid, function(result) {
							delete Ext.SystemFavorites[record.data.id];
							tree.store.remove(record);
						});
					}
				}]
			});
		}
		me.menu.record = record;
		menu.showAt(e.getXY());
	},

	// 颜色显示
	treeNavNodeRenderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
		return view.rendererRegExp ? value.replace(view.rendererRegExp, '<span style="color:red;font-weight:bold">$1</span>') : value;
	},

	onUserclick: function(btn) {
		// var user = cfg.sub;
		// console.log(cfg.sub)
		// var params = user;
		// this.getdatas();
		PU.openModule({
			title: '用户信息维护',
			xtype: 'userEdit',
			width: 750,
			height: 450,
			// params: params,
			// user:user,
			scope: this,
			animateTarget: btn
		});
	},

	onMessage: function(btn) {
		var x = PU.getWidth() - 250 - 50;
		this.msgWin.setPosition(x, 50);
		this.msgWin.show();
	},

	onLogout: function(btn) {
		var me = this;
		PU.onLogout(btn, function() {
			if(me.msgWin) me.msgWin.sysclose();
		});
	},
	// 隐藏顶部和底部的按钮事件
	OnHiddenTopBottom: function() {
		// 如果要操纵控件，最好的办法是根据相对路径来找到该控件，用down或up最好，尽量少用getCmp()函数。
		this.getView().down('toolbar').hide();
		if(!this.showButton) {
			// 显示顶部和底部的一个控件，在顶部和底部隐藏了以后，显示在页面的最右上角
			this.showButton = Ext.widget('component', {
				glyph: 0xf013,
				view: this.getView(),
				floating: true,
				x: document.body.clientWidth - 32,
				y: 0,
				height: 4,
				width: 26,
				style: 'background-color:#cde6c7',
				tooltip: "显示顶部和底部区域",
				listeners: {
					//取得dom元素
					el: {
						click: function(element) {
							var c = Ext.getCmp(element.target.id); // 取得component的id值
							c.view.down('toolbar').show();
							c.hide();
							//local.set("top-hide","0");
						}
					}
				}
			});
		};
		this.showButton.show();
		//local.set("top-hide","1");
	},
	// 如果窗口的大小改变了，并且顶部和底部都隐藏了，就要调整显示顶和底的那个控件的位置
	onMainResize: function() {
		//console.debug("onMainResize");
		if(this.showButton && !this.showButton.hidden) {
			this.showButton.setX(document.body.clientWidth - 32);
		}
	},
	OnScreenFull: function() {
		if(this.screenFull) {
			if(document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if(document.msExitFullscreen) {
				document.msExitFullscreen();
			}
			
			this.screenFull=false;
		} else {
			var docElm = document.documentElement;
			//W3C  
			if(docElm.requestFullscreen) {
				docElm.requestFullscreen();
			}
			//FireFox  
			else if(docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			}
			//Chrome等  
			else if(docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
			//IE11
			else if(elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
			this.screenFull=true;
		}

	}
	// getdatas:function () { 
	//     EU.RS({
	//         url: UrlUtil.get('api/sysframe', 'getUserInfo'),
	//         msg: false,
	//         scope: this,
	//         callback: function(result) {
	//             if(!result || result.success !== true) {
	//                 EU.toastErrorInfo('读取用户信息失败');

	//                 return;
	//             }
	//             else{
	//                 console.log(result.data)
	//             }
	//         }
	//     });
	//  }

});