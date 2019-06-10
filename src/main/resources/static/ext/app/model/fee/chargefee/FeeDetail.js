Ext.define('Ming.model.fee.chargefee.FeeDetail', {
    extend: 'Ming.model.Base',

    fields: [
        {name: 'feeRecId'}, // 费用记录号
        {name: 'feeId'}, // 费用代码
        {name: 'fee'}, // 费用
        {name: 'feeWt'}, // 本次计费重量
        {name: 'feeRate'}, // 费率
        {name: 'curFeeWt'}, // 本次计费重量
        {name: 'calWay'}, // 计费途径A自动计费B授权计费C手工输入或修改
        {name: 'feeRemark'}, // 备注
        {name: 'feeName'}, // 费用名称
        {name: 'feeShortNm'} // 费用简称
    ]
});


