/**
 * 运单号组件
 * 各运单类型对应的前缀、运单号的maxLength和minLength均在此维护了
 * 运单类型改变触发自定义事件：waybilltypechange
 * 运单前缀改变触发自定义事件：waybillnumberprefixchange
 * 运单前缀改变触发自定义事件：waybillnumbechange
 */
Ext.define('Ming.expand.ux.widget.WaybillNumber', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'waybillnumber',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'waybillnumber',

    /**
     * @cfg style  table 布局时，此控件会被追加样式margin-bottom: 10px; 这里设置成0px。
     * @inheritdoc
     */
    // style: 'margin-bottom: 0px;',

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '运单号',

    /**
     * @cfg combineErrors
     * @inheritdoc
     */
    combineErrors: true,

    /**
     * @cfg msgTarget
     * @inheritdoc
     */
    msgTarget: 'side',

    /**
     * @cfg layout
     * @inheritdoc
     */
    layout: {
        type: 'hbox'
    },

    /**
     * @cfg defaults
     * @inheritdoc
     */
    defaults: {
        hideLabel: true
    },

    config: {
        /**
         * @cfg {Object} owner
         * 保存父视图的引用
         */
        ownerView: null,

        /**
         * @cfg {Object} typeComboCfg
         * 运单类型下拉列表配置
         */
        typeComboCfg: {},

        /**
         * @cfg {Object} prefixTextfieldCfg
         * 运单前缀文本框配置
         */
        prefixTextfieldCfg: {},

        /**
         * @cfg {Object} numberTextfieldCfg
         * 运单号文本框配置
         */
        numberTextfieldCfg: {},

        /**
         * @cfg {Object} viewCache
         * 缓存输入框的值
         */
        viewCache: {},

        /**
         * @cfg {Object} domInt
         * 国内国际
         */
        domInt: 'DI',

        /**
         * @cfg {Object} maxPrefixWidth
         * 运单号前缀的最大显示宽度
         */
        maxPrefixTextfieldWidth: 100,

        /**
         * @cfg {Object} maxPrefixWidth
         * 运单号的最大显示宽度
         */
        maxNumberTextfieldWidth: 150,

        /**
         * @cfg {Object} prefixTextfieldWidth
         * 运单号前缀的固定显示宽度
         */
        prefixTextfieldWidth: undefined,

        /**
         * @cfg {Object} numberTextfieldWidth
         * 运单号的固定显示宽度
         */
        numberTextfieldWidth: undefined,

        /**
         * @cfg {Object} carrierId
         * 承运人id，如果设定此值则请求后台查询运单前缀
         */
        carrierId: null,

        /**
         * @cfg {Object} readOnlyAll
         * 设置运单类型、运单前缀、运单号为只读
         */
        readOnlyAll: false,

        /**
         * @cfg {Object} readOnlyWaybillType
         * 设置运单类型为只读
         */
        readOnlyWaybillType: false,

        /**
         * @cfg {Object} selectAfterLoad
         * 查询到运单类型配置后，默认选择主单或者第一条
         */
        selectAfterLoad: 'AWBA'
    },

    /**
     * 匹配数字
     */
    numReg: /^[0-9_]+$/,

    /**
     * @event viewready
     * Fires when the view is available
     * @param {Ext.panel.Panel} this
     */
    constructor: function (config) {
        var me = this,
            store;

        me.callParent([config]);

        store = me.store;

        // Any further changes become stateful.
        store.trackStateChanges = true;

        if (me.autoLoad) {
            // Note: if there is a store bound by a VM, we (might) do the load in #setStore.
            if (!store.isEmptyStore) {
                store.load();
            }
        }
    },

    initComponent: function () {
        var me = this,
            store,
            typeCombo,
            typeComboStore,
            prefixTextfield,
            numberTextfield;

        if (me.carrierId) {
            // Look up the configured Store. If none configured, use the fieldless, empty Store
            // defined in Ext.data.Store. If store configuration is present with no storeId
            // we will be creating a new Store instance unique to this Panel, and we should
            // destroy it as well.
            store = WidgetConfig.getStoreConfigMap().carrierQuery;
            store.proxy.extraParams.paramMap = {
                carrierId: me.carrierId
            };

            if (store && Ext.isObject(store) && !store.isStore && !store.storeId) {
                store = Ext.apply({
                    autoDestroy: true
                }, store);
            }
        }
        store = me.store = Ext.data.StoreManager.lookup(store || 'ext-empty-store');

        // Attach this Panel to the Store
        me.bindStore(store, true);

        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.typeComboItemId = me.typeComboCfg.itemId;
        me.prefixTextfieldItemId = me.prefixTextfieldCfg.itemId;
        me.numberTextfieldItemId = me.numberTextfieldCfg.itemId;

        typeCombo = me.getStockTypeComboCmp();
        prefixTextfield = me.getStockPreTextfieldCmp();
        numberTextfield = me.getStockNoTextfieldCmp();

        typeCombo.on('change', me.onSelectChange, me, {priority: 100});
        prefixTextfield.on('change', me.onPrefixTextfieldChange, me, {priority: 100});
        prefixTextfield.on('keyup', me.onPrefixTextfieldKeyUp, me, {priority: 100});
        numberTextfield.on('change', me.onNumberTextfieldChange, me, {priority: 100});
        numberTextfield.on('blur', me.onNumberTextfieldBlur, me, {priority: 100});
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            prefixTextfield,
            prefixTextfieldPos,
            numberTextfield,
            numberTextfieldPos,
            numberTextfieldOffset = 0.4;

        me.callParent([width, height, oldWidth, oldHeight]);

        prefixTextfield = me.getStockPreTextfieldCmp();
        prefixTextfieldPos = prefixTextfield.getPosition(true);
        prefixTextfield.setPosition(prefixTextfieldPos[0] - 0.4, prefixTextfieldPos[1]);

        numberTextfield = me.getStockNoTextfieldCmp();
        numberTextfieldPos = numberTextfield.getPosition(true);
        numberTextfield.setPosition(numberTextfieldPos[0] - numberTextfieldOffset, numberTextfieldPos[1]);
    },

    afterRender: function () {
        var me = this,
            typeCombo,
            typeComboStore;

        me.callParent();

        typeCombo = me.getStockTypeComboCmp();
        typeComboStore = typeCombo.getStore();
        if (typeComboStore.isLoading() || (typeComboStore.loadCount === 0 && !typeComboStore.getCount())) {
            typeComboStore.on('load', me.onTypeComboStoreLoad, me, {priority: 100});
        } else {
            me.selectDefaultType();
        }
    },

    /**
     * 验证运单号控件所有输入项，是否有效。
     * @return {boolean}
     */
    validate: function () {
        var me = this;
        if (me.getStockTypeComboCmp().validate() &&
            me.getStockPreTextfieldCmp().validate() &&
            me.getStockNoTextfieldCmp().validate()) {
            return true;
        }

        return false;
    },

    /**
     * 获取运单类型组件
     * @return {Object}
     */
    getStockTypeComboCmp: function () {
        var me = this;

        return me.getComponent(me.typeComboItemId);
    },

    /**
     * 获取运单前缀组件
     * @return {Object}
     */
    getStockPreTextfieldCmp: function () {
        var me = this;

        return me.getComponent(me.prefixTextfieldItemId);
    },

    /**
     * 获取运单号组件
     * @return {Object}
     */
    getStockNoTextfieldCmp: function () {
        var me = this;

        return me.getComponent(me.numberTextfieldItemId);
    },


    /**
     * 获取运单类型值
     * @return {Object}
     */
    getStockType: function () {
        var me = this;

        return me.getStockTypeComboCmp().getValue();
    },

    /**
     * 获取运单前缀值
     * @return {Object}
     */
    getStockPre: function () {
        var me = this;

        return me.getStockPreTextfieldCmp().getValue();
    },

    /**
     * 获取运单号值
     * @return {Object}
     */
    getStockNo: function () {
        var me = this;

        return me.getStockNoTextfieldCmp().getValue();
    },

    /**
     * 设置运单类型值
     * @param {Object}
     */
    setStockType: function (val) {
        var me = this;
        me.getStockTypeComboCmp().setValue(val);
    },

    /**
     * 设置运单前缀值
     * @parma {Object}
     */
    setStockPre: function (val) {
        var me = this;
        me.getStockPreTextfieldCmp().setValue(val);
    },

    /**
     * 设置运单号值
     * @param {Object}
     */
    setStockNo: function (val) {
        var me = this;
        me.getStockNoTextfieldCmp().setValue(val);
    },

    /**
     * 设置运单号
     * @return {Object} 完整运单号或者一个对象，对象格式为：{stockType: 'AWBA', stockPre: '999', stockNo: '12121200'}
     */
    setBillId: function (billId) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            store = typeCombo.getStore(),
            records = store.getData().items,
            setBillIdCallBack,
            stockTypeInput,
            stockPreInput,
            stockNoInput,
            isTypeStoreNotLoaded = false;
        if (!billId) {
            return;
        }
        if (Ext.isString(billId)) {
            Ext.Array.each(records, function (item, index) {
                var data = item.data,
                    actstockPreLen = parseInt(data.actstockPreLen, 0);
                if (billId.indexOf(data.stockTypeId) != -1) {
                    stockTypeInput = data.stockTypeId;
                    stockPreInput = billId.substr(stockTypeInput.length, actstockPreLen);
                    stockNoInput = billId.substr(stockTypeInput.length + actstockPreLen);
                    return false;
                }
            });
        } else {
            stockTypeInput = billId.stockType;
            stockPreInput = billId.stockPre;
            stockNoInput = billId.stockNo;
        }

        setBillIdCallBack = function () {
            var me = this,
                typeComboCurValue = typeCombo.getValue();
            if (typeComboCurValue == stockTypeInput) {
                me.setStockPre(stockPreInput);
                me.setStockNo(stockNoInput);
            } else {
                me.on('waybilltypechange', function () {
                    var me = this;
                    me.setStockPre(stockPreInput);
                    me.setStockNo(stockNoInput);
                }, me, {single: true, priority: -100});
                me.setStockType(stockTypeInput);
            }
        };

        isTypeStoreNotLoaded = store.isLoading() || (store.loadCount === 0 && !store.getCount());
        if (isTypeStoreNotLoaded) {
            store.on('load', setBillIdCallBack, me, {single: true, priority: -100});
            return;
        }
        setBillIdCallBack.apply(me);
    },

    /**
     * 获取完整运单号
     * @return {Object}
     */
    getBillId: function () {
        var me = this;
        if (me.getStockType() && me.getStockPre() && me.getStockNo()) {
            return me.getStockType() + me.getStockPre() + me.getStockNo();
        }

        return null;

    },

    /**
     * 设置运单类型、运单前缀、运单号是否只读
     * @param {Object}
     */
    setReadOnlyAllItems: function (readOnly) {
        var me = this,
            stockTypeCombo = me.getStockTypeComboCmp(),
            stockPreTextfield = me.getStockPreTextfieldCmp(),
            stockNoTextfield = me.getStockNoTextfieldCmp(),
            stockTypeComboEl = stockTypeCombo.inputEl,
            stockPreTextfieldEl = stockPreTextfield.inputEl,
            stockNoTextfieldEl = stockNoTextfield.inputEl;

        stockTypeCombo.setReadOnly(readOnly);
        stockPreTextfield.setReadOnly(readOnly);
        stockNoTextfield.setReadOnly(readOnly);
    },

    /**
     * 设置运单类型是否只读
     * @param {Object}
     */
    setReadOnlyWaybillTypeItem: function (readOnly) {
        var me = this,
            stockTypeCombo = me.getStockTypeComboCmp(),
            stockTypeComboEl = stockTypeCombo.inputEl;

        stockTypeCombo.setReadOnly(readOnly);
    },

    /**
     * 运单类型改变重新设置运单前缀和运单号文本框的宽度，可输入的最大值等。
     */
    onSelectChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            prefixTextfield,
            numberTextfield,
            prefixTextfieldWidth, prefixTextfieldVal,
            numberTextfieldWidth, numberTextfieldVal,
            selRecord = typeCombo.findRecordByValue(newValue),
            selRecordData = selRecord ? selRecord.getData() : null,
            typeComboVal = typeCombo.getValue(),
            prefixLen, prefixEl,
            numberLen, numberEl, stockNoFixedLen;

        if (!selRecordData) {
            return;
        }
        prefixTextfield = me.getStockPreTextfieldCmp();
        numberTextfield = me.getStockNoTextfieldCmp();

        if (!me.viewCache[typeComboVal]) {
            me.viewCache[typeComboVal] = {};
        }
        // 设置运单前缀
        if (!me.viewCache[typeComboVal][me.prefixTextfieldItemId]) {
            me.viewCache[typeComboVal][me.prefixTextfieldItemId] = {};
        }
        // 设置输入长度
        prefixLen = Ext.Number.parseInt(selRecordData.actstockPreLen);
        prefixTextfield.maxLength = prefixTextfield.minLength = prefixLen;
        prefixEl = prefixTextfield.inputEl;
        if (!prefixEl) {
            return;
        }
        prefixEl.dom.maxLength = prefixLen;
        // 设置显示宽度
        prefixTextfieldWidth = me.viewCache[typeComboVal][me.prefixTextfieldItemId].width;
        if (prefixTextfieldWidth) {
            prefixTextfield.setWidth(prefixTextfieldWidth);
        } else {
            if (me.prefixTextfieldWidth) {
                prefixTextfieldWidth = me.prefixTextfieldWidth;
            } else {
                var prefixFontSize, prefixPaddingLeft, prefixPaddingRight;
                prefixFontSize = Ext.Number.parseFloat(prefixEl.getStyle('font-size').replace('px', ''));
                prefixPaddingLeft = Ext.Number.parseFloat(prefixEl.getStyle('padding-left').replace('px', ''));
                prefixPaddingRight = Ext.Number.parseFloat(prefixEl.getStyle('padding-right').replace('px', ''));
                prefixTextfieldWidth = prefixFontSize * prefixLen + prefixPaddingLeft + prefixPaddingRight;
                prefixTextfieldWidth = prefixTextfieldWidth > me.maxPrefixTextfieldWidth ? me.maxPrefixTextfieldWidth : prefixTextfieldWidth;
            }
            prefixTextfield.setWidth(prefixTextfieldWidth);
            me.viewCache[typeComboVal][me.prefixTextfieldItemId].width = prefixTextfieldWidth;
        }
        // 设置值
        prefixTextfieldVal = me.viewCache[typeComboVal][me.prefixTextfieldItemId].val;
        if (prefixTextfieldVal) {
            prefixTextfield.setValue(prefixTextfieldVal);
        } else {
            var stockctlPre = selRecordData.stockctlPre;
            stockctlPre = stockctlPre && stockctlPre.replace(/\*/g, '');
            prefixTextfield.setValue(stockctlPre);
            me.viewCache[typeComboVal][me.prefixTextfieldItemId].val = stockctlPre;
        }

        // 设置运单号
        if (!me.viewCache[typeComboVal][me.numberTextfieldItemId]) {
            me.viewCache[typeComboVal][me.numberTextfieldItemId] = {};
        }
        // 设置输入长度
        numberLen = Ext.Number.parseInt(selRecordData.actstockNoLen);
        stockNoFixedLen = selRecordData.stockNoFixedLenth;
        numberTextfield.maxLength = numberLen;
        if (stockNoFixedLen == 'Y') {
            numberTextfield.minLength = numberLen;
        } else {
            numberTextfield.minLength = 0;
        }
        numberEl = numberTextfield.inputEl;
        if (!numberEl) {
            return;
        }
        numberEl.dom.maxLength = numberLen;
        // 设置显示宽度
        numberTextfieldWidth = me.viewCache[typeComboVal][me.numberTextfieldItemId].width;
        if (numberTextfieldWidth) {
            numberTextfield.setWidth(numberTextfieldWidth);
        } else {
            if (me.numberTextfieldWidth) {
                numberTextfieldWidth = me.numberTextfieldWidth;
            } else {
                var numberFontSize, numberPaddingLeft, numberPaddingRight;
                numberFontSize = Ext.Number.parseFloat(numberTextfield.inputEl.getStyle('font-size').replace('px', ''));
                numberPaddingLeft = Ext.Number.parseFloat(numberEl.getStyle('padding-left').replace('px', ''));
                numberPaddingRight = Ext.Number.parseFloat(numberEl.getStyle('padding-right').replace('px', ''));
                numberTextfieldWidth = (numberFontSize - 5) * numberLen + numberPaddingLeft + numberPaddingRight;
                numberTextfieldWidth = numberTextfieldWidth > me.maxNumberTextfieldWidth ? me.maxNumberTextfieldWidth : numberTextfieldWidth;
            }
            numberTextfield.setWidth(numberTextfieldWidth);
            me.viewCache[typeComboVal][me.numberTextfieldItemId].width = numberTextfieldWidth;
        }
        // 设置值
        var actstockPre = selRecordData.actstockPre;
        numberTextfield.setValue(actstockPre);
        me.viewCache[typeComboVal][me.numberTextfieldItemId].val = actstockPre;

        // 设置根据承运人查询到的运单前缀
        if (me.carrierId) {
            var store = me.store;
            if (store.isLoading() || (store.loadCount === 0 && !store.getCount())) {
                // If it is NOT a preloaded store, then unless a Session is being used,
                // The newly loaded records will NOT match any in the ownerStore.
                // So we must match them by ID in order to select the same dataset.
                store.on('load', me.onStoreLoad.bind(me), null, {single: true});
                me.carrierId = null;
            } else {
                me.setPrefixTextfieldValue();
                me.carrierId = null;
            }
        }

        // 触发自定义事件
        me.fireEvent('waybilltypechange', combo, newValue, oldValue, eOpts);
    },


    /**
     * 运单前缀改变事件处理
     */
    onPrefixTextfieldChange: function (textfield, newValue, oldValue, eOpts) {
        var me = this;
        me.onTextfieldChange(textfield, newValue, oldValue, eOpts);
        // 触发自定义事件
        me.fireEvent('waybillnumberprefixchange', textfield, newValue, oldValue, eOpts);
    },

    /**
     * 运单前缀keyup事件处理
     */
    onPrefixTextfieldKeyUp: function (textfield, e, eOpts) {
        var me = this,
            val,
            len,
            prefixTextfield = me.getStockPreTextfieldCmp(),
            numberTextfield;
        val = textfield.getValue();
        len = val ? val.length : 0;
        if (len == prefixTextfield.maxLength) {
            numberTextfield = me.getStockNoTextfieldCmp();
            numberTextfield.focus();
        }
    },

    /**
     * 运单号改变事件处理
     */
    onNumberTextfieldChange: function (textfield, newValue, oldValue, eOpts) {
        var me = this;
        me.onTextfieldChange(textfield, newValue, oldValue, eOpts);
        // 触发自定义事件
        me.fireEvent('waybillnumbechange', textfield, newValue, oldValue, eOpts);
    },

    /**
     * 运单号失去焦点事件处理
     */
    onNumberTextfieldBlur: function (textfield, event, eOpts) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            selRec = typeCombo.getSelection(),
            selRecData,
            numberTextfield,
            numberTextfieldVal,
            actstockNoLen,
            padLen;
        if (!selRec) {
            return;
        }

        numberTextfield = me.getStockNoTextfieldCmp();
        numberTextfieldVal = numberTextfield.getValue();

        selRecData = selRec.getData();
        actstockNoLen = Ext.Number.parseInt(selRecData.actstockNoLen);
        actstockNoLen = actstockNoLen === null ? 0 : actstockNoLen;
        padLen = actstockNoLen - numberTextfieldVal.length;

        if (selRecData.fillZero === 'Y' && padLen > 0) {
            var padZero = '0';
            while (padZero.length < padLen) {
                padZero = padZero + '0';
            }
            numberTextfieldVal = numberTextfieldVal + padZero;
            numberTextfield.setValue(numberTextfieldVal);
        }
    },

    /**
     * 运单类型改变重新设置运单前缀和运单号文本框的宽度，可输入的最大值等。
     */
    onTextfieldChange: function (textfield, newValue, oldValue, eOpts) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            typeComboVal = typeCombo.getValue();
        if (!me.viewCache[typeComboVal]) {
            me.viewCache[typeComboVal] = {};
        }
        if (!me.viewCache[typeComboVal][textfield.reference]) {
            me.viewCache[typeComboVal][textfield.reference] = {};
        }
        me.viewCache[typeComboVal][textfield.reference].val = newValue;
    },

    /*
     * 检查运单号前缀
     */
    waybillNumberPreCheck: function (val) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            selRec = typeCombo.getSelection(),
            selRecData,
            numberTextfieldPre,
            stockctlPre,
            errMsg = [];
        if (!selRec) {
            return true;
        }

        numberTextfieldPre = me.getStockPreTextfieldCmp();
        if (!numberTextfieldPre.getValue()) {
            return true;
        }

        selRecData = selRec.getData();
        stockctlPre = selRecData.stockctlPre && selRecData.stockctlPre.replace(/\*/g, '');
        if (!new RegExp('^' + stockctlPre).test(numberTextfieldPre.getValue())) {
            errMsg.push('运单号前缀应以' + stockctlPre + '开始');
        }

        return errMsg.length > 0 ? errMsg.join('，') : true;
    },

    /*
     * 检查运单号
     */
    waybillNumberCheck: function (val) {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            selRec = typeCombo.getSelection(),
            selRecData,
            numberTextfield,
            errMsg = [];
        if (!selRec) {
            return true;
        }
        numberTextfield = me.getStockNoTextfieldCmp();

        selRecData = selRec.getData();
        // 单号校验方法（A=模7；N=无校验）
        if (selRecData.checkWay === 'A') {
            if (!me.checkM7(numberTextfield.getValue())) {
                errMsg.push('不符合模七校验规则');
            }
        }
        // 单号校验公式（正则表达式，预留用于扩展）
        if (selRecData.checkConfig) {
            if (!new RegExp(selRecData.checkConfig).test(val)) {
                errMsg.push('不符合：' + selRecData.checkConfig + '的校验规则');
            }
        }

        return errMsg.length > 0 ? errMsg.join('，') : true;
    },

    /*
     * 运单号模七校验，返回结果 true：成功，false：失败。
     */
    checkM7: function (val) {
        var me = this,
            pre,
            checkNo;
        if (!val) {
            return true;
        }
        if (!me.numReg.test(val)) {
            return false;
        }
        pre = val.substring(0, val.length - 1);
        checkNo = val.substr(-1, 1);
        pre = pre % 7;

        return pre == checkNo;
    },

    /*
     * 运单号配置数据加载完后的处理
     */
    onTypeComboStoreLoad: function (store, records, operation, success) {
        var me = this;
        if (success) {
            me.selectDefaultType();
        } else {
            Ext.Msg.alert('提示', '单证类型获取失败。');
        }
    },

    /*
     * 设置默认选择项目
     */
    selectDefaultType: function () {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            store = typeCombo.getStore(),
            records = store.getData().items;
        if (me.selectAfterLoad && records && records.length > 0) {
            var index = store.find('stockTypeId', me.selectAfterLoad, false, false, true, true);
            if (index > -1) {
                typeCombo.select(store.getAt(index));
            }
        }
    },

    /**
     * store 加载完成
     * 如果是主单设置运单前缀
     */
    onStoreLoad: function (store, records, successful, operation, eOpts) {
        var me = this;
        if (successful) {
            me.setPrefixTextfieldValue();
        }
    },

    /**
     * 如果是主单设置运单前缀
     */
    setPrefixTextfieldValue: function () {
        var me = this,
            typeCombo = me.getStockTypeComboCmp(),
            typeComboValue = typeCombo.getValue(),
            store = me.store,
            firstRecord,
            prefixTextfield = me.getStockPreTextfieldCmp(),
            stockPre;

        if (typeComboValue === 'AWBA' && !prefixTextfield.readOnly) {
            firstRecord = store.getAt(0);
            stockPre = firstRecord && firstRecord.data && firstRecord.data.stockpre;
            prefixTextfield.setValue(stockPre);
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

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            typeComboCfg,
            prefixTextfieldCfg,
            numberTextfieldCfg,
            items,
            domInt = me.domInt;
        me.typeComboCfg = typeComboCfg = Ext.merge({
            xtype: 'combo',
            name: 'stockTypeId',
            itemId: 'waybillnumber-stockTypeId',
            fieldLabel: '运单类型',
            queryMode: 'local',
            queryCode: 'STOCK_TYPE',
            maxWidth: 96,
            minWidth: 78,
            triggerAction: 'all',
            displayField: 'dsc',
            valueField: 'stockTypeId',
            allowBlank: false,
            forceSelection: true,
            editable: false,
            store: WidgetConfig.getStoreConfigMap().stocktype,
            storeFilters: [
                function (item) {
                    var itemData = item.data;
                    return itemData.domInt == domInt || itemData.domInt == 'DI';
                }
            ],
            listeners: {}
        }, me.typeComboCfg);

        // 添加查询参数：国内国际
        typeComboCfg.store.proxy.extraParams.paramMap = {domInt: me.domInt};

        me.prefixTextfieldCfg = prefixTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'stockPre',
            itemId: 'waybillnumber-stockPre',
            fieldLabel: '运单号前缀',
            width: me.maxPrefixTextfieldWidth,
            allowBlank: false,
            allowOnlyWhitespace: false,
            enableKeyEvents: true,
            listeners: {},
            validator: me.waybillNumberPreCheck.bind(me)
        }, me.prefixTextfieldCfg);

        me.numberTextfieldCfg = numberTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'stockNo',
            itemId: 'waybillnumber-stockNo',
            width: me.maxNumberTextfieldWidth,
            fieldLabel: '运单号',
            allowBlank: false,
            allowOnlyWhitespace: false,
            listeners: {},
            validator: me.waybillNumberCheck.bind(me)

        }, me.numberTextfieldCfg);

        // 只读设置
        if (me.readOnlyAll || me.readOnlyWaybillType) {
            typeComboCfg.readOnly = true;

        }
        if (me.readOnlyAll) {
            prefixTextfieldCfg.readOnly = true;
            numberTextfieldCfg.readOnly = true;
        }

        if (me.prefixTextfieldWidth) {
            prefixTextfieldCfg.width = me.prefixTextfieldWidth;
        }
        if (me.numberTextfieldWidth) {
            numberTextfieldCfg.width = me.numberTextfieldWidth;
        }

        items = [
            typeComboCfg,
            prefixTextfieldCfg,
            numberTextfieldCfg
        ];

        return items;
    }
});