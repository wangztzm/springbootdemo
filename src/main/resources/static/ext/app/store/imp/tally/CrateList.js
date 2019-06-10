Ext.define('Ming.store.imp.tally.CrateList', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.tally.Crate',
    alias: 'store.tally-cratelist',
    autoLoad: false,
    pageSize: null,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/cargocheck/queryUldGoods'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    },
    listeners: {
        load: function (store, records, options) {
            if (records != null) {
                var manPcss = 0;
                var manWgts = 0;
                var fltPcss = 0;
                var fltWgts = 0;
                for (var i = 0; i < records.length; i++) {
                    Ext.each(records[i].data.impManifestNoUldList, function (impManifestNoUld) {
                        manPcss += impManifestNoUld.manPcs;
                        manWgts += impManifestNoUld.manWgt;
                        fltPcss += impManifestNoUld.fltPcs;
                        fltWgts += impManifestNoUld.fltWgt;
                    });
                }
                Ext.getCmp('manPcss').setData('舱单总件数: ' + manPcss);
                Ext.getCmp('manWgts').setData('舱单总重量: ' + manWgts);
                Ext.getCmp('fltPcss').setData('理货总件数: ' + fltPcss);
                Ext.getCmp('fltWgts').setData('理货总重量: ' + fltWgts);
            }
        }
    }

});