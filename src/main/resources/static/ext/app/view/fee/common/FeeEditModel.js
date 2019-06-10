Ext.define('Ming.view.fee.common.FeeEditModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fee-common-feeedit',

    requires: [
        'Ming.utils.Store'
    ],

    data: {
        // 费用原始数据
        theFeeRawData: null,
        // 父页面表格记录的id
        theFeeRecordId: null,
        // 标记结算客户信息是否只读
        customerReadOnly: false
    },

    formulas: {
        // 页面上绑定用的数据
        theFee: function (get) {
            return Ext.clone(get('theFeeRawData'));
        }
    }
});