/**
 * 辅组方法
 */
Ext.define('Ming.utils.ExtUtils', {
    alternateClassName: 'EU',
    statics: {
        redirectTo: function (xtype) {
            Ext.Panel.redirectTo(xtype);
        },

        toastInfo: function (text, config) {
            var param = {
                title: '提示信息',
                html: text,
                border: true,
                saveDelay: 10,
                align: 'tr',
                closable: true,
                minWidth: 200,
                useXAxis: false,
                slideInDuration: 800,
                slideBackDuration: 1500,
                iconCls: 'ux-notification-icon-smile',
                autoCloseDelay: 4000,
                slideInAnimation: 'elasticIn',
                slideBackAnimation: 'elasticIn'
            };
            Ext.apply(param, config);
            Ext.toast(param);
            
            
        },
        /**
         * 警告提示框
         * @param {Object} text
         * @param {Object} config
         */
        toastWarn: function (text, config) {
/*            var param = {
                title: '警告信息',
                html: text,
                border: true,
                saveDelay: 10,
                align: 'tr',
                closable: true,
                minWidth: 200,
                useXAxis: false,
                slideInDuration: 800,
                slideBackDuration: 1500,
                iconCls: 'ux-notification-icon-warn',
                autoCloseDelay: 4000,
                slideInAnimation: 'elasticIn',
                slideBackAnimation: 'elasticIn'
            };
            Ext.apply(param, config);
            Ext.toast(param);*/
            /**
             * addbyzihui 20181228 警告和异常信息弹出到中间，需要点击确定
             */
            var msgConfig={message:text,title:'警告信息',icon:Ext.Msg.WARNING};
            Ext.apply(msgConfig, config);
            EU.showMsg(msgConfig);
        },

        toastErrorInfo: function (text, config) {
           /* var param = {
                title: '错误信息',
                html: text,
                border: true,
                saveDelay: 10,
                align: 'tr',
                closable: true,
                minWidth: 200,
                useXAxis: false,
                slideInDuration: 800,
                slideBackDuration: 1500,
                iconCls: 'ux-notification-icon-error',
                autoCloseDelay: 5000,
                slideInAnimation: 'elasticIn',
                slideBackAnimation: 'elasticIn'
            };
            Ext.apply(param, config);
            Ext.toast(param);*/
            /**
             * addbyzihui 20181228 警告和异常信息弹出到中间，需要点击确定
             */
            var msgConfig={message:text,title:'错误信息',icon:Ext.Msg.ERROR};
                 Ext.apply(msgConfig, config);
            EU.showMsg(msgConfig);
            
        },

        /**ss
         /**
         * 弹出消息框
         * prompt 缺省:false   true:可以输入 false不可以输入
         */
        showMsg: function (config) {
            config = config || {};
            config.title = config.title || '消息';
            config.message = config.message || config.msg || '';
            config.option = config.option || -1;
            config.fn = config.callback;
            if (Ext.isEmpty(config.buttons)) {
                switch (config.option) {
                    case 1 : {
                        config.icon = Ext.MessageBox.QUESTION;
                        config.buttons = Ext.MessageBox.YESNO;
                        break;
                    }
                    case 2 :
                        config.buttons = Ext.MessageBox.YESNOCANCEL;
                        break;
                    case 3 :
                        config.buttons = Ext.MessageBox.OKCANCEL;
                        break;
                    default :
                        config.buttons = Ext.MessageBox.OK;
                        break;
                }
            }
            Ext.MessageBox.show(config);
        },

        /**
         * 远程访问
         * @param {} config
         */
        RS: function (config) {
            // console.debug(config);
            var thiz = this;
            /* if(config.service && config.method){
                config.url = CU.getURL(config.service,config.method);
                delete config.method;
            }*/

            var params = Ext.isEmpty(config.params) ? {} : config.params;
            for (var key in params) {
                var data = params[key];
                if (Ext.isArray(data)) params[key] = CU.toString(data);
            }// 转换为spring @RequestList接受的转码格式
            config.params = CU.toParams(params);// 转换为spring mvc参数接受方式
            config.async = Ext.isEmpty(config.async) ? true : config.async; // true=异步 , false=同步
            config.scope = config.scope || thiz;
            config.dataType = config.dataType || 'json';
            config.timeout = config.timeout || 30000;
            if (!config.method) {
                config.method = 'POST';
            }
            var msg = Ext.isEmpty(config.msg) ? config.async : config.msg;
            config.message = config.message || '正在访问服务器, 请稍候...';
            config.target = config.target || Ext.Viewport;
            /**
             * 解决操作频率过快，遮罩消失不了的问题
             * addbyzihui 20181219
             */
            var myMask = null;
            if (msg) {
                myMask = new Ext.LoadMask({msg: config.message, target: config.target, removeMask: true}); // ,style:'background-color: rgba(208, 208, 208, 0.5);'
                myMask.show();
            }
            var callerCallback = config.callback;
            var callerErrorCallback = config.errorcallback;
            var datas = null;

            var callback = function (type, scope, success, result, response, options, myMask) {
                // alert('2-'+msg);
                if (myMask) myMask.hide();
                /**
                 * 解决操作频率过快，遮罩消失不了的问题
                 * addbyzihui 20181219
                 */
                if (success) {
                    datas = result;
                    if (Ext.isFunction(callerCallback)) {
                        Ext.callback(callerCallback, config.scope, [result]);
                    }
                } else {
                    console.debug('访问远程服务器:', response);

                    if (response.status == '999' || response.status == '998') return;
                    if (Ext.isFunction(callerErrorCallback)) {
                        Ext.callback(callerErrorCallback, config.scope, [response, options]);
                    } else {
                        thiz.toastErrorInfo('访问远程服务器失败!');
                    }
                }
            };

            // console.debug('crossdomain:'+cfg.crossdomain,config);
            /*if (cfg.crossdomain) {
                config.url = cfg.requestUrl + config.url;
                config.callback = function (success, result, errortype) {
                    Ext.callback(callback, this, ['jsonp', config.scope, success, result]);
                };
                Ext.data.JsonP.request(config);
            } else {*/
            config.callback = function (options, success, response) {
            	if(response.status=="404"){
            	if (myMask) {myMask.hide();}
            		return;
            	}
            	//console.debug(response);
                var text = response.responseText;
                Ext.callback(callback, this, ['json', config.scope, success, CU.toObject(text), response, options, myMask]);
            };

            Ext.Ajax.request(config);
            // }

            return datas;
        },

        /**
         * 常用的view转码数据查询（带缓存机制）。
         * @param {} config 对象或viewname
         * config:{"viewname":"",cache:true/false,params:{viewname:"",type:"",key=""}}
         * @return {}
         */
        RSView: function (config, callback) {
            var thiz = this;
            if (Ext.isString(config)) config = {params: {viewname: config}};
            return EU.RSOrCache(config, callback);

        },
        /**
         * 读取各基础数据或者字典数据
         * config.cache 默认为true
         * @param {Object} config
         * @param {Object} callback
         */
        RSOrCache: function (config, callback) {
            var thiz = this;
            //if (Ext.isString(config)) config = {params: {viewname: config}};
            var cache = Ext.isEmpty(config.cache) ? true : config.cache;// 是否缓存,缺省true

            var jsonData = {}, url, key;
            if (config.type == 'basic') {
                key = 'BASIC_' + config.params.code;
                url = UrlUtil.get('api/dynamicdict', 'list');
                jsonData = {code: config.params.code, paramMap: config.params.paramMap};

            } else {
                key = 'DICT_' + config.params.viewname;
                url = UrlUtil.get('api/base/mappinglist', 'getDictByPara');
                jsonData = {data: config.params.viewname};
            }
            var data = cache ? session.get(key) : null;
            callback = callback || config.callback;
            var scope = config.scope || thiz;
            if (!Ext.isEmpty(data) && Ext.isArray(data)) {
                if (Ext.isFunction(callback)) Ext.callback(callback, scope, [data]);
                return data;
            }
            var async = config.async === false ? config.async : true; // true=异步 , false=同步
            thiz.RS({
                async: async,
                url: url, jsonData: jsonData, callback: function (result) {
                    // addbyzihui  将result.data取出
                    if (result && result.success === true) {
                        result = result.data;
                    }
                    if (cache) session.set(key, result);
                    data = result;
                    if (Ext.isFunction(callback)) Ext.callback(callback, scope, [data]);
                }, msg: false
            });
            return data;
        },
        /**
         * 查询配置文件列表信息
         * @param {} config
         * @param {} callback
         * @return {}
         */
        RScfgList: function (config, callback) {
            var params = {};
            if (Ext.isString(config)) config = {params: {type: config}};
            config.msg = false;
            config.url = 'platform/systemcfg/getlist.do';
            if (Ext.isFunction(callback)) config.callback = callback;

            return this.RS(config);
        },

        /**
         * 获取系统配置文件信息
         * @param {} config  对象或主键id
         * @param {} callback
         * @return {}
         */
        RScfgInfo: function (config, callback) {
            var params = {};
            if (Ext.isString(config)) config = {params: {id: config}};
            config.msg = false;
            config.url = 'platform/systemcfg/getinfo.do';
            if (Ext.isFunction(callback)) config.callback = callback;

            return this.RS(config);
        },

        /**
         * 删除系统配置文件信息
         * @param {} config 对象或主键id
         * @param {} callback
         * @return {}
         */
        RScfgDel: function (config, callback) {
            var params = {};
           if (!Ext.isObject(config)) config = {jsonData: {recid: config}};
            config.msg = false;
            //config.url = 'platform/systemcfg/delete.do';
            
            config.url = UrlUtil.get("api/sys/systemcfg","delete");
            if (Ext.isFunction(callback)) config.callback = callback;

            return this.RS(config);
        },

        /**
         * 新增系统配置文件信息
         * @param {} config
         * @param {} callback
         * @return {}
         */
        RScfgSave: function (config, callback) {
            var params = {};
            config.msg = false;
            config.url = UrlUtil.get("api/sys/systemcfg","save");
            if (Ext.isFunction(callback)) config.callback = callback;

            return this.RS(config);
        }
    }
});