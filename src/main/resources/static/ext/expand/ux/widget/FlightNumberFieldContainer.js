/**
 * 航班号
 */
Ext.define('Ming.expand.ux.widget.FlightNumberFieldContainer', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'flightnumber-fieldcontainer',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'flightno-fieldCt',

    /**
     * @cfg style  table 布局时，此控件会被追加样式margin-bottom: 10px; 这里设置成0。
     * @inheritdoc
     */
    style: 'margin-bottom: 0px;',

    /**
     * @cfg layout
     * @inheritdoc
     */
    layout: {
        type: 'hbox'
    },

    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '航班号',

    /**
     * @cfg labelAlign
     * @inheritdoc
     */
    labelAlign: 'right',

    /**
     * @cfg labelSeparator
     * @inheritdoc
     */
    labelSeparator: '',

    /**
     * @cfg combineErrors
     * @inheritdoc
     */
    combineErrors: true,

    /**
     * @cfg msgTarget
     * @inheritdoc
     */
    msgTarget: 'side',

    /**
     * @cfg defaults
     * @inheritdoc
     */
    defaults: {
        hideLabel: true,
        allowBlank: false
    },

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    config: {

        /**
         * @cfg {Object} domIntHiddenTextfieldCfg
         * 国内国际
         */
        domIntHiddenTextfieldCfg: {},

        /**
         * @cfg {Object} expImpHiddenTextfieldCfg
         * 进港出港
         */
        expImpHiddenTextfieldCfg: {},

        /**
         * @cfg {Object} carrierCfg
         * 承运人代码下拉列表配置
         */
        carrierCfg: {},

        /**
         * @cfg {Object} flightNoTextfieldCfg
         * 航班号日期文本框配置
         */
        flightNoTextfieldCfg: {},

        /**
         * @cfg {Object} flightDateFieldCfg
         * 航班日期
         */
        flightDateFieldCfg: {},

        /**
         * @cfg {Object} fltFdsComboCfg
         * 航班航段下拉列表配置
         */
        fltFdsComboCfg: {},

        /**
         * @cfg {Object} hideFltFds
         * 是否隐藏航段，不隐藏航段，会查询航段。
         */
        hideFltFds: true,

        /**
         * @cfg {Object} fltFdsType
         * 不同业务航段下拉列表的配置
         */
        fltFdsType: null,

        /**
         * @cfg {Object} fltFdsType
         * 航段下拉列表选项添加 不限 选项
         */
        selectUnlimited: false,

        /**
         * @cfg {Object} eAirport
         * 航段查询成功后，如果有指定此值，则选择到达站为此值的航段，否则选择第一条。
         */
        eAirport: null
    },

    /**
     * 不同功能对应的航段下拉列表选项样式
     */
    fltFdsMap: {
        // 出港
        fdsE: {
            segment: '航段',
            aircraftTypeId: '机型',
            planeNo: '机号',
            estimatedTime: '预计起飞',
            actualTime: '实际起飞',
            fdsHaveLoadWt: '已配载重量',
            fdsHaveLoadVol: '已配载体积',
            fdsCanyes: '是否作废'
        },
        // 进港
        fdsI: {
            segment: '航段',
            aircraftTypeId: '机型',
            planeNo: '机号',
            estimatedTime: '预计降落',
            actualTime: '实际降落',
            fdsCanyes: '是否作废'
        },
        // 预配装机
        fdsEasy: {
            eAirport: '航段'
        },
        // 仅有终点站
        eAirport: {
            eAirport: '航段'
        }

    },

    initComponent: function () {
        var me = this,
            fltFdsType = me.getFltFdsType(),
            expImpHiddenTextfieldCfg = me.expImpHiddenTextfieldCfg,
            domIntHiddenTextfieldCfg = me.domIntHiddenTextfieldCfg;
        // <debug>
        if (!me.hideFltFds) {
            if (!expImpHiddenTextfieldCfg.value) {
                Ext.raise('未设置进出港。');
            }
        }
        // if (!domIntHiddenTextfieldCfg.value) {
        //    Ext.raise('未设置国内国际。');
        // }
        // </debug>

        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.carrierItemId = me.carrierCfg.itemId;
        me.flightNoTextfieldItemId = me.flightNoTextfieldCfg.itemId;
        me.flightDateFieldItemId = me.flightDateFieldCfg.itemId;
        me.fltFdsComboItemId = me.fltFdsComboCfg.itemId;
        me.domIntHiddenTextfieldItemId = me.domIntHiddenTextfieldCfg.itemId;
        me.expImpHiddenTextfielddItemId = me.expImpHiddenTextfieldCfg.itemId;

        if (!me.hideFltFds) {
            var eventOptions = {
                change: me.onSearch,
                scope: me
            };
            me.mon(me.getCarrierComponent(), eventOptions);
            me.mon(me.getFlightNoComponent(), eventOptions);
            me.mon(me.getFlightDateComponent(), {
                blur: me.onSearch,
                scope: me
            });
        }
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            flightNoTextfield,
            flightNoTextfieldPos,
            flightDateField,
            flightDateFieldPos,
            fltFdsCombo,
            fltFdsComboPos;

        me.callParent([width, height, oldWidth, oldHeight]);

        flightNoTextfield = me.getFlightNoComponent();
        flightNoTextfieldPos = flightNoTextfield.getPosition(true);
        flightNoTextfield.setPosition(flightNoTextfieldPos[0] - 0.4, flightNoTextfieldPos[1]);

        flightDateField = me.getFlightDateComponent();
        flightDateFieldPos = flightDateField.getPosition(true);
        flightDateField.setPosition(flightDateFieldPos[0] - 0.4, flightDateFieldPos[1]);

        if (!me.hideFltFds) {
            fltFdsCombo = me.getFltFdsComboComponent();
            if (fltFdsCombo) {
                fltFdsComboPos = fltFdsCombo.getPosition(true);
                fltFdsCombo.setPosition(fltFdsComboPos[0] - 0.8, fltFdsComboPos[1]);
            }
        }
    },

    /**
     * 返回承运人文本框组件
     * @return {Object}
     */
    getCarrierComponent: function () {
        var me = this;

        return me.getComponent(me.carrierItemId);
    },

    /**
     * 返回航班号组件
     * @return {Object}
     */
    getFlightNoComponent: function () {
        var me = this;

        return me.getComponent(me.flightNoTextfieldItemId);
    },

    /**
     * 返回航班日期组件
     * @return {Object}
     */
    getFlightDateComponent: function () {
        var me = this;

        return me.getComponent(me.flightDateFieldItemId);
    },

    /**
     * 返回航段组件
     * @return {Object}
     */
    getFltFdsComboComponent: function () {
        var me = this;

        return me.getComponent(me.fltFdsComboItemId);
    },

    /*
     * 查询
     */
    onSearch: function (findFltFdsFn) {
        var me = this,
            carrier,
            carrierFieldColor,
            fltFdsCombo,
            fltFdsStore,
            carrierCmp = me.getCarrierComponent(),
            flightNoCmp = me.getFlightNoComponent(),
            flightDateCmp = me.getFlightDateComponent();

        me.destroyTip();

        if (!carrierCmp.isValid() || !flightNoCmp.isValid() || !flightDateCmp.isValid()) {
            return;
        }
        var requestParams = {
            airlineId: carrierCmp.getValue(),
            domInt: me.getComponent(me.domIntHiddenTextfieldItemId).getValue(),
            expImp: me.getComponent(me.expImpHiddenTextfielddItemId).getValue(),
            flightDate: flightDateCmp.getValue(),
            flightNo: flightNoCmp.getValue()
        };

        // me.getOwnerView() && me.getOwnerView().setLoading(true);
        me.setLoading(true);
        // 当前登录用户所在航站
        requestParams.airport = cfg.sub.airportId;
        Ext.Ajax.request({
            url: UrlUtil.get('api/flt/vfltfds', 'queryfds'),
            jsonData: requestParams,
            success: function (response, opts) {
                var reponseJson = Ext.decode(response.responseText);
                if (reponseJson.success) {

                    // 承运人
                    carrier = me.getCarrierComponent();

                    // 航段下拉列表
                    fltFdsCombo = me.getFltFdsComboComponent();
                    fltFdsStore = fltFdsCombo.getStore();

                    var reponseJsonData = reponseJson.data ? reponseJson.data : null;
                    if (reponseJsonData && reponseJsonData.length > 0 && Ext.typeOf(reponseJsonData) == 'array') {
                        me.processResponseData(reponseJsonData);
                        var data = reponseJsonData[0];
                        // 预配装机或者设置不限选择,添加全部选项
                        if ((me.isFdsEasy() || me.selectUnlimited) && reponseJsonData.length > 1) {
                            reponseJsonData.unshift({
                                segment: '不限',
                                eAirport: '不限',
                                fdsrecId: 'all',
                                airlineId: data.airlineId,
                                domInt: data.domInt,
                                fdmRecId: data.fdmRecId,
                                flightDate: data.flightDate,
                                flightNo: data.flightNo
                            });
                        }
                        // 加载新的数据
                        fltFdsStore.loadData(reponseJsonData);
                        // 设置默认航段
                        if (!Ext.isFunction(findFltFdsFn)) {
                            if (me.eAirport) {
                                findFltFdsFn = function (record) {
                                    return reponseJsonData[0].eAirport == record.data.eAirport;
                                };
                            } else {
                                findFltFdsFn = function (record) {
                                    return reponseJsonData[0].fdsrecId == record.data.fdsrecId;
                                };
                            }
                        }
                        me.selectFltFds(findFltFdsFn);
                    } else {
                        // 清除航段数据
                        me.clearFltFds();
                        // carrier.focus();
                        // carrier.selectText();
                        me.showTip('该航班不存在。');
                        me.fireEvent('queryfdsresultnodata');
                    }
                    // 设置航段下拉列表的颜色
                    if (reponseJsonData && reponseJsonData.length > 1) {
                        fltFdsCombo.setFieldStyle('color: red;');
                    } else {
                        carrierFieldColor =
                            carrier.inputEl.getStyle('color');
                        fltFdsCombo.setFieldStyle('color: none;');
                    }
                } else {
                    me.showTip(reponseJson.msg);
                }
            },
            callback: function () {
                // me.getOwnerView() && me.getOwnerView().setLoading(false);
                me.setLoading(false);
            }
        });
    },

    /**
     * 清空航段数据
     */
    clearFltFds: function () {
        var me = this,
            fltFdsCombo,
            fltFdsStore;

        fltFdsCombo = me.getFltFdsComboComponent();
        fltFdsStore = fltFdsCombo.getStore();
        fltFdsStore.removeAll();
        fltFdsCombo.clearValue();
    },

    /**
     * 航段选中设置方法
     * @param {Function} 查询函数
     */
    selectFltFds: function (findFltFdsFn) {
        if (!findFltFdsFn) {
            return;
        }
        var me = this,
            fltFdsCombo,
            fltFdsStore,
            selectRecord;

        fltFdsCombo = me.getFltFdsComboComponent();
        fltFdsStore = fltFdsCombo.getStore();

        selectRecord = fltFdsStore.getAt(fltFdsStore.findBy(findFltFdsFn));
        if (selectRecord) {
            fltFdsCombo.select(selectRecord);
            fltFdsCombo.fireEvent('select', fltFdsCombo, selectRecord);
        }
    },

    /*
     * 航段下拉列表框的模板参数
     */
    getFltFdsComboXTemplateArgs: function () {
        var me = this,
            fltFdsType = me.getFltFdsType(),
            fltFdsConfig,
            templateArgs,
            thHtml = [], tdHtml = [], trHtml;

        fltFdsConfig = me.fltFdsMap[fltFdsType];
        Ext.Object.each(fltFdsConfig, function (key, value, me) {
            thHtml.push('<th>' + value + '</th>');
            tdHtml.push('<td>{' + key + '}</td>');
        });
        templateArgs = [
            '<table class="x-list-plain combo-table" style="width: 100%;">' +
            '  <tr>' +
            thHtml.join('') +
            '  </tr>' +
            '<tpl for=".">',
            '  <tr role="option" class="x-boundlist-item" ' +
            '<tpl if="fdsCanyes == \'Y\'">',
            'style="color:red!important;"',
            '</tpl>',
            '>' +
            tdHtml.join('') +
            '  </tr>',
            '</tpl>' +
            '</table>'];

        return templateArgs;
    },

    /*
     * 航段下拉列表框的displayField设置
     */
    getFltFdsComboDisplayField: function () {
        var me = this,
            fltFdsType = me.getFltFdsType(),
            displayField;

        // 预配装机航段下拉列表显示字段：eAirport
        return me.isFdsEasy() || me.fltFdsType === 'eAirport' ? 'eAirport' : 'segment';
    },

    /*
     * 航段下拉列表框过滤字段
     */
    getFilterFields: function () {
        var me = this,
            fltFdsType = me.getFltFdsType(),
            fltFdsConfig,
            filterFields = [];

        fltFdsConfig = me.fltFdsMap[fltFdsType];
        Ext.Object.each(fltFdsConfig, function (key, value, me) {
            filterFields.push(key);
        });

        return filterFields;
    },
    /**
     * 在查询按钮上显示提示信息
     */
    showTip: function (msg) {
        var me = this,
            tip = me.tip;
        if (!tip) {
            tip = me.tip = Ext.widget('tooltip', {
                target: me.getFltFdsComboComponent().el,
                minWidth: 200,
                autoHide: true,
                anchor: 'top',
                mouseOffset: [-11, -2],
                closable: true,
                constrainPosition: false,
                autoDestroy: true,
                autoShow: false,
                hideDelay: 400,
                dismissDelay: 2000,
                listeners: {
                    destroy: function () {
                        me.tip = null;
                    },
                    hide: me.onTipHide.bind(me)
                }
            });
        }
        tip.update(msg);
        tip.show();
    },

    /**
     * 隐藏提示信息后，销毁tip
     */
    onTipHide: function (tip, eOpts) {
        var me = this;
        me.destroyTip();
    },

    /**
     * 销毁查询按钮上的提示信息，隐藏loadingmask去掉的时候会自动显示。
     */
    destroyTip: function (msg) {
        var me = this,
            tip = me.tip;
        if (tip) {
            tip.destroy();
        }
    },

    /**
     * 判断是否是预配装机，预配装机显示有些特殊处理。
     */
    isFdsEasy: function () {
        var me = this;

        return me.getFltFdsType() === 'fdsEasy';
    },

    /**
     * showToast
     */
    showToast: function (message) {
        Ext.toast({
            html: message,
            closable: false,
            align: 't',
            slideDUration: 400,
            maxWidth: 400
        });
    },

    /*
    * 处理返回的数据
    */
    processResponseData: function (reponseJsonData) {
        var me = this,
            domIntHiddenTextfieldValue = me.getComponent(me.domIntHiddenTextfieldItemId).getValue();

        Ext.Array.each(reponseJsonData, function (element, index) {
            element.segment = element.sAirport + '-' + element.eAirport;
            if (domIntHiddenTextfieldValue == 'I') {
                element.estimatedTime = element.eTimePre ? element.eTimePre : element.eTimePlan;
                element.actualTime = element.eTime;
            } else if (domIntHiddenTextfieldValue == 'E') {
                element.estimatedTime = element.sTimePre ? element.sTimePre : element.sTimePlan;
                element.actualTime = element.sTime;
            }
            if (element.estimatedTime) {
                element.estimatedTime = Ext.Date.format(new Date(element.estimatedTime), 'H:i');
            }
            if (element.actualTime) {
                element.actualTime = Ext.Date.format(new Date(element.actualTime), 'H:i');
            }
        });
    },

    /*
     * 验证航班号
     */
    flightNoValidator: function (val) {
        var me = this,
            flightNoCmp = me.getFlightNoComponent();
        if (flightNoCmp.allowBlank && val == '') {
            return true;
        }
        return (/^[0-9]{3,4}$/.test(val) || /^[0-9]{4}[a-zA-Z]$/.test(val)) ? true : '该输入项为3到5位。3至4位为数字，5位时最后一位为字母。';
    },

    /**
     * 验证控件所有输入项，是否有效。
     * @return {boolean}
     */
    validate: function () {
        var me = this;
        if (me.getCarrierComponent().validate() &&
            me.getFlightNoComponent().validate() &&
            me.getFlightDateComponent().validate()) {
            return true;
        }

        return false;
    },

    /**
     * 控件赋值。可能会查询航段，设置要默认选择的航段。
     */
    setData: function (carrier, flightNo, flightDate, eAirport) {
        var me = this,
            carrierCmp = me.getCarrierComponent(),
            flightNoCmp = me.getFlightNoComponent(),
            flightDateCmp = me.getFlightDateComponent();
        carrierCmp.setValue(carrier);
        flightNoCmp.setValue(flightNo);
        flightDateCmp.setValue(flightDate);
        if (me.validate() && eAirport) {
            me.onSearch(
                function (record) {
                    return eAirport == record.data.eAirport;
                }
            );
        }
    },

    /**
     * 日期选择后，调用日期文本框的setValue方法，以便触发change事件。
     */
    onDatePicked: function (dp) {
        var me = this;
        me.getFlightDateComponent().setValue(dp.cal.getNewDateStr());
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            carrierCfg,
            flightNoTextfieldCfg,
            flightDateFieldCfg,
            fltFdsComboCfg,
            domIntHiddenTextfieldCfg,
            expImpHiddenTextfieldCfg;

        me.carrierCfg = carrierCfg = Ext.merge({
            xtype: 'carrier',
            itemId: 'flightno-carrier',
            forceSelection: false,
            width: 58,
            enableKeyEvents: true,
            blurUppercase: true
        }, me.carrierCfg);

        me.flightNoTextfieldCfg = flightNoTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'flightNo',
            itemId: 'flightno-flightNoTextfield',
            fieldLabel: '航班号',
            width: 56,
            allowBlank: false,
            minLength: 3,
            maxLength: 5,
            validator: me.flightNoValidator.bind(me),
            enforceMaxLength: true,
            listeners: {}
        }, me.flightNoTextfieldCfg);

        me.flightDateFieldCfg = flightDateFieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'flightDate',
            itemId: 'flightno-flightDateField',
            fieldLabel: '航班日期',
            width: 124,
            allowBlank: false,
            inputCls: 'Wdate',
            value: CU.getDate(),
            listeners: {
                render: function (p) {
                    p.inputEl.mon(p.inputEl, 'click', function () {
                        var me = this;
                        if (p.readOnly || me.readOnlyAll) {
                            return;
                        }
                        WdatePicker({
                            el: p.getInputId()
                        });
                    }, me);
                }
            }
        }, me.flightDateFieldCfg);

        me.domIntHiddenTextfieldCfg = domIntHiddenTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'domInt',
            itemId: 'flightno-domIntHiddenTextfield',
            fieldLabel: '国内国际',
            hidden: true,
            allowBlank: true,
            isFormField: false
        }, me.domIntHiddenTextfieldCfg);

        me.expImpHiddenTextfieldCfg = expImpHiddenTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'expImp',
            itemId: 'flightno-expImpHiddenTextfield',
            fieldLabel: '进港出港',
            hidden: true,
            allowBlank: true,
            isFormField: false
        }, me.expImpHiddenTextfieldCfg);

        me.fltFdsComboCfg = fltFdsComboCfg = Ext.merge({
            xtype: 'customcombo',
            name: 'fdsrecId',
            itemId: 'flightno-fltFdsCombo',
            queryMode: 'local',
            isFormField: true,
            forceSelection: true,
            allowBlank: true,
            displayField: me.getFltFdsComboDisplayField(),
            valueField: 'fdsrecId',
            matchFieldWidth: false,
            anyMatch: true,
            caseSensitive: false,
            dock: 'top',
            autoSelect: true,
            tabIndex: -1,
            width: 106,
            store: {
                fields: [
                    {name: 'segment', type: 'string'},
                    {name: 'sAirport', type: 'string'},
                    {name: 'eAirport', type: 'string'},
                    {name: 'aircraftTypeId', type: 'string'},
                    {name: 'planeNo', type: 'string'},
                    {name: 'estimatedTime', type: 'string'},
                    {name: 'actualTime', type: 'string'},
                    {name: 'fdsHaveLoadWt', type: 'number'},
                    {name: 'fdsHaveLoadVol', type: 'number'},
                    {name: 'fdsCanyes', type: 'string'}
                ]
            },
            listeners: {},
            filterFields: me.getFilterFields()
        }, me.fltFdsComboCfg);

        // Template for the dropdown menu.
        // Note the use of the "x-list-plain" and "x-boundlist-item" class,
        // this is required to make the items selectable.
        if (!me.getFltFdsType()) {
            me.setFltFdsType('eAirport');
        }
        if (me.fltFdsMap[me.getFltFdsType()]) {
            fltFdsComboCfg.tpl = Ext.create('Ext.XTemplate',
                me.getFltFdsComboXTemplateArgs()
            );
        }

        items = [
            carrierCfg,
            flightNoTextfieldCfg,
            flightDateFieldCfg,
            domIntHiddenTextfieldCfg,
            expImpHiddenTextfieldCfg
        ];
        if (!me.hideFltFds) {
            items.push(fltFdsComboCfg);
        }

        return items;
    }
});