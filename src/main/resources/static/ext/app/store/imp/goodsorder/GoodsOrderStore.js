Ext.define('Ming.store.imp.goodsorder.GoodsOrderStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.goodsorder.GoodsOrderModel',
    alias: 'store.imp-goodsorder-goodsorderstore',
    autoLoad: false,
    //remoteSort: true,
    pageSize: 20,
    paging:true,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        pageParam: 'page.pageNo',
        limitParam: 'page.pageSize',
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/impDelivery/queryCanDelivery'),
        reader: {
            type: 'json',
            rootProperty: 'data.list',
            messageProperty: 'msg'
        }
    }

});


