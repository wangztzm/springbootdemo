Ext.define('Ming.expand.ux.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',

    requires: [
        'Ming.locale.Locale'
    ],

    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up(field.parentXtype).down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up(field.parentXtype).down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }

        return true;
    },
    daterangeText: I18N.DaterangeText,

    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);

            return (val == pwd.getValue());
        }

        return true;
    },
    passwordText: I18N.PasswordText,

    /**
     * 用来验证值是否为数字
     * @param {String} value The value
     * @return {Boolean} true if the RegExp test passed, and false if not.
     */
    num: function (value) {
        return /^[0-9_]+$/.test(value);
    },
    numText: '该输入项只能为数字',

    /**
     * 验证电话号码固定和手机
     * @param {String} value The value
     * @return {Boolean} true if the RegExp test passed, and false if not.
     */
    phone: function (value) {
        return /^0[1-9]{1}\d{9,10}$/.test(value) || /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])+\d{8})$/.test(value);
    },
    phoneText: '请正确填写您的电话号码。如果是固话，格式为：区号(3-4位)号码(7-9位)',

    /**
     * 验证邮政编码
     * @param {String} value The value
     * @return {Boolean} true if the RegExp test passed, and false if not.
     */
    zipCode: function (value) {
        return /^[0-9]{6}$/.test(value);
    },
    zipCodeText: '请正确填写您的邮政编码。',

    /**
     * 简单验证身份证
     * @param {String} value The value
     * @return {Boolean} true if the RegExp test passed, and false if not.
     */
    idCard: function (value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    },
    idCardText: '请正确填写身份证号码。',

    /**
     * 必须大于0
     */
    greaterThanZero: function (value) {
        return value > 0;
    },
    greaterThanZeroText: '必须大于0。'
});