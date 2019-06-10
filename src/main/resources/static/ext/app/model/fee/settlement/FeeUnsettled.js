Ext.define('Ming.model.fee.settlement.FeeUnsettled', {
    extend: 'Ming.model.Base',

    fields: [
        {name: 'feeRecId'}, // FEERECID 根据该ID查询明细,
        {name: 'billId'}, //运单号
        {
            name: 'billIdShow',
            convert: function (v, record) {
//                return record.data.stockPre + '-' + record.data.stockNo;

                if(!Ext.isEmpty(record.data.stockPre) && !Ext.isEmpty(record.data.stockNo)){

    				return record.data.stockPre + '-' +record.data.stockNo;
    			}
    			return '';
            }
        }, //运单号
        {name: 'bizOpe'}, //计费业务点
        {name: 'payMode'}, // 付费方式 CS现结 MP月结
        {name: 'feeWayDsc'}, //付费方式中文描述
        {name: 'customerId'}, //代理人
        {name: 'customerName'}, //代理人中文名称
        {name: 'opeDepartId'}, //费用登记营业点
        {name: 'crtOper'}, //创建人ID
        {name: 'crtOperChn'}, //创建人中文名称
        {
            name: 'crtOpeTime',
            convert: function (val, record) {
                if (!Ext.isEmpty(val)) {

                    var date = new Date(val);

                    var year = date.getFullYear(),
                        month = date.getMonth() + 1, // 月份是从0开始的
                        day = date.getDate(),
                        hour = date.getHours(),
                        min = date.getMinutes(),
                        sec = date.getSeconds();
                    var newTime = year + '-' +
                        (month < 10 ? '0' + month : month) + '-' +
                        (day < 10 ? '0' + day : day) + ' ' +
                        (hour < 10 ? '0' + hour : hour) + ':' +
                        (min < 10 ? '0' + min : min) + ':' +
                        (sec < 10 ? '0' + sec : sec);

                    return newTime;
                }
                return val;
            }
        }, //创建时间，计费时间
        {name: 'delOper'}, //作废人
        {name: 'delOpeRch'}, //作废人名称
        {name: 'delOpeTime'}, //作废时间
        {
            name: 'needCheck',
            convert: function (v, record) {
                if (v == 'N') {
                    return '否';
                }
                return '是';
            }
        }, //需要审核：Y 是，N否
        {name: 'flightNo'}, //航班号
        {name: 'airLineId'}, //承运人
        {name: 'flightDate'}, //航班时间
        {name: 'dueTo'}, //费用属于承运人：C,费用属于机场：A,其它：O
        {name: 'remark'}, //备注
        {name: 'chargeSeq'}, //流水号
        {name: 'lastOper'}, //最后操作人
        {name: 'lastOpeTime'}, //最后操作时间
        {name: 'curFeeWt'},
        {name: 'fdsRecId'}, //航段
        {name: 'chtPcs'}, //包机件数
        {name: 'chtWeight'}, //包机重量
        {name: 'charterDept'}, //包机单位
        {name: 'cargoMail'}, //货邮标识 M 邮件 C 货物（默认M）
        {name: 'cargoNm'}, //品名
        {name: 'pcs'}, //文件件数 取值于运单表
        {name: 'weight'}, //文件重量 取值于运单表
        {name: 'feeWt'}, //计费重量 取值于运单表
        {name: 'bizOpeDes'}, //计费点中文描述
        {name: 'objType'}, //计费主体，SALE 销售收费 CHT 包机收费 OPE 地面处理收费
        {name: 'feeStatus'}, //状态：A已计费 B已结算 C已打印发票
        {name: 'feeStatusChn'}, //费用状态名称
        {name: 'curPcs'}, //本次计费件数
        {name: 'whsTime'}, //计费天数 暂无值
        {name: 'shporCsgCustomer'}, //收发货人代码
        {name: 'shporCnsName'}, //收发货人名称
        {name: 'shporCnsCustomer'}, //收发货代理人代码
        {name: 'shporCnsCustomerN'}, //收发货代理人名称
        {name: 'stockTypeId'}, // 运单类型
        {name: 'stockPre'}, // 运单前缀
        {name: 'stockNo'}, // 运单号,
        {name:'invoiceContent'},//发票明细
        {name:'invoiceId'},//发票代码
        {name:'invoiceNo'},//发票号
        {name:'invoiceRecId'},//记录号
        {name:'payEEClassific'},//收款方纳税人识别号 ,
        {name:'payee'},//收款单位
        {name:'payer '},//付款方名称，
        {name:'payerClassific'}, //付款方纳税人识别号 ,
        {name:'totalFee'},//总费用,
        {name:'fee'},//费用
        {name:'feeId'},//计费项编码
        {name:'feeName'},//收费项目 ,
        {name:'feeRate'},//费率
        {name:'feeRemark'},//备注
        {name:'feeShortNm'},//收费项目
        {name:'originalFee'},//ORIGINALFEE ,
        {name:'recId'},//ID

    ]
});
