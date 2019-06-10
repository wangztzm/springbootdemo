/**
 * 仓库库位组件
 */
Ext.define('Ming.expand.ux.widget.Warehouse', {
    extend: 'Ext.panel.Panel',
    xtype: 'warehouse',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'warehouse',

    /**
     * @cfg referenceHolder
     * @inheritdoc
     */
    referenceHolder: true,

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    layout: {
        type: 'hbox'
    },

    config: {

        /**
         * @cfg {Object} domInt
         * 国内国际
         */
        domInt: null,

        /**
         * @cfg {Object} owner
         * 保存父视图的引用
         */
        ownerView: null,

        /**
         * @cfg {Object} fieldCtCfg
         * 表单字段容器fieldcontainer配置
         */
        fieldCtCfg: {},

        /**
         * @cfg {Object} warehouseComboCfg
         * 仓库
         */
        warehouseComboCfg: {},

        /**
         * @cfg {Object} locationComboCfg
         * 库位
         */
        locationComboCfg: {}
    },


    initComponent: function () {
        var me = this;
        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.fieldCtItemId = me.fieldCtCfg.itemId;
        me.warehouseComboItemId = me.warehouseComboCfg.itemId;
        me.locationComboItemId = me.locationComboCfg.itemId;
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            locationCombo,
            locationComboPos;

        me.callParent([width, height, oldWidth, oldHeight]);

        locationCombo = me.getLocationComboCmp();
        locationComboPos = locationCombo.getPosition(true);
        locationCombo.setPosition(locationComboPos[0] - 0.5, locationComboPos[1]);
    },

    /**
     * 返回fieldcontainer组件
     * @return {Object}
     */
    getFieldCtCmp: function () {
        var me = this;
        return me.getComponent(me.fieldCtItemId);
    },

    /**
     * 获取仓库组件
     * @return {Object}
     */
    getWarehouseComboCmp: function () {
        var me = this;

        return me.getFieldCtCmp().getComponent(me.warehouseComboItemId);
    },

    /**
     * 获取库位组件
     * @return {Object}
     */
    getLocationComboCmp: function () {
        var me = this;

        return me.getFieldCtCmp().getComponent(me.locationComboItemId);
    },

    /**
     * 获取仓库值
     * @return {Object}
     */
    getWarehouseId: function () {
        var me = this;

        return me.getWarehouseComboCmp().getValue();
    },

    /**
     * 获取库位值
     * @return {Object}
     */
    getLocationId: function () {
        var me = this;

        return me.getLocationComboCmp().getValue();
    },

    /**
     * 设置仓库值
     * @param {Object}
     */
    setWarehouseId: function (val) {
        var me = this;
        me.getWarehouseComboCmp().setValue(val);
    },

    /**
     * 设置库位值
     * @param {Object}
     */
    setLocationId: function (val) {
        var me = this;
        me.getLocationComboCmp().setValue(val);
    },

    /**
     * 仓库改变
     */
    onWarehouseComboChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            locationCombo = me.getLocationComboCmp(),
            locationStore = locationCombo.getStore(),
            locationHandle = function () {
                var me = this,
                    warehouseCombo = me.getWarehouseComboCmp(),
                    warehouseId = warehouseCombo.getValue(),
                    selLocationRec,
                    locationWarehouseId,
                    locationCombo,
                    locationStore,
                    locationFilters,
                    filter,
                    filterCommon,
                    domInt = me.domInt;
                locationCombo = me.getLocationComboCmp();
                locationStore = locationCombo.getStore();
                locationFilters = locationStore.getFilters();
                locationFilters.beginUpdate();
                locationStore.clearFilter();
                filterCommon = new Ext.util.Filter({
                    filterFn: function (item) {
                        var data = item.data, domIntFlag, cgoIntFlag;
                        if (domInt) {
                            if (domInt == 'D') {
                                domIntFlag = data.cgoDom === 'Y';
                            }
                            if (domInt == 'I') {
                                cgoIntFlag = data.cgoInt === 'Y';
                            }
                        }
                        return (!domInt || (domIntFlag || cgoIntFlag)) && data.opeDepartmentId === cfg.sub.opedepartid;
                    }
                });
                locationStore.addFilter(filterCommon);
                if (warehouseId) {
                    filter = new Ext.util.Filter({
                        filterFn: function (item) {
                            var data = item.data;
                            return data.warehouseId === warehouseId;
                        }
                    });
                    locationStore.addFilter(filter);
                }

                selLocationRec = locationCombo.getSelection();
                locationWarehouseId = selLocationRec && selLocationRec.data && selLocationRec.data.warehouseId;
                if (!warehouseId || warehouseId != locationWarehouseId) {
                    locationCombo.suspendEvents();
                    locationCombo.clearValue();
                    locationCombo.resumeEvents();
                }
                locationFilters.endUpdate();
            };

        if (locationStore.isLoading() || (locationStore.loadCount === 0 && !locationStore.getCount())) {
            // If it is NOT a preloaded store, then unless a Session is being used,
            // The newly loaded records will NOT match any in the ownerStore.
            // So we must match them by ID in order to select the same dataset.
            locationStore.on('load', locationHandle, me, {single: true});
            return;
        }
        locationHandle.apply(me);
    },

    /**
     * 库位改变
     */
    onLocationComboChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            warehouseCombo = me.getWarehouseComboCmp(),
            warehouseStore = warehouseCombo.getStore(),
            warehouseHandle = function () {
                var me = this,
                    locationCombo = me.getLocationComboCmp(),
                    selLocationRec = locationCombo.getSelection(),
                    warehouseId = selLocationRec && selLocationRec.data && selLocationRec.data.warehouseId,
                    warehouseCombo,
                    warehouseStore;
                if (warehouseId) {
                    warehouseCombo = me.getWarehouseComboCmp();
                    warehouseStore = warehouseCombo.getStore();
                    warehouseCombo.suspendEvents();
                    warehouseCombo.select(warehouseStore.findRecord('warehouseId', warehouseId));
                    warehouseCombo.resumeEvents();
                }
            };
        if (warehouseStore.isLoading() || (warehouseStore.loadCount === 0 && !warehouseStore.getCount())) {
            // If it is NOT a preloaded store, then unless a Session is being used,
            // The newly loaded records will NOT match any in the ownerStore.
            // So we must match them by ID in order to select the same dataset.
            warehouseStore.on('load', warehouseHandle, me, {single: true});
            return;
        }
        warehouseHandle.apply(me);
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            fieldCtCfg,
            warehouseComboCfg,
            locationComboCfg,
            domInt = me.domInt,
            storeFilters = [
                function (item) {
                    var data = item.data, domIntFlag, cgoIntFlag;
                    if (domInt) {
                        if (domInt == 'D') {
                            domIntFlag = data.cgoDom === 'Y';
                        }
                        if (domInt == 'I') {
                            cgoIntFlag = data.cgoInt === 'Y';
                        }
                    }
                    return (!domInt || (domIntFlag || cgoIntFlag)) && data.opeDepartmentId === cfg.sub.opedepartid;
                }
            ];

        me.warehouseComboCfg = warehouseComboCfg = Ext.merge({
            xtype: 'customcombo',
            fieldLabel: '仓库',
            name: 'warehouseId',
            itemId: 'warehouseId',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: true,
            displayField: 'warehouseName',
            valueField: 'warehouseId',
            matchFieldWidth: false,
            anyMatch: true,
            caseSensitive: false,
            dock: 'top',
            autoSelect: true,
            queryCode: 'WAREHOUSE',
            queryParamMap: {opeDepartId: cfg.sub.opedepartid, domInt: me.domInt},
            // Template for the dropdown menu.
            // Note the use of the "x-list-plain" and "x-boundlist-item" class,
            // this is required to make the items selectable.
            tpl: Ext.create('Ext.XTemplate',
                WidgetConfig.getComboXTemplateArgsMap().warehouse
            ),
            listeners: {
                change: me.onWarehouseComboChange.bind(me)
            }
        }, me.warehouseComboCfg);
        warehouseComboCfg.storeFilters = storeFilters;

        me.locationComboCfg = locationComboCfg = Ext.merge({
            xtype: 'customcombo',
            fieldLabel: '库位',
            name: 'locationId',
            itemId: 'locationId',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: true,
            displayField: 'locationName',
            valueField: 'locationId',
            matchFieldWidth: false,
            anyMatch: true,
            caseSensitive: false,
            dock: 'top',
            autoSelect: true,
            queryCode: 'WAREHOUSE_LOCATION',
            queryParamMap: {opeDepartId: cfg.sub.opedepartid, domInt: me.domInt},
            // Template for the dropdown menu.
            // Note the use of the "x-list-plain" and "x-boundlist-item" class,
            // this is required to make the items selectable.
            tpl: Ext.create('Ext.XTemplate',
                WidgetConfig.getComboXTemplateArgsMap().warehouseLocation
            ),
            listeners: {
                change: me.onLocationComboChange.bind(me)
            }
        }, me.locationComboCfg);
        locationComboCfg.storeFilters = storeFilters;

        me.fieldCtCfg = fieldCtCfg = Ext.merge({
            xtype: 'fieldcontainer',
            itemId: 'warehouse-fieldContainer',
            fieldLabel: '仓库/库位',
            combineErrors: true,
            msgTarget: 'side',
            layout: {
                type: 'hbox'
            },
            defaults: {
                hideLabel: true
            },
            items: [
                warehouseComboCfg,
                locationComboCfg
            ]
        }, me.fieldCtCfg);

        items = [fieldCtCfg];

        return items;
    }
});
