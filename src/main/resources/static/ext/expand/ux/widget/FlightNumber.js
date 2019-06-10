/**
 * 航班号组件（默认reference值：flightnumber）
 *
 * 配置项fltFdsType必须指定。不同业务航段下拉列表的配置。
 * 进港出港（expImpHiddenTextfieldCfg）的value值必须指定
 *
 * 航段查询：onSearchClick
 * 航段选中：selectFltFds
 * 清空航段：clearFltFds
 * 重置表单并清空航段：clear
 *
 * 航段切换自定义事件：selectsegment
 *
 */
Ext.define('Ming.expand.ux.widget.FlightNumber', {
    extend: 'Ext.form.Panel',
    xtype: 'flightnumber',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'flightnumber',

    /**
     * @cfg width
     * @inheritdoc
     */
    // width: 600,

    /**
     * @cfg height
     * @inheritdoc
     */
    height: 40,

    /**
     * @cfg padding
     * @inheritdoc
     */
    padding: '7.5 0 7.5 0',

    layout: {
        type: 'hbox'
    },

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    /**
     * @cfg keyMap
     * @inheritdoc
     */
    keyMap: {
        scope: 'this',
        ENTER: 'onFormPanelEnterKey'
    },

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
         * @cfg {Object} owner
         * 保存父视图的引用
         */
        ownerView: null,

        /**
         * @cfg {Object} fieldCtCfg
         * 表单字段容器fieldcontainer配置
         */
        fieldCtCfg: {},

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
         * @cfg {Object} searchBtnCfg
         * 查询按钮
         */
        searchBtnCfg: {},

        /**
         * @cfg {Object} aircraftTypeIdPanelCfg
         * 机型panel
         */
        aircraftTypeIdPanelCfg: {},

        /**
         * @cfg {Object} planeNoPanelCfg
         * 飞机号panel
         */
        planeNoPanelCfg: {},

        /**
         * @cfg {Object} estimatedTimePanelCfg
         * 预计时间panel
         */
        estimatedTimePanelCfg: {},

        /**
         * @cfg {Object} actualTimePanelCfg
         * 实际时间panel
         */
        actualTimePanelCfg: {},

        /**
         * @cfg {Object} hideFieldCtLabel
         * 是否隐藏表单字段容器的标签
         */
        hideFieldCtLabel: true,

        /**
         * @cfg {Object} hideFltFdsCombo
         * 是否隐藏航段
         */
        hideFltFds: false,

        /**
         * @cfg {Object} fltFdsType
         * 不同业务航段下拉列表的配置
         */
        fltFdsType: null,

        /**
         * @cfg {Object} fltFdsType
         * 航段下拉列表选项添加 不限 选项
         */
        selectUnlimited: false
    },

    /**
     * 不同功能对应的航段下拉列表选项样式
     */
    fltFdsMap: {
        // 出港
        fdsE: {
            segment: '航段',
            // aircraftTypeId: '机型',
            // planeNo: '机号',
            // estimatedTime: '预计起飞',
            // actualTime: '实际起飞',
            fdsHaveLoadWt: '已配载重量',
            fdsHaveLoadVol: '已配载体积',
            fdsCanyes: '是否作废'
        },
        // 进港
        fdsI: {
            segment: '航段',
            // aircraftTypeId: '机型',
            // planeNo: '机号',
            // estimatedTime: '预计降落',
            // actualTime: '实际降落',
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
        if (!expImpHiddenTextfieldCfg.value) {
            Ext.raise('未设置进出港。');
        }
        // if (!domIntHiddenTextfieldCfg.value) {
        //    Ext.raise('未设置国内国际。');
        // }
        // </debug>

        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.fieldCtItemId = me.fieldCtCfg.itemId;
        me.carrierItemId = me.carrierCfg.itemId;
        me.flightNoTextfieldItemId = me.flightNoTextfieldCfg.itemId;
        me.flightDateFieldItemId = me.flightDateFieldCfg.itemId;
        me.fltFdsComboItemId = me.fltFdsComboCfg.itemId;
        me.fltFdsDetailItemId = me.fltFdsDetailCfg.itemId;
        me.aircraftTypeIdPanelItemId = me.aircraftTypeIdPanelCfg.itemId;
        me.planeNoPanelItemId = me.planeNoPanelCfg.itemId;
        me.estimatedTimePanelItemId = me.estimatedTimePanelCfg.itemId;
        me.actualTimePanelItemId = me.actualTimePanelCfg.itemId;
        me.searchBtnItemId = me.searchBtnCfg.itemId;
        me.domIntHiddenTextfieldItemId = me.domIntHiddenTextfieldCfg.itemId;
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

        fltFdsCombo = me.getFltFdsComboComponent();
        if (fltFdsCombo) {
            fltFdsComboPos = fltFdsCombo.getPosition(true);
            fltFdsCombo.setPosition(fltFdsComboPos[0] - 0.8, fltFdsComboPos[1]);
        }
    },

    /**
     * 返回fieldcontainer组件
     * @return {Object}
     */
    getFieldCtComponent: function () {
        var me = this;
        return me.getComponent(me.fieldCtItemId);
    },

    /**
     * 返回承运人文本框组件
     * @return {Object}
     */
    getCarrierComponent: function () {
        var me = this;

        return me.getFieldCtComponent().getComponent(me.carrierItemId);
    },

    /**
     * 返回航班号组件
     * @return {Object}
     */
    getFlightNoComponent: function () {
        var me = this;

        return me.getFieldCtComponent().getComponent(me.flightNoTextfieldItemId);
    },

    /**
     * 返回航班日期组件
     * @return {Object}
     */
    getFlightDateComponent: function () {
        var me = this;

        return me.getFieldCtComponent().getComponent(me.flightDateFieldItemId);
    },

    /**
     * 返回航段组件
     * @return {Object}
     */
    getFltFdsComboComponent: function () {
        var me = this;

        return me.getFieldCtComponent().getComponent(me.fltFdsComboItemId);
    },

    /**
     * 按下ENTER键时，执行查询操作。
     */
    onFormPanelEnterKey: function (event) {
        var me = this,
            fltFdsComboElId = me.getFltFdsComboComponent().inputEl.id;
        if (event.target.id === fltFdsComboElId) {
            return;
        }
        me.onSearchClick();
    },

    /*
     * 查询
     */
    onSearchClick: function () {
        var me = this,
            carrier,
            carrierFieldColor,
            fltFdsCombo,
            fltFdsStore,
            searchBtn;

        me.destroyTip();
        var form = me.getForm();
        if (form.isValid()) {
            // me.getOwnerView() && me.getOwnerView().setLoading(true);
            searchBtn = me.getComponent(me.searchBtnItemId);
            searchBtn.setLoading(true);
            var requestFormValues = form.getValues();
            // 当前登录用户所在航站
            requestFormValues.airport = cfg.sub.airportId;
            Ext.Ajax.request({
                url: UrlUtil.get('api/flt/vfltfds', 'queryfds'),
                jsonData: Ext.encode(requestFormValues),
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
                            // 加载新的数据，默认选择第一项
                            fltFdsStore.loadData(reponseJsonData);
                            me.selectFltFds(reponseJsonData[0].fdsrecId);
                        } else {
                        	//logo变大
							var imgLength = Ext.query(".x-img.x-img-default");
							var panelLength = Ext.query(".x-panel.fligth.x-panel-default .x-autocontainer-innerCt");
							for(var i = 0; i < imgLength.length; i++) {
								imgLength[i].className=imgLength[i].className.replace("h12","");
								panelLength[i].className=panelLength[i].className.replace("h12","");  
							};
                            // 清除航段数据
                            me.clearFltFds();
                            carrier.focus();
                            carrier.selectText();
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
                    searchBtn.setLoading(false);
                }
            });
        }
    },

    /**
     * 清空航段数据
     */
    clearFltFds: function () {
        var me = this,
            fltFdsCombo,
            fltFdsStore,
            fltFdsDetailCmp = me.getComponent(me.fltFdsDetailItemId);

        fltFdsCombo = me.getFltFdsComboComponent();
        fltFdsStore = fltFdsCombo.getStore();
        fltFdsStore.removeAll();
        fltFdsCombo.clearValue();

        fltFdsDetailCmp.getComponent(me.aircraftTypeIdPanelItemId).setHtml('');
        fltFdsDetailCmp.getComponent(me.planeNoPanelItemId).setHtml('');
        fltFdsDetailCmp.getComponent(me.estimatedTimePanelItemId).setHtml('');
        fltFdsDetailCmp.getComponent(me.actualTimePanelItemId).setHtml('');

        fltFdsDetailCmp.getComponent(me.estimatedTimePanelItemId + '-img').setStyle('color', null);
        fltFdsDetailCmp.getComponent(me.actualTimePanelItemId + '-img').setStyle('color', null);
    },

    /**
     * 重置表单，清空数据
     */
    clear: function () {
        var me = this;
        me.reset();
        me.clearFltFds();
    },

    /**
     * 航段选中设置方法
     * @param {String/int} 航段id号
     */
    selectFltFds: function (fdsrecId) {
        if (!fdsrecId) {
            return;
        }
        var me = this,
            fltFdsCombo,
            fltFdsStore,
            selectRecord;

        fltFdsCombo = me.getFltFdsComboComponent();
        fltFdsStore = fltFdsCombo.getStore();

        selectRecord = fltFdsStore.findRecord('fdsrecId', fdsrecId);
        if (selectRecord) {
            fltFdsCombo.select(selectRecord);
            fltFdsCombo.fireEvent('select', fltFdsCombo, selectRecord);
        }
    },

    /*
     * 当选择的航班航段发生变化时的处理
     */
    onFltFdsSelect: function (combo, record, eOpts) {
        var me = this,
            recordData,
            estimatedTimePanel,
            actualTimePanel,
            estimatedTimeImg,
            actualTimeImg,
            estimatedTime,
            actualTime,
            planeNoImg,
            planeNo,
            fltFdsDetailCmp = me.getComponent(me.fltFdsDetailItemId);
        recordData = record.getData();
        fltFdsDetailCmp.getComponent(me.aircraftTypeIdPanelItemId).setHtml(recordData.aircraftTypeId);
        planeNo = recordData.planeNo;
        fltFdsDetailCmp.getComponent(me.planeNoPanelItemId).setHtml(planeNo);

        planeNoImg = me.getComponent(me.planeNoPanelItemId + '-img');
        Ext.create('Ext.tip.ToolTip', {
            target: planeNoImg,
            html: planeNo
        });

        estimatedTimePanel = fltFdsDetailCmp.getComponent(me.estimatedTimePanelItemId);
        actualTimePanel = fltFdsDetailCmp.getComponent(me.actualTimePanelItemId);
        estimatedTimeImg = fltFdsDetailCmp.getComponent(me.estimatedTimePanelItemId + '-img');
        actualTimeImg = fltFdsDetailCmp.getComponent(me.actualTimePanelItemId + '-img');
        estimatedTime = recordData.estimatedTime;
        actualTime = recordData.actualTime;

        estimatedTimePanel.setHtml(estimatedTime);
        actualTimePanel.setHtml(actualTime);

        if (estimatedTime) {
            estimatedTimeImg.setStyle('color', '#F2B030');
        } else {
            estimatedTimeImg.setStyle('color', null);
        }
        if (actualTime) {
            actualTimeImg.setStyle('color', '#F2B030');
        } else {
            actualTimeImg.setStyle('color', null);
        }

        // 触发航段切换自定义事件
        combo.fireEvent('selectsegment', combo, record, eOpts, recordData.fdsrecId);
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
                target: me.getComponent(me.searchBtnItemId).el,
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
            domIntHiddenTextfieldValue = me.getFieldCtComponent().getComponent(me.domIntHiddenTextfieldItemId).getValue();
		//更改logo大小。
		var imgLength = Ext.query(".x-img.x-img-default");
		var panelLength = Ext.query(".x-panel.fligth.x-panel-default .x-autocontainer-innerCt");
		for(var i = 0; i < imgLength.length; i++) {
			if(imgLength[i].className.indexOf("h12")!=-1){
				  break; 
			};
			imgLength[i].className+=' h12';
			Ext.query(".x-panel.fligth.x-panel-default")[i].className+=" h12";
			Ext.query(".x-panel.fligth.x-panel-default .x-panel-body-default")[i].className+=" h12";
			panelLength[i].className+=' h12';  
		};
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
                element.estimatedTime = Ext.Date.format(new Date(Date.parse(element.estimatedTime.replace(/-/g, '/'))), 'H:i');
            }
            if (element.actualTime) {
                element.actualTime = Ext.Date.format(new Date(Date.parse(element.actualTime.replace(/-/g, '/'))), 'H:i');
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

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            fieldCtCfg,
            carrierCfg,
            flightNoTextfieldCfg,
            flightDateFieldCfg,
            fltFdsComboCfg,
            fieldCtItems,
            domIntHiddenTextfieldCfg,
            expImpHiddenTextfieldCfg,
            searchBtnCfg,
            fltFdsDetailCfg,
            aircraftTypeIdPanelCfg,
            planeNoPanelCfg,
            estimatedTimePanelCfg,
            actualTimePanelCfg;

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
            allowOnlyWhitespace: false,
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
                    p.getEl().on('click', function () {
                        WdatePicker({
                            el: p.getInputId()
                        });
                    });
                }
            }
        }, me.flightDateFieldCfg);

        me.domIntHiddenTextfieldCfg = domIntHiddenTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'domInt',
            itemId: 'flightno-domIntHiddenTextfield',
            fieldLabel: '国内国际',
            hidden: true,
            allowBlank: true
        }, me.domIntHiddenTextfieldCfg);

        me.expImpHiddenTextfieldCfg = expImpHiddenTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'expImp',
            itemId: 'flightno-expImpHiddenTextfield',
            fieldLabel: '进港出港',
            hidden: true,
            allowBlank: false
        }, me.expImpHiddenTextfieldCfg);

        me.fltFdsComboCfg = fltFdsComboCfg = Ext.merge({
            xtype: 'customcombo',
            name: 'fltFds',
            itemId: 'flightno-fltFdsCombo',
            queryMode: 'local',
            isFormField: false,
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
            listeners: {
                select: me.onFltFdsSelect.bind(me)
            },
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

        fieldCtItems = [
            carrierCfg,
            flightNoTextfieldCfg,
            flightDateFieldCfg,
            domIntHiddenTextfieldCfg,
            expImpHiddenTextfieldCfg,
            fltFdsComboCfg
        ];
        if (me.getHideFltFds()) {
            fieldCtItems.pop();
        }
        me.fieldCtCfg = fieldCtCfg = Ext.merge({
            xtype: 'fieldcontainer',
            itemId: 'flightno-fieldCt',
            layout: {
                type: 'hbox'
            },
            fieldLabel: '航班号',
            labelAlign: 'left',
            hideLabel: me.getHideFieldCtLabel(),
            labelSeparator: '',
            combineErrors: true,
            msgTarget: 'side',
            labelWidth: 48,
            margin: '0 0 0 20',
            defaults: {
                hideLabel: true,
                allowBlank: false
            },
            items: fieldCtItems
        }, me.fieldCtCfg);

        me.searchBtnCfg = searchBtnCfg = Ext.merge({
            xtype: 'button',
            text: '查询',
            itemId: 'flightno-searchBtn',
            margin: '0 10',
            listeners: {
                click: me.onSearchClick.bind(me)
            },
            disabled: true,
            formBind: true
        }, me.searchBtnCfg);

        me.aircraftTypeIdPanelCfg = aircraftTypeIdPanelCfg = Ext.merge({
            xtype: 'panel',
            itemId: 'flightno-aircraftTypeIdPanel',
            cls:'fligth'
        }, me.aircraftTypeIdPanelCfg);

        me.planeNoPanelCfg = planeNoPanelCfg = Ext.merge({
            xtype: 'panel',
            itemId: 'flightno-planeNoPanel',
            width: 48,
            cls:'fligth'
        }, me.planeNoPanelCfg);

        me.estimatedTimePanelCfg = estimatedTimePanelCfg = Ext.merge({
            xtype: 'panel',
            itemId: 'flightno-estimatedTimePanel',
            cls:'fligth'
        }, me.estimatedTimePanelCfg);

        me.actualTimePanelCfg = actualTimePanelCfg = Ext.merge({
            xtype: 'panel',
            itemId: 'flightno-actualTimePanel',
            cls:'fligth'
        }, me.actualTimePanelCfg);

        me.fltFdsDetailCfg = fltFdsDetailCfg = {
            xtype: 'panel',
            itemId: 'flightno-fltFdsDetail',
            layout: {
                type: 'table',
                columns: 4,
                tableAttrs: {
                    style: {
                        width: '30px'
                    }
                }
            },
            defaults: {
                width: 36,
                height: 0,
                style: {
                    'text-align': 'center',
                    color: 'gray'
                }
            },
            items: [
                {
                    xtype: 'image',
                    itemId: me.aircraftTypeIdPanelCfg.itemId + '-img',
                    glyph: 'xf072@FontAwesome',
                    cls: 'h25'
                }, {
                    xtype: 'image',
                    itemId: me.planeNoPanelCfg.itemId + '-img',
                    glyph: 'xf072@FontAwesome',
                    width: 48,
                    cls: 'h25'
                }, {
                    xtype: 'image',
                    itemId: me.estimatedTimePanelCfg.itemId + '-img',
                    glyph: 'xf017@FontAwesome',
                    cls: 'h25'
                }, {
                    xtype: 'image',
                    itemId: me.actualTimePanelCfg.itemId + '-img',
                    glyph: 'xf017@FontAwesome',
                    cls: 'h25'
                },
                aircraftTypeIdPanelCfg,
                planeNoPanelCfg,
                estimatedTimePanelCfg,
                actualTimePanelCfg
            ]
        };

        items = [
            fieldCtCfg,
            searchBtnCfg,
            fltFdsDetailCfg
        ];

        if (me.getHideFltFds()) {
            items = items.slice(0, 1);
        }

        return items;
    }
});