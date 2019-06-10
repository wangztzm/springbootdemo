Ext.define('Ming.model.fee.settlement.FeeSettled', {
    extend: 'Ming.model.Base',

    fields: [
        {name: 'billId'}, // 运单号
        {name: 'feeStatus'}, // 发票状态
        {name: 'feeStatusChn'}, // 发票状态名称
        {name: 'fltInfo'}, // 航班信息
        {name: 'curFeeWt'}, // 本次计重
        {name: 'curPcs'}, // 本次计件
        {name: 'whsTime'}, // 仓储天数
        {name: 'awbFeeWt'}, // 运单重量
        {name: 'sumFee'}, // 总费用
        {name: 'specOpeId'}, // 特货代码
        {name: 'cargoNo'}, // 品名代码
        {name: 'cargoNm'}, // 品名
        {name: 'feeWayDsc'}, // 计费方式
        {name: 'payWayDsc'}, // 支付方式
        {name: 'shporCsgCustomer'}, // 收发货人代码
        {name: 'shporCnsName'}, // 收发货人名称
        {name: 'shporCsgCustomerId'}, // 收发货代理人代码
        {name: 'shporCnsCustomerName'}, // 收发货代理人名称
        {name: 'customerId'}, // 客户代码
        {name: 'customerName'}, // 客户
        {name: 'modify'}, // 付款方式
        {name: 'invoiceNo'}, // 发票号
        {name: 'rePrintInvoice'}, // 重打发票
        {name: 'feeRecId'}, // 计费ID
        {name: 'feeCrtOperChn'}, // 计费人
        {name: 'balanceRecId'}, // 结算ID
        {name: 'moneyOperChn'}, // 结算人
        {name: 'moneyOpeTime'}, // 结算时间
        {name: 'invoiceCrtOperChn'}, // 打印人
        {name: 'invoiceCrtOpeTime'}, // 打印时间
        {name: 'chargeSeq'}, // 流水号
        {name: 'sAirportId'}, // 始发站
        {name: 'eAirportId'}, // 目的站
        {name: 'customCtl'}, // 海关监管
        {name: 'stockTypeId'}, // 运单类型
        {name: 'stockPre'}, // 运单前缀
        {name: 'stockNo'}, // 运单号
        {name: 'feeRate'}, // 费率
        {
            name: 'billIdShow', convert: function (v, record) {
                var recordData = record.data;
                if (!Ext.isEmpty(recordData.stockPre) && !Ext.isEmpty(recordData.stockNo)) {

                    return recordData.stockPre + '-' + recordData.stockNo;
                }
                return '';
            }
        }, // 表格显示的运单号
    ]
});
