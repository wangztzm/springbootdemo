Ext.define('Ming.view.fee.invoicemanagement.InvoiceManagementModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-invoicemanagement-invoicemanagement',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.settlement.FeeUnsettled'
    ],

    stores: {
        waybills: function () {
            return StoreUtil.getConfig({
                model: 'Ming.model.fee.settlement.FeeUnsettled',
                autoLoad: false,
                url: UrlUtil.get('api/fee/balance', 'queryInvoice'),
                listeners:{
                    load:'waybills',
                }
            });
        }()
    },
    data:{
        ams:'',
        grossam:'',
        delo:''
    }
});