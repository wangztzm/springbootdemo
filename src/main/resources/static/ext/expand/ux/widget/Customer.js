/**
 * 代理人
 */
Ext.define('Ming.expand.ux.widget.Customer', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'customer',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '代理人',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'customerId',

    /**
     * @cfg queryCode
     */
    queryCode: 'CUSTOMER',

    /**
     * @cfg queryMode
     */
    queryMode: 'remote',

    /**
     * @cfg blurValidate4Remote
     */
    blurValidate4Remote: true,

    /**
     * @cfg store
     * @inheritdoc
     */
    store: WidgetConfig.getStoreConfigMap().customer,

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'customerId',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'customerId',

    /**
     * @cfg forceSelection
     * @inheritdoc
     */
    forceSelection: false,

    /**
     * @cfg blurUppercase
     */
    blurUppercase: true,

    /**
     * @cfg tpl
     * @inheritdoc
     */
    tpl: WidgetConfig.getComboXTemplateArgsMap().customer,

    /**
     * @cfg allowBlank
     * @inheritdoc
     */
    allowBlank: false,

    /**
     * @cfg matchFieldWidth
     * @inheritdoc
     */
    matchFieldWidth: false,

    /**
     * @cfg hideTrigger
     * @inheritdoc
     */
    hideTrigger: true,

    /**
     * @cfg emptyText
     * @inheritdoc
     */
    emptyText: '',

    /**
     * @cfg triggerAction
     * @inheritdoc
     */
    triggerAction: 'query',

    /**
     * @cfg hideLabel
     * @inheritdoc
     */
    hideLabel: true,

    /**
     * @cfg labelAlign
     * @inheritdoc
     */
    labelAlign: 'right',

    /**
     * @cfg labelSeparator
     * @inheritdoc
     */
    labelSeparator: '',

    /**
     * 控件赋值，适用于必须要查出下拉列表数据的情况。
     * 首先根据传入的控件值调用后台查询，然后选择控件值对应的条目。
     */
    setData: function (value) {
        var me = this,
            store = me.getStore();
        if (!value) {
            me.clearValue();
            return;
        }
        store.load(
            {
                params: {
                    query: value
                },
                callback: function (records, operation, success) {
                    var customer = Ext.Array.findBy(records, function (record) {
                        return value == record.data[me.valueField];
                    });
                    if (customer) {
                        me.select(customer);
                    } else {
                        me.clearValue();
                    }
                }
            }
        );
    }
});