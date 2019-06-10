Ext.define('Ming.utils.Precision', {
    alternateClassName: 'PrecisionUtil',
    singleton: true,

    /*
    * 精度影响字段
     */
    enumPrecisionId: {
        FEEWT: 'FEEWT',
        CGOWT: 'CGOWT',
        CARGOWT: 'CARGOWT',
        VOL: 'VOL',
        FEE: 'FEE',
        WTWEIGHT: 'WTWEIGHT'
    },

    /*
    * 调用按定义的精度规则计算数值的接口，得到计算后的数值，赋值到文本框。
    * @param {Object} numberfield 数字文本框控件或者控件的reference值
    * @param {Object} ajax请求的参数，下面字段：
    * params = {
            recId: null,
            precisionId: null,
            precisionName: null,
            stockTypeId: null,
            stockPre: null,
            expImp: null,
            domInt: null,
            specificId: null,
            destCity: null,
            precisionRule: null,
            srcNum: null
        }
    * @param {Function} 请求成功的回调
    * @param {Function} 请求失败的回调
    * @param {Function} 收到响应后的回调，不管请求成功还是失败。
    * @param {Object}  回调函数执行的作用域
    * @param [Object] 其他可选项
    */
    getPricosionInfo: function (numberfield, params, options, success, failure, callback, scope) {
        var me = this,
            loading = numberfield && (options && options.loading);

        if (!numberfield) {
            Ext.raise('数字文本框控件未指定。');
        }

        if (!params || !params.precisionId) {
            Ext.raise('精度控制字段代码未指定。');
        }

        if (!me.enumPrecisionId[params.precisionId]) {
            Ext.raise('精度控制字段代码不存在。');
        }

        if (!params.srcNum || !Ext.isNumeric(params.srcNum)) {
            return;
        }

        scope = scope ? scope : me;

        if (loading) {
            numberfield.setLoading(true);
        }
        Ext.Ajax.request({
            url: UrlUtil.get('api/base/precisiondefinition', 'getPricosionInfo'),
            jsonData: params,
            success: function (response, opts) {
                var reponseJson = Ext.decode(response.responseText);
                if (reponseJson.success) {
                    var reponseJsonData = reponseJson.data ? reponseJson.data : null;
                    if (reponseJsonData) {
                        numberfield.setValue(reponseJsonData);
                    }
                }
                if (Ext.isFunction(success)) {
                    success.call(scope, response, opts);
                }
            },
            failure: function (response, opts) {
                if (Ext.isFunction(failure)) {
                    success.call(scope, response, opts);
                }
            },
            callback: function (options, success, response) {
                if (loading) {
                    numberfield.setLoading(false);
                }
                if (Ext.isFunction(callback)) {
                    success.call(scope, options, success, response);
                }
            }
        });
    }

});