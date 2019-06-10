Ext.define('Ming.store.base.city.CityStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.base.areas.Areas',
    alias: 'store.areasStore',
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
        url: UrlUtil.get('api', 'base/city/queryAllAreas'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    }
});