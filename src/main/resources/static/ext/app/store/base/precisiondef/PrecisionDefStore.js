Ext.define('Ming.store.base.precisiondef.PrecisionDefStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.base.stocktype.StockType',
    alias: 'store.PrecisionDefStore',
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
        url: UrlUtil.get('api', 'base/precisiondef/queryAllStockType'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }
});