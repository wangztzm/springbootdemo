Ext.define('Ming.view.main.frame.default.UserEdit', {
	extend: 'ux.form.Panel',
	xtype: 'userEdit',
	listeners: {afterrender: 'loadData'},
	reference: 'userEdit',
	requires: [
        'Ming.view.main.frame.default.UserEditController',
	],
	controller: 'userEdit',
	items:[{
		xtype:'form',
		reference: 'formall',
		items: [{
			xtype: 'fieldset',
			title: '人员信息',
			defaults: {
				xtype: 'textfield',
				width: '100%'
			},
			layout: {
				type: 'table',
				columns: 2
			},
			items: [{
					fieldLabel: '中文名',
					name: 'username',
					allowBlank: false
				},
				{
					fieldLabel: '英文名',
					name: 'usernameeng',
					allowBlank: false
				},
				{
					fieldLabel: '联系方式',
					name: 'userconnect'
				},
				{
					xtype: 'combo',
					fieldLabel: '性别',
					name: 'sex',
					viewname: "SEX"
				},
				{
					xtype: 'datefield',
					format: 'Y-m-d',
					fieldLabel: '出生日期',
					name: 'birthday',
					// value: '2018-11-19'
				},
				{
					xtype: 'combo',
					fieldLabel: '是否为PDA用户',
					readOnly: true,
					name: 'ispdauser',
					viewname: "YORN",
				},
				{
					xtype:'combo',
					fieldLabel:'是否为仓库打板人',
					name: 'isck',
					readOnly: true,
					submitValue:false,
					viewname: "YORN",
				},
				{
					xtype:'combo',
					fieldLabel:'类别',
					submitValue:false,
					readOnly: true,
					name: 'category',
					viewname: "YORN",
				},
				{
					fieldLabel: 'ID',
					name: 'buildupagent'
				},
				{
					fieldLabel: '备注',
					name: 'dsc'
				}
			]
		},
		{
			xtype: 'fieldset',
			title: '用户信息',
			defaults: {
				xtype: 'textfield',
				width: '100%'
			},
			layout: {
				type: 'table',
				columns: 3,
				tdAttrs: {
					style: {
						width: '33%',
						textAlign: 'center'
					}
				}
			},
			items: [{
					fieldLabel: '用户代码',
					name: 'userid',
					readOnly: true
				},
				{
					fieldLabel: '用户密码',
					name: 'pwd',
					allowBlank: true,
					inputType: 'password'
					// value: passward
				},
				{
					fieldLabel: '新密码',
					name: 'newpwd',
					allowBlank: true,
					inputType: 'password'
				},
				{
					fieldLabel: '密码确认',
					name: 'confirmpwd',
					allowBlank: true,
					inputType: 'password'
				},
				{
					xtype: 'datefield',
					fieldLabel: '密码有效期',
					format: 'Y-m-d',
					name: 'pwdvalidbef',
					// value: '2018-11-19'
				},
				{
					fieldLabel: '营业部',
					name: 'opedepartid',
					allowBlank: false,
					readOnly: true
				},
				{
					fieldLabel: '用户班组',
					name: 'classid',
					readOnly: true
				}
			]
		},
	],
	}],
	
	buttons:[{
		text: '提交',
		handler: 'onFormSubmit'
	}, {
		text: '关闭',
		handler: 'onFormCancel'
	}],
});