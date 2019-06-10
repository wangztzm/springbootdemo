/**
 * 经办人
 */
Ext.define('Ming.expand.ux.widget.IntroduceMan', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'introduceman',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '经办人',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'introduceMan',

    /**
     * @cfg queryCode
     */
    queryCode: 'INTRODUCE_MAN',

    /**
     * @cfg queryMode
     */
    queryMode: 'remote',

    /**
     * @cfg blurValidate4Remote
     */
    blurValidate4Remote: false,

    /**
     * @cfg store
     * @inheritdoc
     */
    store: WidgetConfig.getStoreConfigMap().introduceMan,

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'pickName',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'pickName',

    /**
     * @cfg blurUppercase
     */
    blurUppercase: false,

    /**
     * @cfg forceSelection
     * @inheritdoc
     */
    forceSelection: false,

    /**
     * @cfg tpl
     * @inheritdoc
     */
    tpl: WidgetConfig.getComboXTemplateArgsMap().introduceMan,

    /**
     * @cfg allowBlank
     * @inheritdoc
     */
    allowBlank: true,

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
    hideLabel: false,

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