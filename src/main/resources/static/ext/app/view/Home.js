Ext.define('Ming.view.Home', {
    extend: 'Ext.container.Viewport',
    alternateClassName: 'vhome',
    xtype: 'vhome',
    requires: ['Ming.view.HomeController',
        'Ming.view.main.login.Login',
        'Ming.view.main.login.LockScreen'],
    controller: 'home',
    layout: 'card',
    items: [
        {layout: 'fit'} // 主窗口
       //, {xtype: 'lockscreen'} // 锁屏窗口
    ]
});