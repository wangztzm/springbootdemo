Ext.define('Ming.view.fee.common.InvoicePreviewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-settlement-invoicepreview',

    beforeRender: function () {
        var me = this,
            formPanel = me.getView(),
            taxPayersStore = me.getStore('taxPayers'),
            customer = formPanel.down('combobox[name=customer]'),
            payerClassific = formPanel.down('combobox[name=payerClassific]'),
            addressPhone = formPanel.down('combobox[name=addressPhone]'),
            bankAccount = formPanel.down('combobox[name=bankAccount]'),
            invoicePreviewGrid = me.lookupReference('invoicePreviewGrid'),
            form = formPanel.getForm(),
            pageParams = formPanel.getParams(),
            infoKind = pageParams.infoKind, // 发票类型，0为专用发票，2为普通发票
            customerId = pageParams.customerId,
            customerName = pageParams.customerName,
            invoiceTitle = formPanel.lookupReference('invoiceTitle'),
            invoiceDetailList = pageParams.invoiceDetailList,
            taxRate = pageParams.taxRate,
            totalAmount = 0, // 价税合计(小写)
            excludeTaxTotalAmount = 0, // 不含税总金额
            taxTotalAmount = 0; // 总税额

        EU.RS({
            url: UrlUtil.get('api/base/taxpayerCompany', 'getAllTaxpayerCompany'),
            scope: me,
            jsonData: {},
            callback: function (result) {
                if (result.success && result.resultCode === '0') {
                    var resultDataList = result.data,
                        taxPayerData = Ext.Array.findBy(resultDataList, function (resultData) {
                            return customerName == resultData.costumerName;
                        });
                    customer.setStore(Ext.create('Ext.data.Store', {data: resultDataList}));
                    payerClassific.setStore(Ext.create('Ext.data.Store', {data: resultDataList}));
                    addressPhone.setStore(Ext.create('Ext.data.Store', {data: resultDataList}));
                    bankAccount.setStore(Ext.create('Ext.data.Store', {data: resultDataList}));
                    customer.setValue(customerName);
                    payerClassific.setValue(taxPayerData.classIfic);
                    addressPhone.setValue(taxPayerData.addressPhone);
                    bankAccount.setValue(taxPayerData.bankAccount);
                } else {
                    EU.toastErrorInfo('');
                }
            }
        });

        Ext.each(invoiceDetailList, function (invoiceDetailItem) {
            var unitPrice,
                totalAmountProduct,
                excludeTaxTotalAmountProduct,
                taxTotalAmountProduct;
            // 该商品不含税单价
            unitPrice = NumberUtil.divide(invoiceDetailItem.price, 1 + taxRate);
            // 该商品含税总金额
            totalAmountProduct = NumberUtil.times(invoiceDetailItem.price, invoiceDetailItem.number);
            // 该商品不含税总金额
            excludeTaxTotalAmountProduct = NumberUtil.divide(totalAmountProduct, 1 + taxRate);
            // 该商品总税额
            taxTotalAmountProduct = NumberUtil.minus(totalAmountProduct, excludeTaxTotalAmountProduct);

            unitPrice = unitPrice.toFixed(2);
            totalAmountProduct = totalAmountProduct.toFixed(2);
            excludeTaxTotalAmountProduct = excludeTaxTotalAmountProduct.toFixed(2);
            taxTotalAmountProduct = taxTotalAmountProduct.toFixed(2);

            invoiceDetailItem.unitPrice = unitPrice;
            invoiceDetailItem.totalAmountProduct = totalAmountProduct;
            invoiceDetailItem.excludeTaxTotalAmountProduct = excludeTaxTotalAmountProduct;
            invoiceDetailItem.taxTotalAmountProduct = taxTotalAmountProduct;

            totalAmount = NumberUtil.plus(totalAmount, totalAmountProduct);
            excludeTaxTotalAmount = NumberUtil.plus(excludeTaxTotalAmount, excludeTaxTotalAmountProduct);
            taxTotalAmount = NumberUtil.plus(taxTotalAmount, taxTotalAmountProduct);
        });
        invoicePreviewGrid.reconfigure({data: invoiceDetailList});

        if (infoKind) {
            invoiceTitle = '<font face="KaiTi"><h1>广东增值税专用发票</h1></font>';
        } else {
            invoiceTitle = '<font face="KaiTi"><h1>广东增值税普通发票</h1></font>';
        }
        var params = {
            invoiceTitle: invoiceTitle,
            // 价税合计(小写)
            totalAmount: '￥' + totalAmount,
            // 价税合计(大写)
            totalAmountChinese: me.toChineseNumerals(totalAmount),
            // 不含税总金额
            excludeTaxTotalAmount: '￥' + excludeTaxTotalAmount,
            // 总税额
            taxTotalAmount: '￥' + taxTotalAmount,
            // 备注
            notes: pageParams.remark
        };

        form.setValues(params);
    },

    /**
     * 打印，保存
     */
    savePrintDetail: function () {
        var me = this,
            formPanel = me.getView(),
            payerForm = formPanel.lookupReference('payerId'),
            payeeForm = formPanel.lookupReference('payeeId'),
            printInvoiceGrid = formPanel.lookupReference('printInvoiceGrid'),
            payerFormValues = payerForm.getForm().getValues(),
            payeeFormValues = payeeForm.getForm().getValues(),
            formValues = formPanel.getForm().getValues(),
            url = UrlUtil.get('api/fee/balance', 'invoice'),
            invoiceContentList = [],
            invoiceContent = [],
            datas = [],
            invoice = {},
            invoiceDto = {},
            invoiceFeeList = [];
        // 组织参数 invoiceDto
        formValues.totalFee = formPanel.get('totalAmount');
        invoiceDto = formValues;
        formValues.payee = 'COSC';
        formValues.payEEClassific = '91440101773328665U';
        formValues.invoiceContent = ' ';// 必填项（空字符串亦可）

        /*
             bankAccount:null
            classIfic:"91440101773328665U"
            companyName:"中远船务工程技术服务（大连）有限公司广州分公司"
            costumerId:COSC
            costumerName:"中远船务工程技术服务（大连）有限公司广州分公司"
            recId:114
        */
        var printInvoiceGridStore = printInvoiceGrid.getStore();
        invoiceContentList.push('<?xml version=\"1.0\" encoding=\"utf-8\"?><Root>');
        for (var i = 0; i < printInvoiceGridStore.getCount(); i++) {
            var iData = printInvoiceGridStore.getAt(i).getData();
            invoiceContentList.push('<DETAIL>');

            invoiceContentList.push('<Amount>');
            invoiceContentList.push(iData.feeSum);
            invoiceContentList.push('</Amount>');

            invoiceContentList.push('<GoodsName>');
            invoiceContentList.push(iData.feeName);
            invoiceContentList.push('</GoodsName>');

            invoiceContentList.push('<Number>');
            invoiceContentList.push('1');
            invoiceContentList.push('</Number>');

            invoiceContentList.push('<Price>');
            invoiceContentList.push(iData.feeSum);
            invoiceContentList.push('</Price>');

            invoiceContentList.push('<Unit>');
            invoiceContentList.push('公斤');
            invoiceContentList.push('</Unit>');

            invoiceContentList.push('<PriceKind>');
            invoiceContentList.push('1');
            invoiceContentList.push('</PriceKind>');

            invoiceContentList.push('<Standard>');
            invoiceContentList.push('');
            invoiceContentList.push('</Standard>');

            invoiceContentList.push('<TaxRate>');
            invoiceContentList.push(iData.feeSum);
            invoiceContentList.push('</TaxRate>');

            invoiceContentList.push('<TaxItem>');
            invoiceContentList.push('');
            invoiceContentList.push('</TaxItem>');

            invoiceContentList.push('<TaxAmount>');
            invoiceContentList.push('');
            invoiceContentList.push('</TaxAmount>');

            invoiceContentList.push('<GoodsNoVer>');
            invoiceContentList.push('30');
            invoiceContentList.push('</GoodsNoVer>');

            invoiceContentList.push('<GoodsTaxNo>');
            invoiceContentList.push('304040302');
            invoiceContentList.push('</GoodsTaxNo>');

            invoiceContentList.push('<TaxPre>');
            invoiceContentList.push('0');
            invoiceContentList.push('</TaxPre>');

            invoiceContentList.push('<TaxPreCon>');
            invoiceContentList.push('');
            invoiceContentList.push('</TaxPreCon>');

            invoiceContentList.push('<ZeroTax>');
            invoiceContentList.push('');
            invoiceContentList.push('</ZeroTax>');

            invoiceContentList.push('<CropGoodsNo>');
            invoiceContentList.push('');
            invoiceContentList.push('</CropGoodsNo>');

            invoiceContentList.push('<TaxDeduction>');
            invoiceContentList.push('');
            invoiceContentList.push('</TaxDeduction>');

            invoiceContentList.push('</DETAIL>');

        }
        invoiceContentList.push('</Root>');
        invoiceContent = invoiceContentList.join('');
        // 组织参数 invoiceFeeList
        var records = gridpanel.getSelection();
        for (i = 0; i < records.length; i++) {
            var invoiceFee = {},
                feeRecId = records[i].data.feeRecId;
            invoiceFee.feeRecId = feeRecId;
            //    		invoiceFee.invoiceRecId = '2147483647';
            invoiceFeeList.push(invoiceFee);
        }

        invoice.invoiceFeeList = invoiceFeeList;
        invoice.invoiceDto = invoiceDto;

        //    	"InvoiceEti": {
        //			"PAYEE": "广州白云国际机场股份有限公司",
        //			"PAYEECLASSIFIC": "914400007250669553",
        //			"PAYER": "",
        //			"PAYERCLASSIFIC": "",
        //			"TOTALFEE": "460"
        //		},
        invoiceDto.invoiceId = '1000000001';
        invoiceDto.invoiceNo = '00000001';
        invoiceDto.invoiceContent = invoiceContent;
        //    	invoiceDto.invoiceNo = '0';

        datas.push(invoice);
        // 发送请求
        EU.RS({
            url: url,
            scope: this,
            jsonData: {data: invoice},
            callback: function (result) {
                if (result && result.success === true && result.resultCode === '0') {
                    EU.toastInfo('打印成功!');
                    // 关闭弹框
                    var win = formPanel.up('window');
                    win.close();
                    // 刷新主页面
                    this.gridpanel.getStore().reload();
                } else {
                    var msg = result && result.msg;
                    EU.toastInfo('打印失败!' + msg);
                }
            }
        });
    },

    /**
     * 阿拉伯数字转中文大写
     */
    toChineseNumerals: function (n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
            return '数据非法';
        }
        var unit = '千百拾亿千百拾万千百拾元角分', str = '';
        n += '00';
        var p = n.indexOf('.');
        if (p >= 0) {
            n = n.substring(0, p) + n.substr(p + 1, 2);
        }
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++) {
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        }

        return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整');
    },

    /**
     * 打印发票，客户改变处理。
     */
    onCustomerChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            formPanel = combo.up('form'),
            selRecord = combo.findRecordByValue(newValue),
            selRecordData,
            payerClassific = formPanel.down('combo[name=payerClassific]'),
            payerClassificStore = payerClassific.getStore();

        // 通过receId去查询选中的信息base中有接口（getTaxpayerCompanyByRecId），然后去赋值纳税识别号，地址电话，开户行及账号
        if (selRecord) {
            selRecordData = selRecord.data;
            formPanel.down('combobox[name=payerClassific]').setValue(selRecordData.classIfic);
            formPanel.down('combobox[name=addressPhone]').setValue(selRecordData.addressPhone);
            formPanel.down('combobox[name=bankAccount]').setValue(selRecordData.bankAccount);
        }
    },

    /**
     * 关闭发票预览窗口
     */
    invoicePreviewClose: function () {
        var me = this,
            dialog = me.getView().up('window');
        dialog.close();
    }
});