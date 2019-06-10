Ext.define('Ming.store.base.sharecode.ShareCodeStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.base.carrier.Carrier',
    alias: 'store.ShareCodeStore',
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
        url: UrlUtil.get('api', 'base/sharecode/queryAllCarriers'),
        reader: {
            type: 'json',
            rootProperty: 'data.list',
            messageProperty: 'msg'
        }
    }
});