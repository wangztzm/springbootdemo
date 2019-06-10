Ext.define('Ming.store.base.deckcontours.DeckContoursStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.base.aircrafttypes.AircraftTypes',
    alias: 'store.DeckContoursStore',
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
        url: UrlUtil.get('api', 'base/deckcontours/queryAllAircraftType'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }
});