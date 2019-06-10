Ext.define('Ming.utils.WidgetConfig', {
    alternateClassName: 'WidgetConfig',
    singleton: true,

    /*
     * 自定义组件用的store的配置
     */
    getStoreConfigMap: function () {
        return {
            // 航空公司
            carrier: {
                fields: [
                    {name: 'carrierId'},
                    {name: 'stockpre'},
                    {name: 'carrierDescChn'},
                    {name: 'carrierShortNameChn'},
                    {name: 'carrierDescEng'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'CARRIER'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 单证类型配置
            stocktype: {
                fields: [
                    {name: 'stockTypeId'},
                    {name: 'dsc'},
                    {name: 'busiType'},
                    {name: 'domInt'},
                    {name: 'checkWay'},
                    {name: 'checkConfig'},
                    {name: 'stockctlPre'},
                    {name: 'actstockPreLen'},
                    {name: 'actstockPre'},
                    {name: 'actstockNoLen'},
                    {name: 'transportYes'},
                    {name: 'storeYes'},
                    {name: 'hayes'},
                    {name: 'isEmpty'},
                    {name: 'prenoInit'},
                    {name: 'chtyes'},
                    {name: 'fillZero'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'STOCK_TYPE'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 品名
            cargoSort: {
                fields: [
                    {name: 'cargoSort'},
                    {name: 'sortNm'},
                    {name: 'esortNm'},
                    {name: 'dsc'},
                    {name: 'expFlag'},
                    {name: 'impFlag'},
                    {name: 'specId'},
                    {name: 'domFlag'},
                    {name: 'intFlag'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'CARGO_SORT'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 集控器
            uldType: {
                fields: [
                    {name: 'uldType'},
                    {name: 'appType'},
                    {name: 'pc'},
                    {name: 'tareWeight'},
                    {name: 'maxLoadWeight'},
                    {name: 'aircraftTypes'},
                    {name: 'freqordering'},
                    {name: 'ctrCode'},
                    {name: 'isToFlt'},
                    {name: 'isLoadone'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'ULD_TYPE'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 仓库
            warehouse: {
                fields: [
                    {name: 'warehouseid'},
                    {name: 'warehousename'},
                    {name: 'opedepartmentid'},
                    {name: 'opeDepShortNm'},
                    {name: 'opeDepName'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'WAREHOUSE'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 库位
            warehouseLocation: {
                fields: [
                    {name: 'warehouseId'},
                    {name: 'locationId'},
                    {name: 'locationName'},
                    {name: 'locationType'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'WAREHOUSE_LOCATION'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 特货代码
            specialCode: {
                fields: [
                    {name: 'specopeId'},
                    {name: 'isDanger'},
                    {name: 'dsc'},
                    {name: 'edsc'},
                    {name: 'cargoCraftOnly'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'SPEC_OPE_CLS'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 代理人
            customer: {
                fields: [
                    {name: 'customerId'},
                    {name: 'customerType'},
                    {name: 'cityId'},
                    {name: 'customerNameChn'},
                    {name: 'customerNameEng'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/base/cuscustomer', 'listCusCustomer'),
                    paramsAsJson: true,
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 包装
            packInfo: {
                fields: [
                    {name: 'packId'},
                    {name: 'dsc'},
                    {name: 'eDesc'},
                    {name: 'forkNum'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'PACKINFO'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 机场
            airport: {
                fields: [
                    {name: 'airportId'},
                    {name: 'airportDescchn'},
                    {name: 'cityDescChn'},
                    {name: 'areaDescChn'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'AIRPORT'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 根据航空公司获取运单号前缀
            carrierQuery: {
                fields: [
                    {name: 'stockpre'}
                ],
                autoLoad: true,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'CARRIER_QUERY'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 板箱类型为T类型默认承运人
            uldTypeIst: {
                fields: [
                    {name: 'configValue'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'BAS_CONFIG',
                        paramMap: {
                            configId: 'ULDTYPE_IST'
                        }
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 城市
            city: {
                fields: [
                    {name: 'cityId'},
                    {name: 'standard'},
                    {name: 'cityDescChn'},
                    {name: 'cityDescEng'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'CITY'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 国家
            country: {
                fields: [
                    {name: 'countryId'},
                    {name: 'continent'},
                    {name: 'countryDescChn'},
                    {name: 'countryDescEng'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'COUNTRY'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 营业点
            opeDepartment: {
                fields: [
                    {name: 'opeDepartId'},
                    {name: 'opeDepShortNm'},
                    {name: 'opeDepName'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'OPE_DEPARTMENT'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },

            // 不正常类型
            abnType: {
                fields: [
                    {name: 'abnType'},
                    {name: 'nameChn'},
                    {name: 'nameEng'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'ABN_TYPE'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 经办人
            introduceMan: {
                fields: [
                    {name: 'customerId'},
                    {name: 'pickName'},
                    {name: 'pickId'},
                    {name: 'awbPick'},
                    {name: 'cargoPick'},
                    {name: 'pickTel'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'INTRODUCE_MAN'
                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            },
            // 同营业点用户
            opeDeptUsers: {
                fields: [
                    {name: 'userid'},
                    {name: 'username'},
                    {name: 'opeDepName'}
                ],
                autoLoad: false,
                proxy: {
                    type: 'api',
                    url: UrlUtil.get('api/dynamicdict', 'list'),
                    paramsAsJson: true,
                    extraParams: {
                        code: 'OPE_DEPARTMENT_USERS'

                    },
                    actionMethods: {
                        read: 'POST'
                    },
                    reader: {
                        type: 'json',
                        rootProperty: 'data',
                        messageProperty: 'msg'
                    }
                }
            }
        };
    },

    /*
     * 自定义下拉列表框显示的模板配置
     */
    getComboXTemplateArgsMap: function () {
        return {
            // 航空公司
            carrier: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>运单前缀</th><th>中文名称</th><th>英文名称</th><th>简称</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{carrierId}</td><td>{stockpre}</td><td>{carrierDescChn}</td><td>{carrierDescEng}</td><td>{carrierShortNameChn}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 航站
            airport: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>中文名称</th><th>区域</th><th>城市</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{airportId}</td><td>{airportDescchn}</td><td>{areaDescChn}</td><td>{cityDescChn}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 品名
            cargoSort: [],

            // 代理人
            customer: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>类型</th><th>类型描述</th><th>城市</th><th>中文名称</th><th>英文名称</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{customerId}</td><td>{customerType}</td><td>{typeDesc}</td><td>{cityId}</td><td>{customerNameChn}</td><td>{customerNameEng}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 集控器
            uldType: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>应用类型</th>' +
                '  </tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{uldType}</td><td>{appType}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'
            ],

            // 城市
            city: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>是否标准代码</th><th>城市</th><th>英文名称</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{cityId}</td><td>{standard}</td><td>{cityDescChn}</td><td>{cityDescEng}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 国家
            country: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>大陆</th><th>中文名称</th><th>英文名称</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{countryId}</td><td>{continent}</td><td>{countryDescChn}</td><td>{countryDescEng}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 经办人
            introduceMan: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>客户代码</th><th>经办人</th><th>经办人身份证号码</th><th>是否允许提单</th><th>是否允许提货</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{customerId}</td><td>{pickName}</td><td>{pickId}</td><td>{awbPick}</td><td>{cargoPick}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 不正常类型
            abnType: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>类型</th><th>中文名称</th><th>英文名称</th>' +
                '</tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{abnType}</td><td>{nameChn}</td><td>{nameEng}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'],

            // 仓库
            warehouse: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>名称</th><th>营业点简称</th><th>营业点名称</th>' +
                '  </tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{warehouseId}</td><td>{warehouseName}</td><td>{opeDepShortNm}</td><td>{opeDepName}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'
            ],

            // 库位
            warehouseLocation: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>名称</th>' +
                '  </tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{locationId}</td><td>{locationName}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'
            ],

            // 营业点
            opeDepartment: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>营业点</th><th>简称</th><th>名称</th>' +
                '  </tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{opeDepartId}</td><td>{opeDepShortNm}</td><td>{opeDepName}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'
            ],

            // 同营业点用户
            opeDeptUsers: [
                '<table class="x-list-plain combo-table">' +
                '  <tr>' +
                '    <th>代码</th><th>名称</th><th>营业点名称</th>' +
                '  </tr>' +
                '<tpl for=".">',
                '  <tr role="option" class="x-boundlist-item">' +
                '    <td>{userid}</td><td>{username}</td><td>{opeDepName}</td>' +
                '  </tr>',
                '</tpl>' +
                '</table>'
            ]
        };
    }

});