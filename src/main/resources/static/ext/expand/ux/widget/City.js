/**
 * 城市
 */
Ext.define('Ming.expand.ux.widget.City', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'city',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '城市',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'cityId',

    /**
     * @cfg queryCode
     */
    queryCode: 'CITY',

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
    store: WidgetConfig.getStoreConfigMap().city,

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'cityId',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'cityId',

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
    tpl: WidgetConfig.getComboXTemplateArgsMap().city,

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