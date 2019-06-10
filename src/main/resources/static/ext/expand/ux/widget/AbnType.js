/**
 * 不正常
 */
Ext.define('Ming.expand.ux.widget.AbnType', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'abntype',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '不正常',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'abnType',

    /**
     * @cfg queryCode
     */
    queryCode: 'ABN_TYPE',

    /**
     * @cfg queryMode
     */
    queryMode: 'local',

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'abnType',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'abnType',

    /**
     * @cfg tpl
     * @inheritdoc
     */
    tpl: WidgetConfig.getComboXTemplateArgsMap().abnType,

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