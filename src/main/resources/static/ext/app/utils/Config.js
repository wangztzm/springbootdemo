/**
 *项目基础配置信息
 */
Ext.define('Ming.utils.Config', {
    alternateClassName: 'cfg', // 设置别名
    statics: {
        systemname: 'CFPS升级版本',

        xtypeLogin: 'vlogin',

        xtypeFrame: 'vsystemFrame',

        resourcesPath: 'resources/',

        /** 用户信息*/
        sub: {},
        token:{},
        /** 系统默认语言*/
        language: 'zh_CN',

        /** 系统默认主题风格*/
        theme: '01',
        /**
         * 窗口最大允许打开数目
         */
		openPanelNumber:12,
        /** 跨域请求*/
        crossdomain: true,
        /** 是否访问本地moco的数据**/
        moco_runner: false,
        /** 本地moco_runner的 url**/
        moco_runner_url: 'http://localhost:12306/',

        /** 图片文件访问服务的上下文*/
       imgContext:"/ming-web/",
 		//requestUrl:"http://172.22.70.36:8280/ming-api/"
 		requestUrl:"http://localhost:8180/ming-web/"

    }
});