Ext.define('Ming.view.main.login.LoginController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.login',

    views: ['systemFrame'],

    onUserNameEnterKey: function (field, e) {
        if (e.getKey() == Ext.EventObject.ENTER) {
            this.lookupReference('t_password').focus(true, true);
        }
    },

    onPasswordEnterKey: function (field, e) {
        if (e.getKey() == Ext.EventObject.ENTER) {
            this.onLoginButton();
        }
    },

    onLoginButton: function (button, e, eOpts) {
        this.login(false);
    },
    login: function (invalidate) {
        var me = this;
        var p_form = this.lookupReference('p_form').getForm();
        if (!p_form.isValid()) return;
        var userinfo = p_form.getValues();
        var url = UrlUtil.get('api/sysframe', 'login');
        var plaintStr=userinfo.username.toUpperCase()+":"+userinfo.password+":"+(invalidate?"Y":"N")+":WEB";
         console.debug(plaintStr);
        var authorization=Ext.util.Base64.encode(plaintStr);
       
        EU.RS({
            url: url, scope: this, params: userinfo,headers:{"Authorization":authorization}, callback: function (result) {
              
              // shiro返回值不一样
                if (result.result) {
                    result.success = CU.getBoolean(result.result);
                }
                console.debug(result);
                if (result.success && result.resultCode=="0") {
               
                    this.loginSuccess(userinfo, result.data);

                    return;
                }
                
                var msg;
    			switch (result.resultCode) {
                case "115": {
                    EU.showMsg({title:'提示信息',message:"当前用户已经在线，确定强制登录吗？",option:1,callback:function(rt){
                        if(rt=='yes')me.login(true);
                    }});
                    break;
                }
                default:  msg = result.msg; break;
             }

                if (!Ext.isEmpty(msg)) EU.toastErrorInfo(result.resultCode+","+msg);
            }
        });
    },

    loginSuccess: function (userinfo, sub) {
        if (userinfo.rememberMe != '1') {
            delete userinfo.username;
            delete userinfo.password;
        }
        if (userinfo.rememberPassword != '1') {
            delete userinfo.password;
        }
        userinfo.username=userinfo.username.toUpperCase();
        userinfo.token=sub.token;
        local.set('userinfo', userinfo);
        session.set('isLogin', true);
        cfg.sub = sub;
        PU.createUrlFunction(cfg.sub.systemurls);
        EU.redirectTo('vsystemFrame');
    },

    init: function () {
        var me = this;
        var userinfo = local.get('userinfo');
        if (!Ext.isEmpty(userinfo)) {
            var p_form = me.lookupReference('p_form').getForm();
            p_form.setValues(userinfo);
        }
    }
});