Ext.define('Ming.view.main.login.Login', {
    extend: 'Ext.panel.Panel',    
    
  alias : 'widget.vlogin',
   /* alternateClassName: 'vlogin',
    xtype: 'vlogin',*/
    requires: [
        'Ming.view.main.login.LoginController',
        'Ming.view.main.frame.SystemFrame'
    ],
    controller: 'login',
    layout: {type: 'fit'},
    referenceHolder: true,
    items: [
        {
            xtype: 'panel',
            html:'<div style="font-size:36px;font-weight:bold;float:left;margin:60px 0px 0px 60px;letter-spacing:10px;color:#ffffff;text-shadow:2px 5px 12px #999999;">CFPS</div><div style="font-size:26px;float:left;margin:105px 0px 0px -137px;color:#ffffff;text-shadow:2px 5px 12px #999999;"><span>CFPS</span><span style="letter-spacing:10px;margin-left:15px;">迭代更新版本...</span></div>',
            bodyStyle: 'background:url(\'resources/images/bg1.png\') no-repeat; background-size: cover',
            heigth: 900,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    html: '<div style="color:#ffffff;;font-size:26px;">登录到您的帐户</div>'
                },
                {
                    xtype: 'form',
                    reference: 'p_form',
                    width: 435,
                    height: 290,
                    bodyPadding: '20 20',
                    layout: {
                        type: 'vbox'
                    },
                    defaults: {
                        margin: '5 15',
                        width: '100%',
                    },
                    margin: '30 0 0 0',
                    cls:'x-border-radius',
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'username',
                            inputCls:"uppercase",
                            height: 55,
                            margin: '15 15 5 15',
                            ui:'ext-border-radius',
                            hideLabel: true,
                            allowBlank: false,
                            cls: 'auth-textbox',
                            emptyText: '用户名称',
                            triggers: {
                                user: {
                                    cls: 'x-fa fa-user login-icon'
                                }
                            },
                            listeners: {
                                specialkey: 'onUserNameEnterKey'
                            }
                        },
                        {
                            xtype: 'textfield',
                            ui:'ext-border-radius',
                            reference: 't_password',
                            name: 'password',
                            height: 55,
                            hideLabel: true,
                            emptyText: '用户密码',
                            inputType: 'password',
                            allowBlank: false,
                            triggers: {
                                user: {
                                    cls: 'x-fa fa-lock login-icon'
                                }
                            },
                            listeners: {
                                specialkey: 'onPasswordEnterKey'
                            }
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'rememberMe',
                                    flex: 1,
                                    cls: 'form-panel-font-color rememberMeCheckbox',
                                    height: 30,
                                    margin:'0 0 0 20',
                                    checked: true,
                                    inputValue: '1',
                                    uncheckedValue: '0',
                                    boxLabel: '记住用户名'
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'rememberPassword',
                                    flex: 1,
                                    cls: 'form-panel-font-color rememberMeCheckbox',
                                    height: 30,
                                    margin:'0 -50 0 100',
                                    inputValue: '1',
                                    uncheckedValue: '0',
                                    boxLabel: '记住密码'
                                }
                            ]
                        },
                        {
                            xtype: 'button',
                            name: 'loginButton',
                            scale: 'large',
                            height: 50,
                            iconAlign: 'right',
                            // iconCls: 'x-fa fa-angle-right',
                            cls:'x-border-radius',
                            text: '登录',
                            action: 'login',
                            listeners: {
                                click: 'onLoginButton'
                            }
                        },
                        
                    ]
                },{
                    xtype: 'label',
                    html: '<div style="color:#ffffff;margin-top:50px;font-weight:bold">©天信达信息技术有限公司  版本:<font>(Ver:6.0.2018.09.13)</font></div>'
                },
            ],
        }
    ]
});