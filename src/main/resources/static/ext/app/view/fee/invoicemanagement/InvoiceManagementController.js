Ext.define('Ming.view.fee.invoicemanagement.InvoiceManagementController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-invoicemanagement-invoicemanagement',
    init: function () {
        this.gridpanel = this.lookupReference('gridPanel');
    },
    //查询
    invoiceSearch: function () {
        var me = this,
            gridpanel = me.gridpanel,
            store = gridpanel.getStore(),
            params = {},
            form = me.lookupReference('myform');
        var formValues = form.getValues();
        delete formValues.customerId;
        delete formValues.endInvoiceCrtOpeTimeFlag;
        delete formValues.startInvoiceCrtOpeTimeFlag;
        Ext.apply(params, Ext.JSON.decode(Ext.JSON.encode(formValues)));
        console.log(params)
        var it = {
            "data": params
        }
        console.log(it)
        store.load({
            params: it
        });
        console.log(store)
        // console.log(CU.getBeforeTime())
    },
    waybills: function (store, records) {
        this.getViewModel().set('ams', store.getCount());
        var sum = 0;
        for (var i = 0; i < store.getCount(); i++) {
            if (records[i].data.DELOPER == null) {
                records[i].data.DELO = "否"
            } else {
                records[i].data.DELO = "是"
            }
            sum += parseInt(records[i].data.TOTALFEE)
        };
        console.log(sum)
        console.log(this.getViewModel().data.delo)
        this.getViewModel().set('grossam', sum);
        console.log(store.data.items)
        var me = this,
            gridpanel = me.gridpanel;
            gridpanel.getView().refresh();
    },

    onCustomerChange: function (combo, newValue, oldValue, eOpts) {
        var me = this,
            record = combo.findRecordByValue(newValue),
            customerNameTextfield = me.lookupReference('customerName');
        if (record) {
            customerNameTextfield.setValue(record.data.customerNameChn);
        } else {
            customerNameTextfield.setValue('');
        }
    },
    chargeFeeColumnSummaryRenderer: function (value, summaryData, dataIndex, metaData) {
        metaData.tdStyle = 'font-weight: bold;';
        return Ext.String.format('{0}', value);
    },
    // totalAmount:function (record) { 
    //     var grid = this.lookupReference('gridPanel');
    //     var allSelect =  grid.getSelectionModel().getSelection();//获取选中的
    //     // var total = Ext.getCmp('mygrid');
    //     // console.log(total,'数据行数')
    //     var Selections = allSelect.length;//获取选中的行的数量
    //     console.log(Selections);
    //     this.getViewModel().set('ams',Selections);//给数据库定义的参数赋值
    //     console.log(allSelect);
    //     // var allMoney = 0;
    //     // for(var i=0; i<allSelect.length;i++){
    //     //     allMoney +=  parseInt(allSelect[i].data.grossamount)
    //     //     this.getViewModel().set('grossam',allMoney);
    //     // }
    //     // console.log(allMoney)
    //  },
    //  * 行展开,显示明细
    //  */
    // onExpandbody: function (rowNode, record, expandRow, e) {
    //     var me = this,
    //         feeRecid,
    //         params,
    //         url;
    //     // 根据feeRecid查询费用明细
    //     feeRecid = record.data.INVOICENO;
    //     console.log(record.data)
    //     params = {data: feeRecid};
    //     url = UrlUtil.get('api/fee/balance', 'queryFeeDetail');
    //     EU.RS({
    //         url: url,
    //         scope: me,
    //         jsonData: params,
    //         callback: function (result) {
    //             if (result.success) {
    //                 record.data.list = result.data;
    //                 console.log(result.data)
    //                 record.commit();
    //             } else {
    //                 EU.toastInfo(result.msg);
    //             }
    //         }
    //     });
    // },
    //
    //作废发票
    invalidInvoice: function () {
        var me = this;
        var grid = me.lookupReference('gridPanel');
        var allSelect = grid.getSelectionModel().getSelection(); //获取选中的
        var AmountSelect = allSelect.length;
        if (AmountSelect>0) {
            EU.toastInfo(AmountSelect);
        } else {
            EU.toastWarn('请选中要作废的发票！！！');
            return;
        }
    },
});