Ext.define('Ming.store.imp.goodsnotice.NoticeDetailedStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.goodsnotice.NoticeDetailedModel',
    alias: 'store.imp-goodsnotice-noticedetailedstore',
    autoLoad: false,
        proxy : {
             type: 'api',
             paramsAsJson: true,
             actionMethods:{
                   read: 'POST',
                },
             url: UrlUtil.get('api', 'imp/dlvnotice/queryDlvNoticeDetail'),
             reader: {
                 type: 'json',
                 rootProperty: "data",
                 messageProperty: "msg"
             }
           },

});


