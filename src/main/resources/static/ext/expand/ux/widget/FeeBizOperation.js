/**
 * 计费点
 */
Ext.define('Ming.expand.ux.widget.FeeBizOperation', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'feebizoperation',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '计费点',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'bizOpe',

    /**
     * @cfg queryCode
     */
    queryCode: 'FEE_BIZOPRATION',

    /**
     * @cfg queryMode
     */
    queryMode: 'local',

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'bizCode',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'des',

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
    hideTrigger: false,

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