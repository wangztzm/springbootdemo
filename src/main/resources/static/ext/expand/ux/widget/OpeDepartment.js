/**
 * 营业点组件
 */
Ext.define('Ming.expand.ux.widget.OpeDepartment', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'opedepartment',

    /**
     * @cfg reference
     * @inheritdoc
     */
    fieldLabel: '营业点',

    /**
     * @cfg reference
     * @inheritdoc
     */
    name: 'opedepartmentId',

    /**
     * @cfg queryCode
     */
    queryCode: 'OPE_DEPARTMENT',

    /**
     * @cfg reference
     * @inheritdoc
     */
    queryMode: 'local',

    /**
     * @cfg reference
     * @inheritdoc
     */
    displayField: 'opeDepName',

    /**
     * @cfg reference
     * @inheritdoc
     */
    valueField: 'opeDepartId',

    /**
     * @cfg reference
     * @inheritdoc
     */
    forceSelection: true,

    /**
     * @cfg reference
     * @inheritdoc
     */
    editable: false,

    /**
     * @cfg reference
     * @inheritdoc
     */
    tpl: Ext.create('Ext.XTemplate',
        WidgetConfig.getComboXTemplateArgsMap().opeDepartment
    ),

    /**
     * @cfg reference
     * @inheritdoc
     */
    matchFieldWidth: false
});