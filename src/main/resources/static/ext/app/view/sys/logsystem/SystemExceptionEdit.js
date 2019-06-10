Ext.define('Ming.view.sys.logsystem.SystemExceptionEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'systemExceptionEdit',
    reference:'SystemEdit',
    items: [{
        xtype: 'form',
        reference: 'systemformo',
        items: [{
            xtype: 'fieldset',
            title: '基本信息',
            reference: 'systemform',
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
                    xtype: 'textareafield',
                    fieldLabel: '参数',
                    name: 'params',
                    height: 130,
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
                    fieldLabel: '操作方法',
                    name: 'method',
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: '错误信息',
                    name: 'exceptiondetail',
                    height:130,
                },
                {
                    fieldLabel: '异常代码',
                    name: 'exceptioncode',
                }
            ]
        }],
    }],
    buttons: [{
        text: '关闭',
        handler:'onFormCancel'
    }]
});