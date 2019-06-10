/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Ming.Application',

    name: 'Ming',

    requires: [
        // This will automatically load all classes in the Ming namespace
        // so that application classes do not need to require each other.
        /* "Overrides.*",*/
        'Ming.utils.Store',
        'Ming.utils.Loader',
        'Ming.utils.Config',
        'Ming.utils.CommonUtils',
        'Ming.utils.storage.localStorage', // 永久数据存储
        'Ming.utils.storage.sessionStorage', // 会话数据存储
        'Ming.locale.Locale',
        'Ming.locale.zh_CN',
        'Ming.utils.WidgetConfig',
        'Ming.utils.Url',
        'Ming.utils.Failed',
        'Ming.utils.Number',
        'Ming.expand.ux.data.*',
        'Ming.expand.ux.form.*',
        'Ming.expand.ux.widget.*',
        /*  'Ming.*',   */
        'Ming.view.Home'
        // 'Ming.view.main.Main'
    ],

    // mainView: 'Ming.view.main.Main'
    mainView: 'Ming.view.Home'
});