Ext.define('Ming.store.abn.AbnHandling', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.abn.AbnHandling',
    alias: 'store.abn-abnhandling',
    autoLoad: false,
    pageSize: null,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api/abn/abnope', 'queryAbnOpe'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }

});
