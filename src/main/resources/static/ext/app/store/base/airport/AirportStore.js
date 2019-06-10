Ext.define('Ming.store.base.airport.AirportStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.base.city.CityFields',
    alias: 'store.airportStore',
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
        url: UrlUtil.get('api', 'base/airport/queryAllCity'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }
});