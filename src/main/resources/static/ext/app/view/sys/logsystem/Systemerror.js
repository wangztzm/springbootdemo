Ext.define('Ming.view.sys.logsystem.Systemerror', {
    extend: 'Ext.panel.Panel',
    xtype: 'sys-logsystem-Systemerror',
    layout: 'fit',
    items:[{
		xtype: 'basedata-grid',
        paging: true,
        bind: {
            store: '{Operatedata}'
          },
		reference: 'systemException',
		listeners: {
			rowdblclick: 'onModuledblClick'
		},
		tbar: [{	
			xtype: 'textfield',
			fieldLabel: '操作信息/操作人',
			width: 250,
			reference: 'title'
		},
			{
				text: '查询',
				iconCls: 'x-fa fa-search',
				handler: 'querylogerro'
			},
			"->",
			{
				cls: 'delete-focus-bg',
				iconCls: 'x-fa fa-refresh',
				handler: 'onRefresh',
				tooltip: '刷新数据'
			}
		],
		columns: [{
				text: '序  号',
				sortable: false,
				width: 60,
				xtype: 'rownumberer',
				align: 'center'
			},
			{
				text: '操作信息',
				width: 200,
				sortable: true,
				dataIndex: 'title',
			},
			{
				text: '操作人',
				width: 100,
				sortable: true,
				dataIndex: 'creator',
				align: 'center'
			},
			{
				text: '浏览器',
				width: 100,
				sortable: true,
				dataIndex: 'useragent',
				align: 'center'
			},
			{
				text: '操作方法',
				width:390,
				dataIndex: 'method',
				sortable: true
			},
			{
				text: '错误信息',
				width: 100,
				dataIndex: 'exceptiondetail',
				sortable: true
			},
			{
				text: '异常代码',
				minWidth: 300,
				flex: 1,
				dataIndex: 'exceptioncode',
				sortable: true
			},
			{
				text: '参数',
				width: 150,
				dataIndex: 'params',
				sortable: true,
				align: 'center',
				hidden: true
			},
			{
				text: '请求IP',
				width: 150,
				dataIndex: 'ip',
				sortable: true,
				align: 'center'
			},
			{
				text: '操作时间',
				width: 150,
				dataIndex: 'createtime',
				sortable: true,
				align: 'center'
			}
        ]
	}]
  })