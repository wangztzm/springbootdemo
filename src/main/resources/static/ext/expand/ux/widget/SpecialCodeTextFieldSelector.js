/**
 *
 * 特货代码
 */
Ext.define('Ming.expand.ux.widget.SpecialCodeTextFieldSelector', {
    extend: 'Ming.expand.ux.widget.TextFieldSelector',
    xtype: 'specialcode-textfield-selector',

    /**
     * @cfg {Object} valueField
     * @inheritdoc
     */
    valueField: 'specopeId',

    /**
     * @cfg {Object} queryCode
     */
    queryCode: 'SPEC_OPE_CLS',

    /**
     * @cfg {Object} queryParamMap
     */
    queryParamMap: null,

    /**
     * @cfg {Object} inputTextfieldCfg
     * @inheritdoc
     */
    inputTextfieldCfg: {
        name: 'specopeId',
        fieldLabel: '特货代码',
        spliter: '/',
        hideLabel: true,
        isToUpperCase: true
    },

    /**
     * @cfg {Object} searchCfg
     * @inheritdoc
     */
    searchCfg: {
        width: 450,
        searchGridCfg: {
            scrollable: true,
            store: WidgetConfig.getStoreConfigMap().specialCode,
            columns: [
                {
                    xtype: 'rownumberer'
                }, {
                    text: '特货处理代码',
                    dataIndex: 'specopeId',
                    flex: 1
                }, {
                    text: '中文描述',
                    dataIndex: 'dsc',
                    flex: 1
                }, {
                    text: '英文描述',
                    dataIndex: 'edsc',
                    flex: 1
                }, {
                    text: '只能装机',
                    sortable: true,
                    dataIndex: 'cargoCraftOnly',
                    flex: 1
                }
            ]
        },
        filterFields: [
            'specopeId', 'dsc', 'cargoCraftOnly'
        ]
    },

    initComponent: function () {
        var me = this;
        me.callParent();
    }
});