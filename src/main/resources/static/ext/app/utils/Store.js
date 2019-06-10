Ext.define('Ming.utils.Store', {
    alternateClassName: 'StoreUtil',
    singleton: true,

    /**
     * 默认配置
     */
    defaultConfig: {
        autoLoad: true,
        proxy: {
            type: 'api'
        }
    },

    /**
     * 分页默认配置
     */
    pageConfig: {
        pageSize: 20,
        proxy: {
            type: 'api',
            paramsAsJson: true,
            pageParam: 'page.pageNo',
            limitParam: 'page.pageSize',
            reader: {
                type: 'json',
                rootProperty: 'data.list',
                messageProperty: 'msg',
                totalProperty: 'data.count'
            }
        }
    },

    /**
     * 传入的配置会覆盖默认的
     */
    getConfig: function (config) {
        var me = this,
            storeConfig = {};
        // paging为true返回分页的配置
        storeConfig = Ext.merge(storeConfig, me.defaultConfig);
        if (config && config.paging === true) {
            storeConfig = Ext.merge(storeConfig, me.pageConfig);
        }
        storeConfig = Ext.merge(storeConfig, config);

        storeConfig.proxy.url = config.url;

        /* if(cfg.moco_runner && cfg.moco_runner_url){
                   if(storeConfig.proxy.url.indexOf(ROOTPATH)!=-1){
                       storeConfig.proxy.url=CU.replaceAll(storeConfig.proxy.url,ROOTPATH+"/","");
                   }
                   storeConfig.proxy.url=cfg.moco_runner_url+storeConfig.proxy.url;
               }
               console.debug(storeConfig.proxy.url);*/
        return storeConfig;
    }
});