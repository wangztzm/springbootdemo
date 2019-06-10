Ext.define('Ming.view.sys.logsystem.SystemOperateEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'systemOperateEdit',
    reference: 'SystemEdit',
    items: [{
        xtype: 'form',
        reference: 'systemformo',
        items: [{
            xtype: 'fieldset',
            title: '基本信息',
            defaults: {
                xtype: "textfield",
                anchor: '100%'
            },
            items: [{
                    fieldLabel: '操作信息',
                    name: 'title',
                },
                {
                    fieldLabel: '操作人',
                    name: 'creator',
                },
                {
                    fieldLabel: '浏览器',
                    name: 'useragent',
                },
                {
                    fieldLabel: '请求ip',
                    name: 'ip',
                },
                {
                    fieldLabel: '操作时间',
                    name: 'createtime',
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: '操作详情',
                    name: 'method',
                }
            ]
        }],
    }],
    buttons: [{
        text: '关闭',
        handler: 'onFormCancel'
    }]
});