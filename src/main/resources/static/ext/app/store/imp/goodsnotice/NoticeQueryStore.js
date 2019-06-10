Ext.define('Ming.store.imp.goodsnotice.NoticeQueryStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.goodsnotice.NoticeQueryModel',
    alias: 'store.imp-goodsnotice-noticequerystore',
    autoLoad: false,
    pageSize: 20,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        pageParam: 'page.pageNo',
        limitParam: 'page.pageSize',
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/dlvnotice/queryDlvNotice'),
        reader: {
            type: 'json',
            rootProperty: 'data.list',
            messageProperty: 'msg'
        },
        extraParams: {
            'beginDate': Ext.Date.format(new Date(), 'Y-m-d 00:00:00'),
            'endDate': CU.getTime()
        }
    }

});


