Ext.define('Ming.view.main.frame.default.UserEditController', {

    extend: 'Ext.app.ViewController',

    alias: 'controller.userEdit',


	// // 表单提交
	onFormSubmit: function (callback) {
		var me = this;
        var formpost = {};
        var formalls = me.lookupReference('formall');
		if (!formalls.getForm().isValid()) return;
		// 密码验证
		var pwd = formalls.getForm().findField('pwd').getValue();
		var newpwd = formalls.getForm().findField('newpwd').getValue();
		var confirmpwd = formalls.getForm().findField('confirmpwd').getValue();
		var formpost = formalls.getForm().getValues();
		console.log(formpost);
		if (Ext.isEmpty(pwd) && (!Ext.isEmpty(newpwd) || !Ext.isEmpty(confirmpwd))) {
			EU.toastWarn('请输入原密码后才能修改密码!');

			return;
		}
		if (!Ext.isEmpty(pwd)) {
			if (Ext.isEmpty(newpwd)) {
				EU.toastWarn('新密码不能为空!');

				return;
			}
			if (newpwd != confirmpwd) {
				EU.toastWarn('修改密码输入不一致!');

				return;
			}
		}
		// Ext.apply(formpost,me.get());
		EU.RS({
			url: UrlUtil.get('/api/sysframe', 'updateUserInfo'),
			scope: this,
			jsonData:formpost,
			callback: function (result) {
				EU.toastInfo('操作成功!');
				// if (result.success && result.stackTrace == 'pwd') {
				// 	formalls.closeWindow();
				// 	EU.redirectTo('login');
				// } else if (result.success && result.stackTrace != 'pwd') {
				// 	formalls.getForm().setValues(result.data);
				// } else {
				// 	formalls.findField('pwd').setValue('');
				// 	formalls.findField('newpwd').setValue('');
				// 	formalls.findField('confirmpwd').setValue('');
				// }
				if (Ext.isFunction(callback)) callback();
				// console.log(result.data,'更新成功后')
				this.getView().closeWindow();
			}
		});
	},
	onFormCancel: function () {
        var me = this;
        me.getView().closeWindowVerify();
    },

    loadData: function (personnelid, userid) {
        var me = this;
		var formalls = me.lookupReference('formall');
		var user = cfg.sub.userid;
		EU.RS({
			url: UrlUtil.get('/api/sysframe', 'getUserInfo'),
			scope: this,
			jsonData: {
				data: user,
			},
			callback: function (result) {
				console.log(result);
				result.data.isck = result.data.ispdauser;
				result.data.category = result.data.ispdauser;
				formalls.getForm().setValues(result.data);
				//  Ext.MessageBox.alert('返回的json', Ext.encode(result));
			}
		});
	},
});