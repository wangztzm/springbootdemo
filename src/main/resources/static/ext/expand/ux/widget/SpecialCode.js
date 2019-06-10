/**
 *
 * 特货代码
 */
Ext.define('Ming.expand.ux.widget.SpecialCode', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'specialcode',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'specialcode',

    /**
     * @cfg width
     * @inheritdoc
     */
    // width: 600,

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    /**
     * @cfg layout
     * @inheritdoc
     */
    layout: {
        type: 'hbox'
    },

    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '特货代码',

    /**
     * @cfg hideLabel
     * @inheritdoc
     */
    hideLabel: false,

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
        hideLabel: true
    },

    config: {
        /**
         * @cfg {Object} owner
         * 保存父视图的引用
         */
        ownerView: null,

        /**
         * @cfg {Object} textFieldSelCfg
         * 特货代码代码下拉列表配置
         */
        textFieldSelCfg: {},

        /**
         * @cfg {Object} extTextFieldSelCfg
         * 特货代码扩展下拉列表配置
         */
        extTextFieldSelCfg: {}
    },

    initComponent: function () {
        var me = this;

        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.textFieldSelItemId = me.textFieldSelCfg.itemId;
        me.extTextFieldSelItemId = me.extTextFieldSelCfg.itemId;
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            extTextFieldSel,
            extTextFieldSelPos;

        me.callParent([width, height, oldWidth, oldHeight]);

        extTextFieldSel = me.getSpecopeIdExtTextfieldCmp();
        extTextFieldSelPos = extTextFieldSel.getPosition(true);
        extTextFieldSel.setPosition(extTextFieldSelPos[0] - 0.8, extTextFieldSelPos[1]);
    },

    /**
     * 获取特货代码组件
     * @return {Object}
     */
    getSpecopeIdTextfieldCmp: function () {
        var me = this,
            textFieldSel;
        textFieldSel = me.getComponent(me.textFieldSelItemId);

        return textFieldSel.getInputTextfieldCmp();
    },

    /**
     * 获取特货代码扩展组件
     * @return {Object}
     */
    getSpecopeIdExtTextfieldCmp: function () {
        var me = this,
            extTextFieldSel;
        extTextFieldSel = me.getComponent(me.extTextFieldSelItemId);

        return extTextFieldSel.getInputTextfieldCmp();
    },

    /**
     * 获取特货代码值
     * @return {Object}
     */
    getSpecopeId: function () {
        var me = this;

        return me.getSpecopeIdTextfieldCmp().getValue();
    },

    /**
     * 获取特货代码扩展值
     * @return {Object}
     */
    getSpecopeIdExt: function () {
        var me = this;

        return me.getSpecopeIdExtTextfieldCmp().getValue();
    },

    /**
     * 设置特货代码值
     * @parma {Object}
     */
    setSpecopeId: function (specopeId) {
        var me = this;
        me.getSpecopeIdTextfieldCmp().setValue(specopeId);
    },

    /**
     * 获取特货代码扩展值
     * @param {Object}
     */
    setSpecopeIdExt: function (specopeIdExt) {
        var me = this;
        me.getSpecopeIdExtTextfieldCmp().setValue(specopeIdExt);
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            textFieldSelCfg,
            extTextFieldSelCfg;

        me.textFieldSelCfg = textFieldSelCfg = Ext.merge({
            xtype: 'specialcode-textfield-selector',
            itemId: 'specialcode-textFieldSel',
            inputTextfieldCfg: {
                name: 'specopeId',
                fieldLabel: '特货代码',
                itemId: 'selector-specopeId',
                hideLabel: true,
                enforceMaxLength: true,
                maxLength: 3,
                width: 58,
                allowBlank: true
            },
            searchCfg: {
                searchGridCfg: {
                    selModel: {
                        type: 'rowmodel', // rowmodel is the default selection model
                        mode: 'SINGLE' // Allows selection of multiple rows
                    }
                }
            }
        }, me.textFieldSelCfg);

        me.extTextFieldSelCfg = extTextFieldSelCfg = Ext.merge({
            xtype: 'specialcode-textfield-selector',
            itemId: 'specialcode-extTextFieldSel',
            inputTextfieldCfg: {
                name: 'specopeidext',
                fieldLabel: '特货代码扩展',
                itemId: 'selector-specopeidext',
                hideLabel: true,
                allowBlank: true
            },
            searchCfg: {
                searchGridCfg: {
                    selModel: {
                        type: 'checkboxmodel', // rowmodel is the default selection model
                        mode: 'SIMPLE' // Allows selection of multiple rows
                    }
                }
            }
        }, me.extTextFieldSelCfg);

        items = [
            textFieldSelCfg,
            extTextFieldSelCfg
        ];

        return items;
    }
});