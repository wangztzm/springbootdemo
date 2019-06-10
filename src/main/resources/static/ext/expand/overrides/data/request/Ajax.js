Ext.define('expand.overrides.data.request.Ajax', {
    override: 'Ext.data.request.Ajax',
    pageParam: 'pageNo',
    limitParam: 'pageSize',
    headers: {'Content-Type': 'application/json; charset=utf-8'},
    paramsAsJson: true,
    proxy: {
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    },
    beforeLoad: function () {
        console.debug('expand.overrides.data.request.Ajax beforeload');
    }
});
