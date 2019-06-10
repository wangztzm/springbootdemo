Ext.define('Ming.view.sys.logsystem.Systemhandel', {
	extend: 'Ext.panel.Panel',
	xtype: 'sys-logsystem-Systemhandel',
	layout: 'fit',
	items: [{
		xtype: 'basedata-grid',
		paging: true,
		bind: {
			store: '{Operatedata}'
		},
		reference: 'systemOperate',
		listeners: {
			rowdblclick: 'onModuledblClick'
		},
		tbar: [{
				xtype: 'textfield',
				fieldLabel: '操作信息/操作人',
				width: 250,
				reference: 'creat'
			},
			{
				xtype: 'textfield',
				fieldLabel: '开始时间',
				name: 'startDate',
				reference: 'startDate',
				hideLabel: true,
				width: '300',
				inputCls: 'Wdate',
				value: CU.getBeforeTimeMinutes(0),
				listeners: {
					render: function (p) {
						p.getEl().on('click', function () {
							WdatePicker({
								el: p.getInputId(),
								doubleCalendar: true,
								dateFmt: 'yyyy-MM-dd HH:mm'
							});
						});
					}
				}
			},
			{
				xtype: 'textfield',
				fieldLabel: '结束时间',
				name: 'endDate',
				reference: 'endDate',
				hideLabel: true,
				width: '300',
				inputCls: 'Wdate',
				value: CU.getBeforeTimeMinutes(-1),
				listeners: {
					render: function (p) {
						p.getEl().on('click', function () {
							WdatePicker({
								el: p.getInputId(),
								doubleCalendar: true,
								dateFmt: 'yyyy-MM-dd HH:mm'
							});
						});
					}
				}
			},
			{
				text: '查询',
				iconCls: 'x-fa fa-search',
				handler: 'querylog'
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
				qcfg: {
					type: 'string'
				}
			},
			{
				text: '操作人',
				width: 110,
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
				minWidth: 320,
				flex: 1,
				dataIndex: 'method',
				sortable: true
			},
			{
				text: '请求IP',
				width: 150,
				dataIndex: 'ip',
				sortable: true,
				align: 'center'
			},
			{
				text: '操做时间',
				width: 150,
				dataIndex: 'createtime',
				sortable: true,
				align: 'center'
			}
		]
	}]
})