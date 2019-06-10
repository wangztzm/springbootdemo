Ext.define('Ming.store.imp.message.FwbListStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.message.FwbModel',
    alias: 'store.imp-message-fwbliststore',
    autoLoad: false,
    pageSize: null,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/msg/flightFwb'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }
});