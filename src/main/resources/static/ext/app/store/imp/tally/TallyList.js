Ext.define('Ming.store.imp.tally.TallyList', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.tally.Tally',
    alias: 'store.tally-tallylist',
    autoLoad: false,
    pageSize: null,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/cargocheck/queryNoUldGoods'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    },
    listeners: {
        load: function (store, records, options) {
            if (records != null) {
                var manPcsSum = 0;
                var manWgtSum = 0;
                var fltPcsSum = 0;
                var fltWgtSum = 0;
                for (var i = 0; i < records.length; i++) {
                    manPcsSum += records[i].data.manPcs;
                    manWgtSum += records[i].data.manWgt;
                    fltPcsSum += records[i].data.fltPcs;
                    fltWgtSum += records[i].data.fltWgt;
                }
                Ext.getCmp('manPcsSum').setData('舱单总件数: ' + manPcsSum);
                Ext.getCmp('manWgtSum').setData('舱单总重量: ' + manWgtSum);
                Ext.getCmp('fltPcsSum').setData('理货总件数: ' + fltPcsSum);
                Ext.getCmp('fltWgtSum').setData('理货总重量: ' + fltWgtSum);
            }
        }
    }
});
