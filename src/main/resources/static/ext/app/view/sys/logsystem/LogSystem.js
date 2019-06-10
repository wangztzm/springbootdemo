Ext.define('Ming.view.sys.logsystem.LogSystem', {
    extend: 'Ext.tab.Panel',
    xtype: 'sys.logsystem.logsystem',
    requires: [
        'Ming.view.sys.logsystem.LogSystemController',
        'Ming.view.sys.logsystem.LogSystemModel',
    ],
    controller: 'sys.logsystem.logsystem',
    viewModel: {
        type: 'sys.logsystem.logsystemmodel'
    },
    listeners:{
        afterrender: 'loading',
        'tabchange':'normal'
    },
    items: [{
        title: '系统操作',
        xtype: 'sys-logsystem-Systemhandel',
        iconCls: "x-fa fa-gear",
        number:'1'

    }, {
        title: '系统异常',
        iconCls: "x-fa fa-times-circle-o",
        xtype: 'sys-logsystem-Systemerror',
        number:'2'
    }],
});