Ext.define('Ming.expand.ux.data.proxy.Api', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.api',

    requires: [
        'Ming.utils.Failed'
    ],

    paramsAsJson: true,

    api: {
        create: undefined,
        read: undefined,
        update: undefined,
        destroy: undefined
    },

    actionMethods: {
        create: 'POST',
        read: 'POST',
        update: 'POST',
        destroy: 'POST'
    },

    // 分页显示的可单独设置
    // pageParam: 'page.pageNo',
    // limitParam: 'page.pageSize',
    pageParam: '',
    limitParam: '',
    startParam: '',

    headers: {'Content-Type': 'application/json; charset=utf-8'},

    // 用于解析要加载到model或者store存储的数据。CRUD的R用到。
    reader: {
        type: 'json',
        rootProperty: 'data',
        messageProperty: 'msg'
    },

    // 在请求server时的一些设定。CRUD的CUD用到。
    writer: {
        type: 'json'
        // 设置否传model的id到后台，model中id设置persist为false，有时更新仍会传id，需要将此字段设置为false。
        // writeRecordId: false

        // writeAllFields将record的所有字段传给后台，包括model中没有定义的field。请用field的属性persist或者critical属性代替。
        // writeAllFields: true,

        // 需要编码的或者以数组形式传到后台的需单独指定
        // encode: true,
        // rootProperty: 'data',
        // allowSingle: false
    },

    listeners: {
        exception: FailedUtil.proxy
    },

    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     * 重写此方法 处理例外参数。
     * 譬如分页参数pageNo、pageSize，需要绑定到page变量中相对应的字段。
     * 现在仅处理pageParam、limitParam，且内容以一个'.'作为分隔符的情况。
     * 例如：pageParam:'page.pageSize'，则会将请求参数由page.pageSize：xx → page: {pageSize: xx}
     */
    getParams: function (operation) {
        var me = this,
            params,
            pageParam,
            limitParam;

        params = me.callParent(arguments);
        if (Ext.JSON.encode(params) == '{}') {
            return;
        }

        pageParam = me.getPageParam();
        limitParam = me.getLimitParam();

        var pageKey;
        if (params[pageParam] && pageParam.indexOf('.') != -1) {
            pageKey = pageParam.substring(0, pageParam.indexOf('.'));
            var newPageParam = pageParam.replace(pageKey + '.', '');
            params[pageKey] = params[pageKey] ? params[pageKey] : {};
            params[pageKey][newPageParam] = params[pageParam];
            delete params[pageParam];
        }

        if (params[limitParam] && limitParam.indexOf('.') != -1) {
            pageKey = limitParam.substring(0, limitParam.indexOf('.'));
            var newLimitParam = limitParam.replace(pageKey + '.', '');
            params[pageKey] = params[pageKey] ? params[pageKey] : {};
            params[pageKey][newLimitParam] = params[limitParam];
            delete params[limitParam];
        }

        return params;
    }
});