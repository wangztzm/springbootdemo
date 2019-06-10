Ext.define('Ming.view.fee.settlement.InvoicePreviewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-settlement-invoicepreview',

    requires: [
        'Ming.utils.Store',
        'Ming.model.fee.settlement.TaxPayer'
    ],
    data: {
        flag: false
    }
});