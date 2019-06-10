Ext.define('Ming.view.main.Main', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ext.button.Segmented',
        'Ext.list.Tree',
        'Ming.view.main.MainContainerWrap',
        'Ming.view.main.MainController',
        'Ming.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: 'main',

    cls: 'sencha-dash-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        beforerender: 'onMainViewBeforeRender',
        render: 'onMainViewRender'
    },

    items: [
        {
            xtype: 'toolbar',
            cls: 'sencha-dash-dash-headerbar shadow',
            height: 64,
            itemId: 'headerBar',
            reference: 'senchaToolBar',
            items: [
                {
                    xtype: 'component',
                    reference: 'senchaLogo',
                    cls: 'sencha-logo',
                    html: '<div class="main-logo"><img src="' + URL.getResource('logo') + '">' + I18N.AppTitle + '</div>',
                    width: 250
                },
                {
                    margin: '0 0 0 8',
                    ui: 'header',
                    iconCls: 'x-fa fa-navicon',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },
                '->'
            ]
        },
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    reference: 'navigationTreeListContainer',
                    itemId: 'navigationTreeListContainer',
                    cls: 'tree-list-container',
                    items: [
                        {
                            xtype: 'treelist',
                            reference: 'navigationTreeList',
                            itemId: 'navigationTreeList',
                            ui: 'nav',
                            store: 'NavigationTree',
                            width: 250,
                            expanderFirst: false,
                            expanderOnly: false,
                            listeners: {
                                selectionchange: 'onNavigationTreeSelectionChange'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    reference: 'mainCardPanel',
                    cls: 'sencha-dash-right-main-container',
                    itemId: 'contentPanel',
                    layout: {
                        type: 'card',
                        anchor: '100%'
                    }
                }
            ]
        }
    ]
});
