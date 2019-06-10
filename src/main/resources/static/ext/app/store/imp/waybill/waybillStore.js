Ext.define('Ming.store.imp.waybill.waybillStore', {
    extend: 'Ext.data.Store',
    model: 'Ming.model.imp.waybill.WaybillDetail',
    alias: 'store.imp-waybill-waybillStore',
    autoLoad: false,
    pageSize: null,
    proxy: {
        type: 'api',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: UrlUtil.get('api', 'imp/ImpFileOpe/queryAllManifest'),
        reader: {
            type: 'json',
            rootProperty: 'data',
            messageProperty: 'msg'
        }
    },
    listeners: {
        load: function (store, records, options) {
            var waybillFileTotal = 0;
            var waybillManifestTotal = 0;
            var waybillTallyTotal = 0;
            var waybillFileWeight = 0;
            var waybillWeight = 0;
            var waybillTallyWeight = 0;
            var filAwbarriveCount = 0;
            var awbmCount = 0;
            if (records != null && records.length > 0) {
                console.log(records[0].data.impManifestNoUldVos);
                store.loadRawData(records[0].data.impManifestNoUldVos);
                var data = records[0].data.impManifestNoUldVos;
                awbmCount = records[0].data.awbmCount;
                filAwbarriveCount = records[0].data.filAwbarriveCount;
                for (var i = 0; i < data.length; i++) {
                    waybillFileTotal += data[i].pcs;
                    waybillManifestTotal += data[i].manPcs;
                    waybillTallyTotal += data[i].fltPcs;
                    waybillFileWeight += data[i].weight;
                    waybillWeight += data[i].manWgt;
                    if (data[i].fltWgt != undefined) {
                        waybillTallyWeight += data[i].fltWgt;
                    }
                }
                Ext.getCmp('waybillFileNumber').body.update('文件到达数：' + filAwbarriveCount);
                Ext.getCmp('waybillMailNumber').body.update('邮件单到达数：' + awbmCount);
            }
            Ext.getCmp('waybillFileTotal').body.update('文件总件数：' + waybillFileTotal);
            Ext.getCmp('waybillManifestTotal').body.update('舱单总件数：' + waybillManifestTotal);
            Ext.getCmp('waybillTallyTotal').body.update('理货总件数：' + waybillTallyTotal);
            Ext.getCmp('waybillFileWeight').body.update('文件总重量：' + waybillFileWeight.toFixed(2));
            Ext.getCmp('waybillWeight').body.update('舱单总重量：' + waybillWeight.toFixed(2));
            Ext.getCmp('waybillTallyWeight').body.update('理货总重量：' + waybillTallyWeight.toFixed(2));
        }
    }

});


