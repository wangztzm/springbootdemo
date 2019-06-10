Ext.define('Ming.store.imp.goodsnotice.NoticeStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.goodsnotice.NoticeModel',
    alias: 'store.imp-goodsnotice-noticestore',
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
        url: UrlUtil.get('api', 'imp/dlvnotice/queryStayDlvNotice'),
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


