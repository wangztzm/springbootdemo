/**
 * 包装信息 多选
 */
Ext.define('Ming.expand.ux.widget.PackInfoTag', {
    extend: 'Ext.form.field.Tag',
    xtype: 'packinfotag',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'packinfotag',

    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '包装',

    /**
     * @cfg queryMode
     * @inheritdoc
     */
    queryMode: 'local',

    /**
     * @cfg valueField
     * @inheritdoc
     */
    valueField: 'dsc',

    /**
     * @cfg displayField
     * @inheritdoc
     */
    displayField: 'dsc',

    /**
     * @cfg createNewOnEnter
     * @inheritdoc
     */
    createNewOnEnter: true,

    /**
     * @cfg filterPickList
     * @inheritdoc
     */
    filterPickList: true,

    /**
     * @cfg PACKINFO
     * 基础数据查询代码
     */
    queryCode: 'PACKINFO',

    /**
     * 获取包装信息组件
     * @return {Object}
     */
    getPackInfoTagCmp: function () {
        var me = this;

        return me;
    },

    /**
     * 获取包装信息值
     * @return {Object}
     */
    getPackInfo: function () {
        var me = this;

        return me.getRawValue();
    },

    /**
     * 设置包装信息值
     * @parma {Object}
     */
    setPackInfo: function (packInfo) {
        var me = this;
        me.setValue(packInfo);
    }
});
