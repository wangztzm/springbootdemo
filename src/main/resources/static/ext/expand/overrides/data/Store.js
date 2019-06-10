Ext.define('expand.overrides.data.Store', {
    override: 'Ext.data.Store',
    constructor: function (config) {
        var me = this;
        if (!Ext.isEmpty(config)) {
            if (Ext.isObject(config.proxy)) {
                /* if(cfg.crossdomain === true){
                    config.proxy.type = 'jsonp';
                    var url =  cfg.requestUrl + config.proxy.url;
                    config.proxy.url = url;
                }
                else{*/
                if (!config.proxy.type) {
                    config.proxy.type = 'ajax';
                }
                // }

                if (Ext.isEmpty(config.proxy.actionMethods)) {
                    config.proxy.actionMethods = {
                        read: 'POST'
                    };
                }
                if (cfg.moco_runner && cfg.moco_runner_url) {
                    if (config.proxy.url.indexOf(ROOTPATH) != -1) {
                        config.proxy.url = CU.replaceAll(config.proxy.url, ROOTPATH + '/', '');
                    }
                    config.proxy.url = cfg.moco_runner_url + config.proxy.url;
                }
                console.debug(cfg.moco_runner,config.proxy.url);
                // addbyzihui 如果是分页，自动更改默认的分页参数名
                // console.debug();
                if (Ext.isObject(config.proxy.extraParams)) {
                    if (config.proxy.extraParams.paging === true) {
                        // Ext.apply(config.proxy.extraParams,{"page":{pageNo:2,pageSize:10}});
                        // delete config.proxy.extraParams.paging;
                        Ext.apply(config.proxy, {
                            paramsAsJson: true,
                            // pageParam: '',
                            // limitParam: '',
                            reader: {
                                type: 'json',
                                rootProperty: 'data.list',
                                messageProperty: 'msg',
                                totalProperty: 'data.count'
                            }
                        });
                    }
                }
                //  console.debug("config", config);

            }
        }
        me.callParent(arguments);
    }

});