/**
 * 同营业点的用户
 */
Ext.define('Ming.expand.ux.widget.OpeDeptUsers', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'opedeptusers',
    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '用户',

    /**
     * @cfg name
     * @inheritdoc
     */
    name: 'opeDeptUser',

    /**
     * @cfg queryCode
     */
    queryCode: 'OPE_DEPARTMENT_USERS',

    /**
     * @cfg queryMode
     */
    queryMode: 'local',

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'userid',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'userid',

    /**
     * @cfg tpl
     * @inheritdoc
     */
    tpl: WidgetConfig.getComboXTemplateArgsMap().opeDeptUsers,

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
    labelSeparator: '',

    initComponent: function () {
        var me = this;
        me.queryParamMap = {opeDepartId: cfg.sub.opedepartid};
        me.value = cfg.sub.userid
        me.callParent();
    }
});