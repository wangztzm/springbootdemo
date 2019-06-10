/**
 * 辅组方法
 */
Ext.define('Ming.utils.ProjectUtils', {
    alternateClassName: 'PU',
    /* requires: [
       'app.view.platform.systemattach.FileBatchUpload',
       'app.view.platform.systemattach.FileBatchPreview'
    ],*/
    statics: {
        wins: {},

        operateLimits: {},

        getHeight: function () {
            return Ext.FramePanel.getEl().getHeight();
        },

        getWidth: function () {
            return Ext.FramePanel.getEl().getWidth();
        },

        openTabModule: function (config, tabcfg) {
            CU.log(config);
            if (Ext.isEmpty(config.type) || config.type == '00') return;
            tabcfg = tabcfg || {};
            var contentPanel = Ext.SystemTabPanel;
            if (Ext.isEmpty(contentPanel)) {
                EU.toastErrorInfo('主窗口容器为空，请与管理员联系。');

                return;
            }
            // 说明xtype需要传入默认参数
            /*        	var configParams={};
                        if(config.type=='01' && config.url.indexOf('?')!=-1){

                        }*/

            if (contentPanel instanceof Ext.tab.Panel) {
                var id = config.id;
                var tabPanel = contentPanel.getComponent('TAB_' + id);
                if (Ext.isEmpty(tabPanel)) {
                    var items = contentPanel.items.items;
                    if (cfg.openPanelNumber != -1 && items.length >= cfg.openPanelNumber) {
                        EU.showMsg({
                            title: '警告',
                            icon: Ext.MessageBox.WARNING,
                            message: '<font color="red">由于打开多个窗口会影响机器性能!<br>系统限制最多只能打开' + cfg.openPanelNumber + '个窗口!</font>'
                        });

                        return;
                    }
                    try {
                        // 获取页面及页面参数
                        var url = config.url,
                            urlParts = url.split('?'),
                            viewConfig = {};

                        if (urlParts.length > 1) {
                            url = urlParts[0];
                            viewConfig = Ext.Object.fromQueryString(urlParts[1]);
                        }

                        if (config.type == '02') {
                            viewConfig = Ext.apply({
                                id: 'TAB_' + id,
                                title: config.text,
                                closable: true,
                                margin: '1 0 0 0',
                                src: url
                            }, viewConfig);
                            tabPanel = Ext.create('Ext.ux.IFrame', viewConfig);
                        } else {
                            viewConfig = Ext.apply({
                                id: 'TAB_' + id,
                                title: config.text,
                                closable: true,
                                margin: '1 0 0 0'
                            }, viewConfig);
                            //console.debug(Ext.decode(viewConfig));
                            tabPanel = Ext.create(url, viewConfig);
                            CU.log('openTabModule:' + url);
                        }
                    } catch (e) {
                        console.debug(e);
                        EU.showMsg({
                            title: '警告',
                            icon: Ext.MessageBox.WARNING,
                            message: '<font color="red">打开菜单失败:<br/>' + e + '!</font>'
                        });
                        return;
                    }

                    CU.log('openTabModule:' + tabPanel);
                    tabPanel.menuid = id;
                    if (!Ext.isEmpty(config.glyph)) tabPanel.glyph = config.glyph;
                    if (!Ext.isEmpty(config.iconCls)) tabPanel.iconCls = config.iconCls;
                    tabPanel = contentPanel.add(tabPanel);
                    tabPanel.tab.setClosable(!(tabcfg.checked === false));
                    this.systemLimits(tabPanel);
                }
                /**
                 * 加载完毕后，触发onLoaded事件，把loadedParams参数传递给tab页
                 */
                if (tabcfg.loadedParams) {
                    var controller = tabPanel.getController();
                    if (controller && controller.onLoaded) {
                        controller.onLoaded(tabcfg.loadedParams);
                    }
                }

                //console.debug(tabPanel.getController());
                return contentPanel.setActiveTab(tabPanel);
            } else if (contentPanel instanceof Ext.container.Container) {
                id = config.id;
                var cid = 'TAB_' + id,
                    mainLayout = contentPanel.getLayout(),
                    lastView = mainLayout.getActiveItem();
                tabPanel = contentPanel.child('component[id=' + cid + ']');
                if (!tabPanel) {
                    items = contentPanel.items.items;
                    if (cfg.openPanelNumber != -1 && items.length >= cfg.openPanelNumber) contentPanel.remove(items[0]);
                    if (config.type == '02') {
                        tabPanel = Ext.create('Ext.ux.IFrame', {
                            id: cid,
                            margin: '20 20 0 20',
                            cls: 'shadow',
                            src: config.url
                        });
                    } else {
                        tabPanel = Ext.create(config.url, {
                            id: cid,
                            header: false,
                            margin: '20 20 0 20',
                            cls: 'shadow'
                        });
                    }
                    tabPanel.menuid = id;
                    tabPanel.height = Ext.Element.getViewportHeight() - 84;
                    if (!Ext.isEmpty(config.glyph)) tabPanel.glyph = config.glyph;
                    if (!Ext.isEmpty(config.iconCls)) tabPanel.iconCls = config.iconCls;
                    mainLayout.setActiveItem(contentPanel.add(tabPanel));
                } else {
                    if (tabPanel !== lastView) {
                        mainLayout.setActiveItem(tabPanel);
                    }
                    if (tabPanel.isFocusable(true)) {
                        tabPanel.focus();
                    }
                }
                this.systemLimits(tabPanel);
            } else {
                EU.toastErrorInfo('错误主窗口容器，请与管理员联系。');
            }
        },

        openModule: function (config) {
            var me = this;
            if (Ext.isEmpty(config)) {
                EU.toastErrorInfo('错误请求!');

                return;
            }
            if (Ext.isEmpty(config.url) && Ext.isEmpty(config.xtype)) {
                EU.toastWarn('url和xtype不能同时为null!');
                return;
            }
            config.modal = Ext.isEmpty(config.modal) ? true : config.modal;
            config.layout = Ext.isEmpty(config.layout) ? 'fit' : config.layout;
            var xtype = config.xtype;
            delete config.xtype;
            var url = config.url;
            delete config.url;
            var pcfg = config.pcfg;
            delete config.pcfg;
            if (config.maximizable == false) {
                Ext.apply(config, {maximizable: false});
            } else {
                Ext.apply(config, {maximizable: true});
            }
            var item = null;
            var pscope = config.scope;
            config.resizable = Ext.isEmpty(config.resizable) ? false : config.resizable;
            config.referenceHolder = true;
            var closeable = Ext.isEmpty(config.closable) ? true : config.closable;
            config.closable = false;
            config.height = (config.height == 'max' || config.height == -1) ? me.getHeight() : (config.height > me.getHeight() ? me.getHeight() : config.height);
            config.width = (config.width == 'max' || config.width == -1) ? me.getWidth() : (config.width > me.getWidth() ? me.getWidth() : config.width);
            var dialog, panelcfg, controller, closeWindowVerify;
            if (!Ext.isEmpty(url)) {
                panelcfg = Ext.apply({src: url}, pcfg);
                item = Ext.create('Ext.ux.IFrame', panelcfg);
                // item.iframeEl.dom.contentWindow = iframe对象
            } else {
                panelcfg = Ext.apply({
                    xtype: xtype,
                    params: config.params,
                    pscope: pscope,
                    callback: config.callback,
                    fn: config.fn
                }, pcfg);

                if (config.btns) {
                    panelcfg.btns = config.btns;
                }

                item = Ext.create(panelcfg);
            }
            if (closeable) {
                closeWindowVerify = function () {
                    controller = item.getController();
                    if (Ext.isFunction(item.closeWindowVerify)) {
                        item.closeWindowVerify();
                    } else if (controller && Ext.isFunction(controller.closeWindowVerify)) {
                        controller.closeWindowVerify();
                    } else {
                        dialog.close();
                    }
                };
            }
            //添加默认esc 关闭窗口
            config.onEsc = function () {
                if (closeWindowVerify) {
                    closeWindowVerify();
                    return;
                }
                return this.close();
            };
            dialog = Ext.create('Ext.window.Window', config);
            dialog.add(item);
            if (Ext.isObject(config.position)) {
                dialog.setPosition(config.position.x, config.position.y);
            }
            dialog.show();
            dialog.on('close', function (panel, eOpts) {
                delete me.wins[dialog.id];
            }, this);
            if (closeable) {
                dialog.addTool({
                    xtype: 'tool', type: 'close', tooltip: '关闭窗口', scope: this, handler: closeWindowVerify
                });
            }
            me.wins[dialog.id] = dialog;

            return dialog;
        },

        /**
         * 附件上传/下载组件
         * @param {} config
         * @param disabeld 是否不可上传 缺省false
         *
         */
        /*	openAttachWindow : function(config){
               config.disabeld = Ext.isEmpty(config.disabeld)?false:config.disabeld;
               config.scope = config.scope || this;
               config.title = config.title || (config.disabeld?'附件预览':'附件上传');
               config.modal = Ext.isEmpty(config.modal) ? true : config.modal;
               if(Ext.isEmpty(config.tablename)){
                   EU.toastErrorInfo('参数:tablename不能为空!');return;
               }else if(Ext.isEmpty(config.fieldname)){
                   EU.toastErrorInfo('参数:fieldname不能为空!');return;
               }else if(Ext.isEmpty(config.fieldvalue)){
                   EU.toastErrorInfo('参数:fieldvalue不能为空!');return;
               }
               var xtype='FileBatchUpload',width=1000,height=600;
               if(config.disabeld){width = 800;xtype = 'FileBatchPreview';}
               this.openModule({xtype:xtype,title:config.title,width:width,height:height,params:config,modal:config.modal,scope:config.scope,callback:config.callback});
           },
*/
        /**
         * 下载或导出文件
         * cfg={params:{},url:UrlUtil.get(""),callback:function(){}}
         * @param {Object} cfg
         * @param {Object} timeout
         */
        download: function (cfg, timeout) {
            var me = this;
            var params = Ext.isEmpty(cfg.params) ? {} : cfg.params;
            var url = cfg.url;
            for (var key in params) {
                var data = params[key];
                if (Ext.isArray(data)) params[key] = CU.toString(data);
            }//转换为spring @RequestList接受的转码格式
            params = CU.toParams(params);//转换为spring mvc参数接受方式
            url += (url.indexOf('?') > 0 ? '&' : '?') + CU.parseParams(params);
            var width = Ext.isEmpty(cfg.width) ? 650 : cfg.width; //350
            var height = Ext.isEmpty(cfg.height) ? 500 : cfg.height; //300
            var bodyWidth = Ext.getBody().getWidth();
            var bodyHeight = Ext.getBody().getHeight();
            var iLeft = bodyWidth / 2 - (width / 2);
            var iTop = bodyHeight / 2 - (height / 2);
            window.open(url, 'fullscreen=0,menubar=0,toolbar=0,location=0,scrollbars=0,resizable=0,status=1,left=' + iLeft + ',top=' + iTop + ',width=' + width + ',height=' + height);
            if (Ext.isFunction(cfg.callback)) cfg.callback();
        },

        /**
         * XMLHttpRequest下载或导出文件
         * @param {Object} url
         * @param {Object} params 请求参数对象，会被编码为json字符串。
         * @param {Object} options。fileName：文件名、fileType：文件类型，会判断文件类型转为对应的MIME的类型，默认xlsx。
         */
        xhrDownload: function (url, params, options) {
            var userInfo = local.get('userinfo'),
                ts = new Date().getTime(),
                transNo = new Date().getTime().toString(),
                token = userInfo.token,
                md5 = hex_md5(ts.toString() + transNo + token),
                xhr;
            params = Ext.JSON.encode(params);
            xhr = new XMLHttpRequest();
            xhr.open('post', url + '?ts=' + ts + '&transNo=' + transNo);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.setRequestHeader('Authorization', Ext.util.Base64.encode(userInfo.username + ':' + md5));
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var blob, fileUrl, fileName, linkEl, fileType, mimeType;
                    // 没有指定type，默认xlsx
                    fileType = options && options.fileType ? options.fileType : 'xlsx';
                    if (fileType == 'xls') {
                        mimeType = 'application/vnd.ms-excel';
                    } else if (fileType == 'xlsx') {
                        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    }
                    blob = new Blob([xhr.response], {
                        type: mimeType
                    });
                    fileUrl = URL.createObjectURL(blob);
                    try {
                        fileName = decodeURI(xhr.getResponseHeader('Content-Disposition').split(';')[1].split('=')[1]);
                    } catch (e) {
                        fileName = options && options.fileName ? options.fileName : CU.getBeforeTimeMinutes(0);
                    }
                    fileName = decodeURI(xhr.getResponseHeader('Content-Disposition').split(';')[1].split('=')[1]);
                    linkEl = Ext.DomHelper.append(Ext.getBody(), {
                        tag: 'a',
                        href: fileUrl,
                        download: fileName
                    });
                    linkEl.click();
                    Ext.removeNode(linkEl);
                }
            };
            xhr.send(params);
        },

        /**
         * 系统刷新
         * @param {} xtype
         */
        onAppUpdate: function (config) {
            config = config || {};
            config.title = config.title || '应用更新';
            config.msg = config.msg || '应用程序有一个更新，是否重新加载界面？';
            config.option = 1;
            config.callback = function (choice) {
                if (choice === 'yes') {
                    if (config.xtype) {
                        EU.redirectTo(config.xtype);
                    } else {
                        window.location.reload();
                    }
                }
            };
            EU.showMsg(config);
        },

        /**
         * 退出系统
         * @param {} btn
         */
        onLogout: function (btn, callback) {
            EU.showMsg({
                title: '退出系统', message: '您确定要退出吗？', animateTarget: btn, option: 1, callback: function (choice) {
                    if (choice === 'yes') {
                        EU.RS({
                            url: UrlUtil.get('api/sysframe', 'logout'), callback: function (result) {
                                console.debug(result);
                                if (CU.getBoolean(result.data)) {
                                    session.clean();
                                    Ext.callback(callback);
                                    EU.redirectTo(cfg.xtypeLogin);
                                }
                            }
                        });
                    }
                }
            });
        },

        /**
         * 获取系统全部的url连接
         * @param {} callback
         * @param {} scope
         */
        createUrlFunction: function (systemurls) {
            console.debug(systemurls);
            if (Ext.isEmpty(systemurls)) return;
            var key;
            for (key in systemurls) {
                var rec = systemurls[key];
                if (EU[rec.beanname] == null) EU[rec.beanname] = {};
                EU[rec.beanname][rec.methodname] = new Function('cfg', 'cfg.url="' + rec.url + '";return EU.RS(cfg);');
            }
            console.debug(EU);
        },

        /**
         * 系统按钮权限控制
         * @param {} panel      获取reference的容器
         * @param {} modulurl 为alternateClassName对应的地址
         */
        systemLimits: function (panel, modulurl, callback) {
            if (!Ext.isFunction(panel.lookupReference)) return;
            modulurl = modulurl || panel.$className;
            // var operateLimits = cfg.sub.systemlimits[modulurl];
            // addbyzihui
            var operateLimits = [];
            if (!Ext.isArray(operateLimits)) return;
            Ext.each(operateLimits, function (rec) {
                if (rec.islimit > 0) return;
                var object = panel.lookupReference(rec.operatecode);
                if (Ext.isEmpty(object)) return;
                object.hide();
            });
            if (Ext.isFunction(callback)) Ext.callback(callback);
        },
        /**
         * 判断当前用户是否有该权限
         * @param {Object} functionid
         */
        hasFunction: function (functionid) {
            return cfg && cfg.sub && cfg.sub.functions && cfg.sub.functions.indexOf(functionid) != -1 ? true : false;
        },

        /**
         * 打开新的tab页，新的tab页不存在则创建。如果指定invokeFnConfig，则会在激活新tab后调用配置的方法。
         * @param {Ext.tab.Panel} 标签面板
         * @param {Object} 激活的tab的页面配置。
         *                 比如：
         *                      {
         *                          xtype: 'formpanel',
         *                          domInt: 'D',
         *                          expImp: 'I'
         *                      }
         * @param {Object} 激活tab后调用的方法配置。
         *                 比如：
         *                      {
         *                          fn: 'query',
         *                          parmas:{name: 'user'} 或者[] 数组形式
         *                          scope: 函数调用的作用域，默认为激活tab关联的controller
         *                      }
         * 例子： 注意新开的需要指定下title
         *               PU.openTab(tabPanel, {title: '新开标签页', xtype: 'base-cuscustomer-cuscustomer'}, {
         *                  fn: 'onSearchClick',
         *                  params: []
         *               });
         *
         */
        openTab: function (tabPanel, viewConfig, invokeFnConfig) {
            var tab = tabPanel.child(viewConfig.xtype);
            if (!tab) {
                tab = tabPanel.add(viewConfig);
            }
            tabPanel.setActiveTab(tab);

            if (invokeFnConfig) {
                var scope = invokeFnConfig.scope,
                    params = [],
                    defaultScope = tab.getController();
                if (!Ext.isArray(invokeFnConfig.params)) {
                    params.push(invokeFnConfig.params);
                }
                scope = scope ? scope : defaultScope;
                Ext.callback(invokeFnConfig.fn, scope, params);
            }
        },

        /**
         * 打开计费对话框
         * 业务如下，依次为国内国际、进港出港、计费点：
         *        国内出港账单  : D、E、MP
         *
         *        国际出港账单  : I、E、MP
         *
         *        国内进港账单  : D、I、MP
         *
         *        国际进港账单  : I、I、MP
         *
         *        提货办单国际  : I、I、DLV
         *
         *        提货办单国内  : D、I、DLV
         *
         *        出港计费国内  : D、E、EFEE
         *
         *        出港计费国际  : I、E、EFEE
         *
         *        国际进港提单  : I、I、AWD
         *
         *        国内退仓      : D、E、OWHS
         *
         *        国际退仓      : I、E、OWHS
         *
         *        国际出港--交单: I、E、DOC
         *
         *        国际进港      : I、I、IFEE
         *
         *        国内进港      : D、I、IFEE
         * 例子：
         *         PU.showFee(
         *                    {
         *                          domInt: 'I',
         *                          expImp: 'I',
         *                          bizOpe: 'IFEE',
         *                          billList: [{
         *                              billId: 'AWBA********',
         *                              curFeePcs: 100,
         *                              curFeeWt: 100
         *                          }]
         *                      }
         *                   );
         * @param {Object}
         * 参数说明： domInt： 必须，国内国际。
         *           expImp： 必须，进港出港。
         *           bizOpe:  必须，计费点。
         *           businessSeq：非必须，业务流水号。
         *           billList： 非必须，运单列表。格式如下：当前计费件数、当前计费重量如果没有指定的话，将用运单的件数、计费重量。
         *                                         [{
         *                                              billId: 完整运单号
         *                                              curFeePcs：当前计费件数
         *                                              curFeeWt：当前计费重量
         *                                         }]
         *           customerId：非必须，结算客户代码。
         *           customerName：非必须，结算客户名称。
         *           isGetNewFee：非必须，true 显示计费页、false显示已结算页面。
         */
        showFee: function (params) {
            var domInt = params.domInt,
                expImp = params.expImp,
                bizOpe = params.bizOpe,
                businessSeq = params.businessSeq,
                billList = params.billList,
                customerId = params.customerId,
                customerName = params.customerName,
                isGetNewFee = params.isGetNewFee;
            if (!(domInt && expImp && bizOpe)) {
                return;
            }
            PU.openModule({
                title: '计费',
                xtype: 'fee-chargefee-chargefeetab',
                width: 1080,
                height: 500,
                pcfg: {
                    domInt: domInt,
                    expImp: expImp,
                    bizOpe: bizOpe,
                    businessSeq: businessSeq,
                    billList: billList,
                    customerId: customerId,
                    customerName: customerName,
                    isGetNewFee: isGetNewFee
                }
            });
        }
    }
});