Ext.define('Ming.store.imp.message.FfmListStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.message.FfmModel',
    alias: 'store.imp-message-ffmliststore',
    autoLoad: false,
    pageSize: null,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/msg/flightFfm'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }

});


