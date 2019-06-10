Ext.define('Ming.model.fee.chargefee.Waybill', {
    extend: 'Ming.model.Base',

    fields: [
        {name: 'airlineId'}, // 关联航班--承运人
        {name: 'awbwBillId'}, // 补重单完整编码
        {name: 'billId'}, // 运单完整编码
        {name: 'cargoNn'}, // 品名
        {name: 'cargoNo'}, // 品名代码
        {name: 'chked'}, // 单货审核状态
        {name: 'cnsnName'}, // 收货人
        {name: 'confirmOpeTime'}, // 制单时间
        {name: 'confirmOper'}, // 制单人
        {name: 'csgCustomerId'}, // 收货代理人代码
        {name: 'customStrans'}, // 转关
        {name: 'customCtl'}, // 是否海关监管
        {name: 'dest1'}, // 中转站
        {name: 'domInt'}, // 是否国内/国际
        {name: 'eAirportId'}, // 终点站
        {name: 'endOpeTime'}, // 最后修改时间
        {name: 'endOper'}, // 最后修改人
        {name: 'feeWt'}, // 计费重量
        {name: 'flightNo'}, // 关联航班--航班号
        {name: 'fltInfo'}, // 运单承运航班串
        {name: 'isInStruction'}, // 是否是自销单
        {name: 'originalFeeWt'}, // 原始计费重量数值
        {name: 'originalWt'}, // 原始重量数值
        {name: 'pcs'}, // 件数
        {name: 'preAirline'}, // 航空公司
        {name: 'preFlightNo'}, // 航班号
        {name: 'refrigerated'}, // 冷藏类型.'N'-不需冷藏,'E'-需冷藏,'H'-需冷冻
        {name: 'sAirportId'}, // 起始站
        {name: 'shpCustomer'}, // 发货人ID
        {name: 'shpCustomerId'}, // 托运人代码
        {name: 'shpCustomerName'}, // 发货代理人名称
        {name: 'shprName'}, // 托运人名称
        {name: 'specOpeId'}, // 特殊处理代码
        {name: 'specOpeIdExt'}, // 特殊处理代码扩展
        {name: 'weight'}, // 重量
        {
            name: 'sBillId',
            convert: function (v, record) {
                return record.data.stockPre + '-' + record.data.stockNo;
            }
        }
    ]
});


