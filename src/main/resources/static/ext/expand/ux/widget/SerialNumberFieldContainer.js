/**
 * 流水号
 */
Ext.define('Ming.expand.ux.widget.SerialNumberFieldContainer', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'serialnumber-fieldcontainer',

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'serialnumber-fieldCt',

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
    fieldLabel: '流水号',

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
        hideLabel: true
    },

    /**
     * @cfg scrollable
     * @inheritdoc
     */
    scrollable: false,

    config: {

        /**
         * @cfg {Object} dateFieldCfg
         * 日期
         */
        dateFieldCfg: {},

        /**
         * @cfg {Object} userIdTextfieldCfg
         * 用户代码文本框配置
         */
        userIdTextfieldCfg: {},

        /**
         * @cfg {Object} serialNoTextfieldCfg
         * 流水号文本框配置
         */
        serialNoTextfieldCfg: {},

        /**
         * @cfg {Object} readOnlyAll
         * 设置运单号相关的控件为只读
         */
        readOnlyAll: false,

        /**
         * @cfg {Object} initValue
         * 控件初始化值
         */
        initValue: undefined
    },

    initComponent: function () {
        var me = this,
            serialNoTextfield;
        // <debug>
        // if (!expImpHiddenTextfieldCfg.value) {
        //     Ext.raise('未设置进出港。');
        // }
        // if (!domIntHiddenTextfieldCfg.value) {
        //    Ext.raise('未设置国内国际。');
        // }
        // </debug>

        // 设置组件
        me.items = me.makeItems();
        me.callParent();

        me.dateFieldItemId = me.dateFieldCfg.itemId;
        me.userIdTextfieldItemId = me.userIdTextfieldCfg.itemId;
        me.serialNoTextfieldItemId = me.serialNoTextfieldCfg.itemId;

        serialNoTextfield = me.getSerialNoCmp();
        serialNoTextfield.on('blur', me.onSerialNoTextfieldBlur, me);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        me.getDateCmp().inputEl.on('click', function () {
            var me = this,
                dateCmp = me.getDateCmp();
            if (dateCmp.readOnly || me.readOnlyAll) {
                return;
            }
            WdatePicker({
                el: dateCmp.getInputId(),
                dateFmt: 'yyyyMMdd'
            });
        }, me);

        if (me.initValue) {
            me.setSerialNumber(me.initValue);
        }
    },

    afterComponentLayout: function (width, height, oldWidth, oldHeight) {
        var me = this,
            serialNoTextfield,
            serialNoTextfieldPos,
            dateField,
            dateFieldPos;

        me.callParent([width, height, oldWidth, oldHeight]);

        serialNoTextfield = me.getSerialNoCmp();
        serialNoTextfieldPos = serialNoTextfield.getPosition(true);
        serialNoTextfield.setPosition(serialNoTextfieldPos[0] - 0.4, serialNoTextfieldPos[1]);

        dateField = me.getDateCmp();
        dateFieldPos = dateField.getPosition(true);
        dateField.setPosition(dateFieldPos[0] - 0.4, dateFieldPos[1]);
    },

    /**
     * 返回日期组件
     * @return {Object}
     */
    getDateCmp: function () {
        var me = this;

        return me.getComponent(me.dateFieldItemId);
    },

    /**
     * 返回用户组件
     * @return {Object}
     */
    getUserIdCmp: function () {
        var me = this;

        return me.getComponent(me.userIdTextfieldItemId);
    },

    /**
     * 返回流水号组件
     * @return {Object}
     */
    getSerialNoCmp: function () {
        var me = this;

        return me.getComponent(me.serialNoTextfieldItemId);
    },

    /**
     * 返回流水号
     * @return {Object}
     */
    getSerialNumber: function () {
        var me = this,
            dateCmp = me.getDateCmp(),
            date = dateCmp.getValue(),
            userId = me.getUserIdCmp().getValue(),
            serialNo = me.getSerialNoCmp().getValue();

        return date + userId + serialNo;
    },

    /**
     * 设置流水号
     * @return {Object}
     */
    setSerialNumber: function (serialNumber) {
        if (!serialNumber || serialNumber.length < 13) {
            return;
        }
        var me = this,
            dateCmp = me.getDateCmp(),
            userIdCmp = me.getUserIdCmp(),
            serialNoCmp = me.getSerialNoCmp(),
            date, userId, serialNo, len = serialNumber.length;
        date = serialNumber.substr(0, 8);
        userId = serialNumber.substring(8, len - 5);
        serialNo = serialNumber.substring(len - 5);
        dateCmp.setValue(date);
        userIdCmp.setValue(userId);
        serialNoCmp.setValue(serialNo);
    },

    /**
     * 流水号失去焦点事件处理
     */
    onSerialNoTextfieldBlur: function (textfield, event, eOpts) {
        var me = this,
            serialNoTextfield,
            serialNoTextfieldVal,
            padLen;

        serialNoTextfield = me.getSerialNoCmp();
        serialNoTextfieldVal = serialNoTextfield.getValue();

        if (!serialNoTextfieldVal) {
            return;
        }

        padLen = 5 - serialNoTextfieldVal.length;

        if (padLen > 0) {
            var padZero = '0';
            while (padZero.length < padLen) {
                padZero = padZero + '0';
            }
            serialNoTextfieldVal = padZero + serialNoTextfieldVal;
            serialNoTextfield.setValue(serialNoTextfieldVal);
        }
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            items,
            userIdTextfieldCfg,
            serialNoTextfieldCfg,
            dateFieldCfg;

        me.dateFieldCfg = dateFieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'serialDate',
            itemId: 'serialnumber-dateField',
            fieldLabel: '日期',
            width: 124,
            allowBlank: true,
            inputCls: 'Wdate',
            listeners: {},
            value: Ext.util.Format.date(CU.getTime(), 'Ymd')
        }, me.dateFieldCfg);

        me.userIdTextfieldCfg = userIdTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            itemId: 'userid-userIdTextfield',
            name: 'userId',
            enforceMaxLength: true,
            maxLength: 10,
            width: 58,
            enableKeyEvents: true,
            allowBlank: true,
            value: cfg.sub.opedepartid,
            listeners: {}
        }, me.userIdTextfieldCfg);

        me.serialNoTextfieldCfg = serialNoTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            name: 'serialNo',
            itemId: 'serialno-serialNoTextfield',
            fieldLabel: '流水号',
            width: 60,
            allowBlank: true,
            minLength: 5,
            maxLength: 5,
            maxLengthText: '该输入项长度为5',
            minLengthText: '该输入项长度为5',
            enforceMaxLength: true,
            listeners: {}
        }, me.serialNoTextfieldCfg);

        if (me.readOnlyAll) {
            dateFieldCfg.readOnly = true;
            userIdTextfieldCfg.readOnly = true;
            serialNoTextfieldCfg.readOnly = true;
        }

        items = [
            dateFieldCfg,
            userIdTextfieldCfg,
            serialNoTextfieldCfg
        ];

        return items;
    }
});