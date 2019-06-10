Ext.define('Ming.view.fee.chargefee.HistoricalBillingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-chargefee-historicalbilling',

    afterRender: function () {
        var me = this,
            view = me.getView(),
            dialog = view.up('window'),
            grid, plugin, store, records, i, len, scrollTop;
        grid = me.lookupReference('gridPanel');
        grid.reconfigure({
            data: view.get('data')
        });
        plugin = grid.getPlugin('rowwidget');
        store = grid.getStore();
        records = grid.getStore().queryRecords();
        len = records.length;
        scrollTop = grid.getView().getEl().getScrollTop();
        // 展开子表格
        var myMask = new Ext.LoadMask({
            target: dialog
        });
        myMask.show();
        Ext.defer(function () {
            try {
                for (i = 0; i < len; i++) {
                    var rIndex = store.indexOf(records[i]);
                    plugin.toggleRow(rIndex, records[i]);
                }
            } catch (e) {
            }
            grid.getView().getEl().setScrollTop(scrollTop);
            myMask.hide();
        }, 100);
    }
});