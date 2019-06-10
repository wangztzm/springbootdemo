/**
 * 集控器编号组件
 */
Ext.define('Ming.expand.ux.widget.UldNumber', {
    extend: 'Ext.panel.Panel',
    xtype: 'uldnumber',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'uldnumber',

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    config: {
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
         * @cfg {Object} uldTypeComboCfg
         * 板箱类型
         */
        uldTypeComboCfg: {},

        /**
         * @cfg {Object} nameTextfield
         * 编号文本框配置
         */
        numberTextfieldCfg: {},

        /**
         * @cfg {Object} carrierCfg
         * 承运人下拉列表配置
         */
        carrierCfg: {},

        /**
         * @cfg {Object} carrierId
         * 承运人id
         */
        carrierId: null,

        /**
         * @cfg {Object} readOnlyAll
         * 设置板箱类型、集控器号码、承运人为只读
         */
        readOnlyAll: false
    },

    // 板箱类型为T类型默认承运人
    uldTypeIst: null,

    initComponent: function () {
        var me = this,
            store;

        // Look up the configured Store. If none configured, use the fieldless, empty Store
        // defined in Ext.data.Store. If store configuration is present with no storeId
        // we will be creating a new Store instance unique to this Panel, and we should
        // destroy it as well.
        // 查询板箱类型为T类型默认承运人
        store = WidgetConfig.getStoreConfigMap().uldTypeIst;
        store.listeners = {
            load: me.onStoreLoad.bind(me)
        };

        if (store && Ext.isObject(store) && !store.isStore && !store.storeId) {
            store = Ext.apply({
                autoDestroy: true
            }, store);
        }
        store = me.store = Ext.data.StoreManager.lookup(store || 'ext-empty-store');

        // Attach this Panel to the Store
        me.bindStore(store, true);

        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.fieldCtItemId = me.fieldCtCfg.itemId;
        me.uldTypeComboItemId = me.uldTypeComboCfg.itemId;
        me.numberTextfieldItemId = me.numberTextfieldCfg.itemId;
        me.carrierItemId = me.carrierCfg.itemId;

        me.store.load();
        me.getUldNoCmp().on('keyup', me.onUldNoTextfieldKeyUp, me);
        me.getUldCorpCmp().on('blur', me.onCarrierBlur, me);
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            numberTextfield,
            numberTextfieldPos,
            carrier,
            carrierPos;

        me.callParent([width, height, oldWidth, oldHeight]);

        numberTextfield = me.getUldNoCmp();
        numberTextfieldPos = numberTextfield.getPosition(true);
        numberTextfield.setPosition(numberTextfieldPos[0] - 0.5, numberTextfieldPos[1]);

        carrier = me.getUldCorpCmp();
        carrierPos = carrier.getPosition(true);
        carrier.setPosition(carrierPos[0] - 0.5, carrierPos[1]);
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
     * 获取板箱类型组件
     * @return {Object}
     */
    getUldTypeComboCmp: function () {
        var me = this;

        return me.getFieldCtCmp().getComponent(me.uldTypeComboItemId);
    },

    /**
     * 获取集控器号码组件
     * @return {Object}
     */
    getUldNoCmp: function () {
        var me = this;

        return me.getFieldCtCmp().getComponent(me.numberTextfieldItemId);
    },

    /**
     * 获取承运人输入框组件
     * @return {Object}
     */
    getUldCorpCmp: function () {
        var me = this,
            carrier;
        carrier = me.getFieldCtCmp().getComponent(me.carrierItemId);

        return carrier;
    },

    /**
     * 获取板箱类型值
     * @return {Object}
     */
    getUldType: function () {
        var me = this;

        return me.getUldTypeComboCmp().getValue();
    },

    /**
     * 获取集控器号码值
     * @return {Object}
     */
    getUldNo: function () {
        var me = this;

        return me.getUldNoCmp().getValue();
    },

    /**
     * 获取承运人值
     * @return {Object}
     */
    getUldCorp: function () {
        var me = this;

        return me.getUldCorpCmp().getValue();
    },

    /**
     * 设置板箱类型值
     * @param {Object}
     */
    setUldType: function (uldType) {
        var me = this;
        me.getUldTypeComboCmp().setValue(uldType);
    },

    /**
     * 设置集控器号码值
     * @param {Object}
     */
    setUldNo: function (uldNo) {
        var me = this;
        me.getUldNoCmp().setValue(uldNo);
    },

    /**
     * 设置承运人值
     * @param {Object}
     */
    setUldCorp: function (uldCorp) {
        var me = this;
        me.getUldCorpCmp().setValue(uldCorp);
    },

    /**
     * 设置板箱类型、集控器号码、承运人是否只读
     * @param {Object}
     */
    setReadOnlyAllItems: function (readOnly) {
        var me = this,
            uldTypeCombo = me.getUldTypeComboCmp(),
            uldNoTextfield = me.getUldNoCmp(),
            uldCorpTextfield = me.getUldCorpCmp(),
            uldTypeComboEl = uldTypeCombo.inputEl,
            uldNoTextfieldEl = uldNoTextfield.inputEl,
            uldCorpTextfieldEl = uldCorpTextfield.inputEl;

        uldTypeCombo.setReadOnly(readOnly);
        uldNoTextfield.setReadOnly(readOnly);
        uldCorpTextfield.setReadOnly(readOnly);
    },

    /**
     * uld号keyup事件处理
     */
    onUldNoTextfieldKeyUp: function (textfield, e, eOpts) {
        var me = this,
            val,
            len,
            carrier;
        val = textfield.getValue();
        len = val ? val.length : 0;
        if (len == textfield.maxLength && textfield.isValid()) {
            carrier = me.getUldCorpCmp();
            carrier.focus();
        }
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            fieldCtCfg,
            uldTypeComboCfg,
            numberTextfieldCfg,
            carrierCfg;

        me.uldTypeComboCfg = uldTypeComboCfg = Ext.merge({
            xtype: 'combo',
            name: 'uldType',
            itemId: 'uldnumber-uldType',
            fieldLabel: '板箱类型',
            fieldCls: Ext.baseCSSPrefix + 'custom-widget-input',
            forceSelection: false,
            allowBlank: true,
            displayField: 'uldType',
            valueField: 'uldType',
            matchFieldWidth: false,
            anyMatch: true,
            caseSensitive: false,
            dock: 'top',
            width: 58,
            hideTrigger: true,
            autoSelect: true,
            queryMode: 'remote',
            queryCode: 'ULD_TYPE',
            blurValidate4Remote: true,
            blurUppercase: true,
            store: WidgetConfig.getStoreConfigMap().uldType,
            triggerAction: 'query',
            listeners: {
                blur: me.onUldTypeComboBlur.bind(me)
            },
            // Template for the dropdown menu.
            // Note the use of the "x-list-plain" and "x-boundlist-item" class,
            // this is required to make the items selectable.
            tpl: Ext.create('Ext.XTemplate',
                WidgetConfig.getComboXTemplateArgsMap().uldType
            )
        }, me.uldTypeComboCfg);

        me.numberTextfieldCfg = numberTextfieldCfg = Ext.merge({
            xytpe: 'textfield',
            name: 'uldNo',
            itemId: 'uldnumber-uldNo',
            fieldLabel: '集控器号码',
            allowBlank: true,
            maxLength: 5,
            maxLengthText: '该输入项为5位数字',
            vtype: 'alphanum',
            width: 65,
            enforceMaxLength: true,
            enableKeyEvents: true,
            listeners: {}
        }, me.numberTextfieldCfg);

        me.carrierCfg = carrierCfg = Ext.merge({
            xtype: 'carrier',
            itemId: 'uldnumber-uldCorp',
            name: 'uldCorp',
            allowBlank: true,
            width: 58,
            blurValidate4Remote: false,
            validator: me.carrierValidator.bind(me)
        }, me.carrierCfg);

        // 只读设置
        if (me.readOnlyAll) {
            uldTypeComboCfg.readOnly = true;
            numberTextfieldCfg.readOnly = true;
            carrierCfg.readOnly = true;
        }

        me.fieldCtCfg = fieldCtCfg = Ext.merge({
            xtype: 'fieldcontainer',
            itemId: 'uldnumber-fieldContainer',
            fieldLabel: 'ULD号',
            layout: {
                type: 'hbox'
            },
            combineErrors: true,
            msgTarget: 'side',
            defaults: {
                hideLabel: true,
                allowBlank: false
            },
            defaultType: 'textfield',
            items: [
                uldTypeComboCfg,
                numberTextfieldCfg,
                carrierCfg
            ]
        }, me.fieldCtCfg);

        items = [fieldCtCfg];

        return items;
    },

    /**
     * store 加载完成
     * 如果是主单设置运单前缀
     */
    onStoreLoad: function (store, records, successful, operation, eOpts) {
        var me = this;
        if (successful) {
            me.setCarrierValue();
        }
    },

    /**
     * 设置承运人
     */
    setCarrierValue: function () {
        var me = this,
            store = me.store,
            firstRecord,
            carrier,
            carrierId,
            combo = me.getUldTypeComboCmp(),
            sel = combo.getSelection(),
            appType;

        firstRecord = store.getAt(0);
        me.uldTypeIst = carrierId = firstRecord && firstRecord.data && firstRecord.data.configValue;
        if (sel) {
            appType = sel.data.appType;
        }
        if (appType === 'T') {
            carrier = me.getUldCorpCmp();
            carrier.setValue(carrierId);
            carrier.validate();
        }
    },

    /**
     * 绑定store到this
     */
    bindStore: function (store, initial) {
        var me = this;
        if (store) {
            me.store = store;
            me.mon(store, {
                load: me.onStoreLoad,
                scope: me
            });
        } else {
            me.unbindStore();
        }
    },

    /**
     * 解除绑定store
     */
    unbindStore: function () {
        var me = this,
            store = me.store;

        if (store) {
            store.trackStateChanges = false;
            me.store = null;
            me.mun(store, {
                load: me.onStoreLoad,
                scope: me
            });
            if (!store.destroyed && store.autoDestroy) {
                store.destroy();
            }
        }
    },

    doDestroy: function () {
        var me = this;

        me.callParent();
        // Have to unbind the store this late because plugins and other things
        // may still need it until the very end.
        me.unbindStore();
    },

    /**
     * 根据选中的板箱类型设置承运人信息
     */
    onUldTypeComboBlur: function (combo, event, eOpts) {
        var me = this,
            sel = combo.getSelection(),
            rawValue = combo.getRawValue(),
            setCarrier = function (selUldTypeData) {
                var me = this,
                    appType,
                    carrier;
                carrier = me.getUldCorpCmp();
                carrier.setValue('');
                carrier.setReadOnly(false);
                if (!selUldTypeData) {
                    return;
                }
                appType = selUldTypeData.appType;
                if (appType === 'T') {
                    carrier.setReadOnly(true);
                    if (me.store) {
                        me.store.load();
                    }
                } else {
                    if (me.carrierId) {
                        carrier.setValue(me.carrierId);
                    }
                }
            };

        if (combo.isDisabled() || combo.readOnly) {
            return;
        }

        if (!sel) {
            if(!rawValue) {
                return;
            }
            EU.RS({
                url: UrlUtil.get('api/dynamicdict', 'list'),
                scope: me,
                msg: false,
                jsonData: {
                    code: 'ULD_TYPE',
                    paramMap: {
                        query: rawValue
                    }
                },
                callback: function (result) {
                    var resultData = result.data,
                        uldTypeData = resultData && resultData.length == 1 && resultData[0].uldType === rawValue.toUpperCase() ? resultData[0] : null;
                    if (result.success && result.resultCode === '0' && uldTypeData) {
                        setCarrier.apply(me, [uldTypeData]);
                    } else {
                        setCarrier.apply(me, [null]);
                        EU.toastInfo('请输入正确板箱类型。');
                    }
                }
            });
        } else {
            setCarrier.apply(me, [sel.data]);
        }
    },

    /**
     * 验证承运人值是否存在
     */
    carrierValidator: function (val) {
        if (!val) {
            return true;
        }
        var me = this,
            uldTypeCombo = me.getUldTypeComboCmp(),
            sel = uldTypeCombo.getSelection(),
            appType,
            carrier;

        appType = sel ? sel.data.appType : null;
        carrier = me.getUldCorpCmp();

        if (appType === 'T') {
            var carrierId = carrier.getValue();
            if (carrierId === me.uldTypeIst) {
                return true;
            }

            return '集控器应用类型为T时，' + carrierId + '不存在。';

        }
        return true;
    },

    /**
     * 承运人失去焦点验证
     */
    onCarrierBlur: function (carrierCmp) {
        var me = this,
            uldTypeCombo = me.getUldTypeComboCmp(),
            sel = uldTypeCombo.getSelection(),
            appType;

        appType = sel ? sel.data.appType : null;

        if (appType === 'T') {
            return;
        }
        carrierCmp.onBlurValidate4Remote();
    }
});
