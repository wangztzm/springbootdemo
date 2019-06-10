Ext.define('Ming.view.main.frame.default.Main', {
	extend: 'Ext.panel.Panel',
	xtype: 'defaultThene',
	requires: [
		'Ming.view.main.frame.default.MainController',
		'Ming.view.main.frame.default.TabPanel',
		'Ming.view.main.frame.default.UserEdit',
		'Ming.view.main.frame.default.SkinSelect',
		'Ext.ux.TabCloseMenu'
	],
	controller: 'defaultThemeController',
	layout: 'border',
	referenceHolder: true,
	menuPatternKey: 'SYSTEM_MENU_PATTERN_KEY',
	listeners: {
		//窗口发生变化，重新定位按钮位置
		resize: "onMainResize"
	},
	initComponent: function() {
		var me = this;
		var type = local.get(me.menuPatternKey) || 0; // type 0=卡片式菜单（tabPanel），1=切换式菜单（accordion布局） 缺省：卡片式菜单
		var northPanel = Ext.create('Ext.panel.Panel', {
			region: 'north',
			items: [{
				xtype: 'toolbar',
				height: 42,
				items: [{
						xtype: 'label',
						cls: 'delete-focus-bg',
						html: '<span style="letter-spacing:2mm;font-size:24px; color:#4D4D4D;" class="x-fa fa-th"><b>' + cfg.systemname + '</b></span> '
					},
					'->',
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
			iconCls: "x-fa fa-desktop",
			handler: "OnScreenFull",
			text:'全屏',
			tooltip: '全屏(F11)'
		},
					/*  {cls: 'delete-focus-bg',iconCls:'x-fa fa-search',tooltip: '全文检索'},*/
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
					},{
						
						cls: 'delete-focus-bg',
			iconCls: "x-fa fa-angle-double-up",
			handler: "OnHiddenTopBottom",
			tooltip: '隐藏顶部和底部区域'
		}
					//  ,{xtype: 'image',cls: 'header-right-profile-image',height: 35,width: 35,alt:'current user image',src: 'platform/personnel/getphoto.do?_dc='+new Date().getTime()+'&photoid='+cfg.sub.photoid}
				]
			}]
		});
		var tools = [{
				type: 'unpin',
				tooltip: '切换至层叠方式显示',
				handler: function(event, toolEl, panelHeader) {
					local.set(me.menuPatternKey, type = (type == 0 ? 1 : 0));
					this.setTooltip(type == 0 ? '切换至层叠方式显示' : '切换至树状方式显示');
					this.setType(type == 0 ? 'unpin' : 'pin');
					me.updateMenuStyle(westPanel, systemPanel, favoritesPanel, type);
				}
			},
			{
				type: 'expand',
				tooltip: '收缩全部树节点',
				handler: function(event, toolEl, panelHeader) {
					var panel = me.getHandleTreePanel(westPanel, type);
					if(panel) panel.collapseAll();
				}
			},
			{
				type: 'collapse',
				tooltip: '展开全部树节点',
				handler: function() {
					var panel = me.getHandleTreePanel(westPanel, type);
					if(panel) panel.expandAll();
				}
			},
			{
				type: 'refresh',
				tooltip: '刷新菜单树',
				handler: function(event, toolEl, panelHeader) {
					var panel = me.getHandleTreePanel(westPanel, type);
					if(panel) panel.getStore().reload();
				}
			}
		];
		var maintabpanel = Ext.SystemTabPanel = Ext.create('frame.default.TabPanel');
		//得到动态的树的数据源
		//var treePanelStore=me.buildSystemMenuTreeStore();		
		var systemPanel = {
			xtype: 'treepanel',
			layout: 'fit',
			title: '系统菜单',
			useArrows: true,
			hideHeaders: true,
			//root:{expanded:true},
			//store:treePanelStore,
			store: {
				autoLoad: true,		
				url: UrlUtil.get('api/sysframe', 'getMenuTree2'),
	/*			proxy: {
                type: 'api',
                paramsAsJson: true,
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    messageProperty: 'msg'
                },
				url: UrlUtil.get('api/sysframe', 'getMenuTree')
            },*/
				listeners: {
					load: function(thiz, records, successful, eOpts) {
						//console.debug("zihui---",records);
						var datas = [];
						Ext.SystemTabPanelAutoOpens = {};
						Ext.each(records, function(record) {
							datas.push(record.data);
							// console.log(datas)
						});
						CU.eachChild(datas, function(data) {
							if(!Ext.isEmpty(data.param2)) {
								try{
									PU.openTabModule(data, {
										checked: false
									});
									Ext.SystemTabPanelAutoOpens[data.id] = data;
								}catch(e){}
							}
						}, this);
					}
				}
			},
			
			columns: [{
				xtype: 'treecolumn',
				flex: 1,
				dataIndex: 'text',
				scope: 'controller',
				renderer: 'treeNavNodeRenderer'
			}],
			listeners: {
				itemclick: 'onMenuTreeItemClick'
			},
			buttons: [{
				xtype: 'treefilterfield',
				width: '100%',
				emptyText: '搜索菜单',
				autoFilter: true,
				dataIndex: 'text'
			}]
		};
		
		var favoritesPanel = {
			xtype: 'treepanel',
			layout: 'fit',
			title: '收藏菜单',
			useArrows: true,
			hideHeaders: true,
			store: {
				autoLoad: true,
				/*params: {
					type: '01'
				},*/
				proxy: {
                type: 'api',
                paramsAsJson: true,
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'data',
                    messageProperty: 'msg'
                },
				url: UrlUtil.get('api/sys/systemcfg', 'getMenuList'),
                 extraParams:{
	            	type: '01'
	            	}
            },
				listeners: {
					load: function(thiz, records, successful, eOpts) {
						Ext.SystemFavorites = {};
						Ext.each(records, function(record) {
							Ext.SystemFavorites[record.data.id] = record.data;
						});
					}
				}
			},
			
			columns: [{
				xtype: 'treecolumn',
				flex: 1,
				dataIndex: 'text',
				scope: 'controller',
				renderer: 'treeNavNodeRenderer'
			}],
			listeners: {
				itemcontextmenu: 'onFavoritesContextmenu',
				itemclick: 'onMenuTreeItemClick'
			},
			buttons: [{
				xtype: 'treefilterfield',
				width: '100%',
				emptyText: '搜索菜单',
				autoFilter: true,
				dataIndex: 'text'
			}]
		};
		var westPanel = Ext.create('Ext.panel.Panel', {
			region: 'west',
			layout: 'fit',
			title: '导航菜单',
			width: 250,
			minWidth: 250,
			collapsible: true,
			split: true,
			tools: tools
		});
		me.items = [northPanel, westPanel, maintabpanel];
		me.updateMenuStyle(westPanel, systemPanel, favoritesPanel, type);
		me.callParent();
	},

	/**
	 * 更新菜单风格
	 * @param {} type 0=卡片式菜单（tabPanel），1=切换式菜单（accordion布局）
	 */
	updateMenuStyle: function(westPanel, systemPanel, favoritesPanel, type) {
		westPanel.removeAll(true);
		switch(type) {
			case 0:
				{
					westPanel.add({
						xtype: 'tabpanel',
						tabPosition: 'left',
						items: [systemPanel, favoritesPanel]
					});
					break;
				}
			case 1:
				{
					westPanel.add({
						xtype: 'panel',
						layout: 'accordion',
						items: [systemPanel, favoritesPanel]
					});
					break;
				}
		}
	},

	/**
	 * 获取当前活动panel
	 * @param {} westPanel
	 * @param {} type
	 * @return {}
	 */
	getHandleTreePanel: function(westPanel, type) {
		var item = westPanel.items.items[0];
		var panel = null;
		switch(type) {
			case 0:
				{
					panel = item.getActiveTab();
					break;
				}
			case 1:
				{
					panel = item.getLayout().getExpanded()[0];
					break;
				}
		}

		return panel;
	},
	/**
	 * 生成系统菜单所需要的TreeStore
	 */
	buildSystemMenuTreeStore:function(){
		var treePanelStore;
		/**
		 * 动态加载菜单数据
		 * addbyzihui
		 */
		EU.RS({
			url: UrlUtil.get('api/sysframe', 'getMenus'),
			scope: this,
			async:false,
			callback: function(result) {
				var datas = [];
				var firstNode;
				if(result && result.success === true && result.resultCode === '0') {
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
					//创建TreeStore放入treePanelStore
					treePanelStore=Ext.create('Ext.data.TreeStore', {
							root: {
								expanded: true,
								children: datas
							}
					});					
					/**
					 * 登录时默认打开相应的菜单
					 */
					var datas2 = [];
					Ext.SystemTabPanelAutoOpens = {};
					Ext.each(datas, function(record) {
						datas2.push(record);
						// console.log(datas)
					});
					CU.eachChild(datas2, function(data) {
						if(!Ext.isEmpty(data.param2)) {
							PU.openTabModule(data, {
								checked: false
							});
							Ext.SystemTabPanelAutoOpens[data.id] = data;
						}
					}, this);
				}
				//if(Ext.isFunction(callback)) callback();
			}
		});
		
	return treePanelStore;
	}
});