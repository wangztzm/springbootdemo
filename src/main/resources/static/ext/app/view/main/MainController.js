Ext.define('Ming.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    config: {
        /**
         * @cfg {Object} domInt
         * 国内国际
         */
        domInt: null,

        /**
         * @cfg {Object} expImp
         * 进港出港
         */
        expImp: null

    },

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    lastView: null,

    setCurrentView: function (hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag),
            comp = Ext.ComponentQuery.query(hashTag),
            view = (node && node.get('viewType')) || (comp ? hashTag : 'page404'),
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create({
                xtype: view,
                routeId: hashTag, // for existingItem search later
                hideMode: 'offsets',
                domInt: me.getDomInt(), // 国内国际
                expImp: me.getExpImp() // 进港出港
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.senchaLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout(); // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }
            navigationList.canMeasure = false;

            // Start this layout first since it does not require a layout
            refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                        navigationList.canMeasure = true;
                    },
                    single: true
                });
            }
        }
    },

    onMainViewRender: function () {
        if (!window.location.hash) {
            this.redirectTo('pageblank');
        }
    },

    // 隐藏顶部工具栏和左边树
    onMainViewBeforeRender: function () {
        var me = this,
            refs = me.getReferences(),
            senchaToolBar = refs.senchaToolBar,
            navigationList = refs.navigationTreeList;
        senchaToolBar.setHidden(true);
        senchaToolBar.setHeight(0);
        navigationList.setHidden(true);
        navigationList.setWidth(0);
    },

    /**
     * 解析Url的hash值，获取要显示的页面id以及指定的参数。
     * @param location
     */
    onRouteChange: function (locationHash) {
        var me = this,
            locationHashParts,
            params,
            domInt,
            expImp;
        locationHashParts = locationHash.split('?');
        if (locationHashParts.length > 1) {
            params = Ext.Object.fromQueryString(locationHashParts[1]);
            domInt = params.domInt ? params.domInt : null;
            me.setDomInt(domInt);
            expImp = params.expImp ? params.expImp : null;
            me.setExpImp(expImp);
        } else {
            me.setDomInt(null);
            me.setExpImp(null);
        }
        me.setCurrentView(locationHashParts[0]);
    }
});
