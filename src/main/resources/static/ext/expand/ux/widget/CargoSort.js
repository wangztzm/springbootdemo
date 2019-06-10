/**
 * 品名组件
 */
Ext.define('Ming.expand.ux.widget.CargoSort', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'cargosort',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'cargosort',

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '品名',

    /**
     * @cfg layout
     * @inheritdoc
     */
    layout: {
        type: 'hbox'
    },

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
     * @cfg defaults
     * @inheritdoc
     */
    defaults: {
        hideLabel: true,
        allowBlank: false
    },

    /**
     * @cfg defaultType
     * @inheritdoc
     */
    defaultType: 'textfield',

    config: {
        /**
         * @cfg {Object} owner
         * 保存父视图的引用
         */
        ownerView: null,

        /**
         * @cfg {Object} codeComboCfg
         * 品名代码
         */
        codeComboCfg: {},

        /**
         * @cfg {Object} nameTextfieldCfg
         * 品名文本框配置
         */
        nameTextfieldCfg: {},

        /**
         * @cfg {Object} expImp
         * 进港出港
         */
        expImp: null,

        /**
         * @cfg {Object} domInt
         * 国内国际
         */
        domInt: null
    },

    initComponent: function () {
        var me = this;
        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.codeComboItemId = me.codeComboCfg.itemId;
        me.nameTextfieldItemId = me.nameTextfieldCfg.itemId;
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            nameTextfield,
            nameTextfieldPos;

        me.callParent([width, height, oldWidth, oldHeight]);

        nameTextfield = me.getCargoNmCmp();
        nameTextfieldPos = nameTextfield.getPosition(true);
        nameTextfield.setPosition(nameTextfieldPos[0] - 0.8, nameTextfieldPos[1]);
    },

    /**
     * 返回品名组件
     * @return {Object}
     */
    getCargoNoCmp: function () {
        var me = this;

        return me.getComponent(me.codeComboItemId);
    },

    /**
     * 返回品名名称组件
     * @return {Object}
     */
    getCargoNmCmp: function () {
        var me = this;

        return me.getComponent(me.nameTextfieldItemId);
    },

    /*
     * 当货物类别下拉选择时的处理
     */
    onCargoSortSelect: function (combo, record, eOpts) {
        var me = this,
            nameTextfield, comboValue, cargoSort;
        comboValue = combo.getValue();
        if (!comboValue) {
            return false;
        }
        if (me.domInt === 'I') {
            cargoSort = record.getData().esortNm;
        } else {
            cargoSort = record.getData().sortNm;
        }
        nameTextfield = me.getCargoNmCmp();
        nameTextfield.setValue(cargoSort);
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            codeComboCfg,
            nameTextfieldCfg;

        me.codeComboCfg = codeComboCfg = Ext.merge({
            xtype: 'combo',
            name: 'cargoNo',
            itemId: 'cargosort-cargoNo',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: true,
            displayField: 'cargoSort',
            valueField: 'cargoSort',
            matchFieldWidth: false,
            anyMatch: true,
            caseSensitive: false,
            width: 78,
            dock: 'top',
            autoSelect: true,
            store: WidgetConfig.getStoreConfigMap().cargoSort,
            listeners: {
                select: me.onCargoSortSelect.bind(me)
            },
            queryCode: 'CARGO_SORT'
        }, me.codeComboCfg);

        codeComboCfg.storeFilters = [
            function (item) {
                var expFlag, impFlag, domFlag, intFlag, data = item.data;
                if (me.expImp == 'E') {
                    expFlag = data.expFlag == 'Y';
                }

                if (me.expImp == 'I') {
                    impFlag = data.impFlag == 'Y';
                }

                if (me.domInt == 'D') {
                    domFlag = data.domFlag == 'Y';
                }

                if (me.domInt == 'I') {
                    intFlag = data.intFlag == 'Y';
                }
                return (expFlag || impFlag) && (domFlag || intFlag);
            }
        ];


        me.nameTextfieldCfg = nameTextfieldCfg = Ext.merge({
            xytpe: 'textfield',
            name: 'cargoNm',
            itemId: 'cargosort-cargoNm',
            fieldLabel: '名称',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                afterrender: function (cmp) {
                    cmp.inputEl.set({
                        autocomplete: 'on'
                    });
                }
            }
        }, me.nameTextfieldCfg);


        items = [codeComboCfg,
            nameTextfieldCfg];

        return items;
    }
});
