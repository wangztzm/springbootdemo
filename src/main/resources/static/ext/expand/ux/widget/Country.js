/**
 * 国家
 */
Ext.define('Ming.expand.ux.widget.Country', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'country',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '国家',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'countryId',

    /**
     * @cfg queryCode
     */
    queryCode: 'COUNTRY',

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
    store: WidgetConfig.getStoreConfigMap().country,

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'countryId',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'countryId',

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
    tpl: WidgetConfig.getComboXTemplateArgsMap().country,

    /**
     * @cfg enforceMaxLength
     * @inheritdoc
     */
    enforceMaxLength: true,

    /**
     * @cfg maxLength
     * @inheritdoc
     */
    maxLength: 2,

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
     * @cfg width
     * @inheritdoc
     */
    width: 58,

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
    labelSeparator: ''
});