Ext.define('Ming.model.fee.chargefee.Fee', {
    extend: 'Ming.model.Base',

    fields: [
        {name: 'feeRecId'}, // 费用记录号
        {name: 'billId'}, // 运单号
        {name: 'payMode'}, // 方式
        {name: 'customerId'}, // 客户
        {name: 'customerName'}, // 收/发货人
        {name: 'fltInfo'}, // 航班
        {name: 'curFeeWt'}, // 本次计费重量
        {name: 'whsTime'}, // 仓储天数
        {name: 'curPcs'}, // 计费件数
        {name: 'feeRate'}, // 费率
        {name: 'awbInfo'}, // 运单信息
        {name: 'feeDetailList'}, // 费用明细
        {name: 'hasHistory'},
        {name: 'sameBizOpe'}
    ]
});


