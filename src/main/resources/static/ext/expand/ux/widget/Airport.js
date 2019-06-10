/**
 * 机场
 */
Ext.define('Ming.expand.ux.widget.Airport', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'airport',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '机场',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'airportId',

    /**
     * @cfg queryCode
     */
    queryCode: 'AIRPORT',

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
    store: WidgetConfig.getStoreConfigMap().airport,

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'airportId',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'airportId',

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
    tpl: WidgetConfig.getComboXTemplateArgsMap().airport,

    /**
     * @cfg enforceMaxLength
     * @inheritdoc
     */
    enforceMaxLength: true,

    /**
     * @cfg maxLength
     * @inheritdoc
     */
    maxLength: 5,

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
    labelSeparator: ''
});