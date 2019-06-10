Ext.define('Ming.store.imp.goodsorder.GoodsOrderQueryStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.goodsorder.GoodsOrderQueryModel',
    alias: 'store.imp-goodsorder-goodsorderquerystore',
    autoLoad: false,
    paging: true,
    remoteSort: true,
    remoteFilter: true,
    pageSize: 20,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        pageParam: 'page.pageNo',
        limitParam: 'page.pageSize',
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/impDelivery/queryCanDlv'),
        reader: {
            type: 'json',
            rootProperty: 'data.list',
            messageProperty: 'msg'
        }
    }

});


