Ext.define('Ming.expand.ux.UploadField', {
    extend: 'Ext.form.field.Base',
    alternateClassName: 'ux.form.field.uploadfield',
    xtype: 'uploadfield',
    fieldLabel: '相关附件',

    style: 'text-align:left;padding-top:0px;',


    childEls: [
        'imgEl'
    ],

    fieldSubTpl: ['<img id="{id}" src="resources/images/system/attachment.png"',
        'style="border:0px;cursor:pointer;" data-ref="imgEl"',
        ' />'],

    getSubTplData: function (fieldData) {
        var src = this.udisabled ? 'attachment.png' : 'attachment_add.png';
        var data = {
            id: this.getImgId(),
            src: src
        };

        return data;
    },

    getImgId: function () {
        return this.ImgId || (this.ImgId = this.id + '-imgEl');
    },

    initComponent: function () {
        this.udisabled = this.disabled || this.readOnly;
        this.callParent();
    },

    afterRender: function () {
        var me = this, imgEl = this.imgEl;
        imgEl.on({
            click: function () {
                var cfg = me.cfg;
                cfg.disabeld = me.udisabled;
                cfg.nfield = cfg.nfield || me.name || 'attachs';
                if (Ext.isEmpty(cfg.tablename)) {
                    EU.toastWarn('参数:tablename不能为空!');

                    return;
                }
                if (Ext.isEmpty(cfg.fieldname)) {
                    EU.toastWarn('参数:fieldname不能为空!');

                    return;
                }
                if (Ext.isEmpty(cfg.fieldvalue)) {
                    EU.toastWarn(cfg.tip || '请先保存数据后在上传附件!');

                    return;
                }
                PU.openAttachWindow(me.cfg);
            }
        });
        this.callParent(arguments);
    },

    refreshImg: function () {
        var me = this, imgEl = this.imgEl;
        var src = 'resources/images/system/' + (this.value > 0 ? (this.udisabled ? 'attachment.png' : 'attachment_add.png') : (this.udisabled ? 'attachment_none.png' : 'attachment_add.png'));
        imgEl.dom.src = src;
    },

    setValue: function (v) {
        v = parseInt(v, 10);
        this.value = isNaN(v) || v < 0 ? 0 : v;
        this.refreshImg();
    },

    getValue: function () {
        return this.value;
    },

    setRawValue: function (v) {
        v = parseInt(v, 10);
        this.value = isNaN(v) || v < 0 ? 0 : v;
        this.refreshImg();
    },

    getRawValue: function () {
        return this.value;
    },

    setFieldValue: function (v) {
        this.cfg.fieldvalue = v;
    },

    setReadOnly: function (d) {
        this.udisabled = d;
        this.refreshImg();
    },

    setDisabled: function (d) {
        this.udisabled = d;
        this.refreshImg();
    }
});