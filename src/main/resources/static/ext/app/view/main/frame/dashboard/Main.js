Ext.define('Ming.view.main.frame.dashboard.Main', {
	extend: 'Ext.panel.Panel',
	xtype: 'dashboardThene',
	requires: [
		'Ming.view.main.frame.dashboard.MainController',
		'Ming.view.main.frame.default.SkinSelect'
	],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	controller: 'dashboardThemeController',
	cls: 'sencha-dash-viewport',
	initComponent: function() {
		var me = this;
		var toolbar = Ext.create('Ext.toolbar.Toolbar', {
			height: 64,
			cls: 'sencha-dash-dash-headerbar toolbar-btn-shadow',
			items: [{
					xtype: 'component',
					reference: 'senchaLogo',
					cls: 'sencha-logo',
					width: 250,
					html: '<div class="main-logo"><img src="app/view/platform/frame/dashboard/resources/images/company-logo.png">Sencha</div>'
				},
				{
					margin: '0 0 0 8',
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-navicon',
					handler: 'onToggleNavigationSize'
				},
				{
					xtype: 'label',
					cls: 'delete-focus-bg',
					html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="letter-spacing:2mm;font-size:24px; color:#4D4D4D;" class="x-fa fa-th"><b>' + cfg.systemname + '</b></span>(Ver:6.0.2015.10.10) '
				},
				{
					xtype: 'tbspacer',
					flex: 1
				},
				{
					xtype: 'button',
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-university',
					text: '主题风格',
					reference: 'b_theme'
				},
				{
					xtype: 'button',
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-th-large',
					text: '系统皮肤',
					reference: 'b_style'
				},
				{
					xtype: 'skinSelect'
				},
				{
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-search',
					tooltip: '全文检索'
				},
				{
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-sign-out',
					tooltip: '退出系统',
					handler: 'onLogout'
				},
				{
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-bell',
					tooltip: '消息提醒',
					reference: 'b_tips',
					handler: 'onMessage'
				},
				{
					cls: 'delete-focus-bg',
					iconCls: 'x-fa fa-user',
					tooltip: '用户信息',
					handler: 'onUserclick'
				},
				{
					xtype: 'tbtext',
					text: cfg.sub.username,
					cls: 'top-user-name'
				}
				// ,{xtype: 'image',cls: 'header-right-profile-image',height: 35,width: 35,alt:'current user image',src: 'platform/personnel/getphoto.do?_dc='+new Date().getTime()+'&photoid='+cfg.sub.photoid}
			]
		});
		me.items = [toolbar];
		Loader.request('app/view/main/frame/dashboard/resources/style.css', function() {
			me.initView(); // css加载完成后才初始化组件
		});
		me.callParent();
	},

	initView: function() {
		var me = this,
			height = Ext.Element.getViewportHeight() - 64;
		var navTree = Ext.create('Ext.list.Tree', {
			reference: 'navigationTreeList',
			ui: 'navigation',
			style: 'min-height:' + height + 'px',
			store: {
				autoLoad: true,
				proxy: {
					type: 'ajax',
					url: UrlUtil.get('api/sysframe', 'getMenus'),
					reader: {
						type: 'json'
					},
					extractResponseData: function(response) {
						console.debug(response.responseText);
						var result=Ext.JSON.decode(response.responseText);
						var datas=[],firstNode;
						Ext.each(result.data, function(record) {
						//一级菜单
						//第0次
						if(!firstNode) {
							firstNode = {};
							firstNode.id = record.mmenuid;
							firstNode.text = record.mmenusc;
							firstNode.leaf = false;
							firstNode.visible = true;
							firstNode.children = [];
							datas.push(firstNode);
						} else {
							if(firstNode.id != record.mmenuid) {
								firstNode = {};
								//还是同级菜单，不处理
								firstNode.id = record.mmenuid;
								firstNode.text = record.mmenusc;
								firstNode.leaf = false;
								firstNode.visible = true;
								firstNode.children = [];
								datas.push(firstNode);
							}
						}
						//二级菜单
						var sencondNode = {};
						sencondNode.id = record.smenuid;
						sencondNode.text = record.smenudsc;
						sencondNode.leaf = true;
						sencondNode.visible = true;
						sencondNode.url = record.smenuurl;
						sencondNode.type = "01";
						firstNode.children.push(sencondNode);
					});	
						result.data=datas;
						response.responseText = Ext.JSON.encode(result);
						console.debug(response.responseText);
						return response;
						/*var json = Ext.loadFilter(Ext.JSON.decode(response.responseText), {
							parentField: 'pid'
						});
						Ext.each(json, function(record) {
							if(Ext.isEmpty(record.children)) {
								record.expanded = false;
								record.leaf = true;
							} else {
								record.expanded = true;
							}
						});
						response.responseText = Ext.JSON.encode(json);
						return response;*/
					}
				}
			},
			width: 250,
			expanderFirst: false,
			expanderOnly: false,
			listeners: {
				selectionchange: 'onNavigationTreeSelectionChange'
			}
		});
		var mainCardPanel = Ext.SystemTabPanel = Ext.create('Ext.container.Container', {
			flex: 1,
			reference: 'mainCardPanel',
			cls: 'sencha-dash-right-main-container',
			layout: {
				type: 'card',
				anchor: '100%'
			}
		});
		var maincontainerwrap = Ext.create('Ext.container.Container', {
			scrollable: 'y',
			flex: 1,
			minHeight: height,
			layout: {
				type: 'hbox',
				align: 'stretchmax',
				animate: true,
				animatePolicy: {
					x: true,
					width: true
				}
			},
			reference: 'mainContainerWrap',
			style: 'background: #f6f6f6;',
			items: [navTree, mainCardPanel],
			listeners: {
				resize: function(thiz, width, height, oldWidth, oldHeight, eOpts) {
					var me = this,
						height = Ext.Element.getViewportHeight() - 64;
					me.minHeight = height;
					navTree.setStyle({
						'min-height': height + 'px'
					});
				}
			}
		});
		me.add(maincontainerwrap);
	}
});