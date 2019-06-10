Ext.define('Ming.store.base.uldtype.UldTypeStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.base.ctrcode.CtrCodeFields',
    alias: 'store.uldtypeStore',
    autoLoad: true,
    pageSize: 5,
    proxy: {
        /* pageParam: 'page.pageNo',
         limitParam: 'page.pageSize',*/
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'base/uldtype/queryAllCtrCode'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }
});