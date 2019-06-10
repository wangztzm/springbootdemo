Ext.define('Ming.model.fee.common.FeeItem', {
    extend: 'Ming.model.Base',

    fields: [
        {name: 'autoCharge'}, // 是否自动计费
        {name: 'bizCode'}, // 计费点
        {name: 'bizDes'}, // 计费操作点描述
        {name: 'dom'}, // 国内计费项目
        {name: 'efcDateBegin'}, // 多种付款方式的集合
        {name: 'efcDateEnd'}, // 多种付款方式的集合
        {name: 'enAbled'}, // 是否生效   Y=生效  N=未生效
        {name: 'exp'}, // 是否出港计费项
        {name: 'feeId'}, // 费用ID
        {name: 'feeName'}, // 费用名
        {name: 'feeShortNm'}, // 费用名缩写
        {name: 'imp'}, // 是否进港计费项
        {name: 'iNT'}, // 是否国际计费项
        {name: 'mustCharge'} // 是否必须收费
    ]
});





