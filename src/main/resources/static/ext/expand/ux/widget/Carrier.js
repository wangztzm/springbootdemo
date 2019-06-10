/**
 * 承运人
 */
Ext.define('Ming.expand.ux.widget.Carrier', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'carrier',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '承运人',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'airlineId',

    /**
     * @cfg queryCode
     */
    queryCode: 'CARRIER',

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
    store: WidgetConfig.getStoreConfigMap().carrier,

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'carrierId',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'carrierId',

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
    tpl: WidgetConfig.getComboXTemplateArgsMap().carrier,

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