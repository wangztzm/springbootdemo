Ext.define('Ming.view.sys.logsystem.LogSystemModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.sys.logsystem.logsystemmodel',
    requires: [
        'Ming.model.sys.LogSystem',
    ],
    stores: {

        Operatedata: function () {
            return StoreUtil.getConfig({
                model: 'Ming.model.sys.LogSystem',
                paging: true,
                remoteSort: true,
                remoteFilter: true,
                autoLoad: false,
                url: UrlUtil.get('api/log/system', 'getLogSystemList')
            });
        }(),
    },
})