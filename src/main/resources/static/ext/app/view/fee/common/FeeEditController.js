Ext.define('Ming.view.fee.common.FeeEditController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-common-feeedit',

    afterRender: function () {
        var me = this,
            waybillNumber,
            viewModel = me.getViewModel();
        waybillNumber = me.lookupReference('feeedit-waybillnumber');
        waybillNumber.setBillId({
            stockType: viewModel.get('stockType'),
            stockPre: viewModel.get('stockPre'),
            stockNo: viewModel.get('stockNo')
        });
    },

    /**
     * 新增费用
     */
    onFeeEditAddFee: function (btn) {
        var me = this,
            feeItemAndBizOpeStore = me.getViewModel().getStore('feeItemAndBizOpe'),
            grid = me.lookupReference('feeEditGrid'),
            store = grid.getStore(),
            record = store.getAt(0),
            feeWt = record ? record.data.feeWt : 0,
            newRecord;
        // 检查是否可用新添加费用明细
        if (feeItemAndBizOpeStore.getCount() == store.getCount()) {
            EU.toastWarn('计费项目都有了，不能新增费用明细了。');
            return;
        }
        newRecord = store.add({feeId: null, isNew: true, feeWt: feeWt});
        grid.setSelection(newRecord);
    },

    /**
     * 删除费用
     */
    onFeeEditRemoveFee: function (btn) {
        var me = this,
            grid = me.lookupReference('feeEditGrid'),
            store = grid.getStore(),
            selections = grid.getSelection(),
            deleteRecord;
        if (!selections || selections.length == 0) {
            EU.toastInfo('请选择要移除的记录。');
            return;
        }
        // 验证是否有费用权限
        if (!PU.hasFunction('FEEMODIFY')) {
            EU.toastWarn('你没有删除费用权限。');
            return;
        }
        deleteRecord = selections[0];
        if (deleteRecord.data.calWay == 'B') {
            EU.toastWarn('授权计费不能删除！');
        }
        store.remove(deleteRecord);
    },

    /**
     * 费用编辑 单元格编辑前
     */
    beforeedit: function (editor, context, eOpts) {
        var me = this,
            feeEditViewModel = me.getViewModel(),
            field = context.field,
            record = context.record;
        if ((field == 'feeRate' || field == 'fee') && record.getData().calWay == 'B') {
            EU.toastWarn('授权计费不能修改！');
            return false;
        }
    },

    /**
     * 费用编辑 单元格编辑验证
     */
    validateedit: function (editor, context, eOpts) {
        var me = this,
            feeEditViewModel = me.getViewModel(),
            theFeeRawData = feeEditViewModel.getData().theFeeRawData;
        // 不能重复计费
        if (context.field == 'feeId') {
            var grid = context.grid,
                store = grid.getStore(),
                curRecordId = context.record.id,
                allRecords = store.getData().items,
                allRecordsLen = allRecords ? allRecords.length : 0,
                i, data;
            for (i = 0; i < allRecordsLen; i++) {
                if (allRecords[i].id == curRecordId) {
                    continue;
                }
                data = allRecords[i].data;
                if (data.feeId == context.value) {
                    EU.toastInfo('不能重复计费。');
                    context.cancel = true;
                    return false;
                }
            }

            Ext.each(theFeeRawData.feeDetailList, function (item) {
                if (item.feeId == context.value) {
                    context.record.set(Ext.clone(item));
                }
            });
        }
    },

    /**
     * 费用编辑 单元格编辑后
     */
    edit: function (editor, context, eOpts) {
        var me = this,
            feeEditViewModel = me.getViewModel(),
            theFeeRawData = feeEditViewModel.getData().theFeeRawData,
            feeItemAndBizOpeStore = feeEditViewModel.getStore('feeItemAndBizOpe'),
            feeItemAndBizOpeRecord,
            field = context.field,
            record = context.record,
            recordData = record.getData();

        // 找到费用简称
        feeItemAndBizOpeRecord = feeItemAndBizOpeStore.findRecord('feeId', recordData.feeId);
        if (feeItemAndBizOpeRecord) {
            record.set('feeShortNm', feeItemAndBizOpeRecord.data.feeShortNm);
        }

        // 更新计算方式
        if ((field == 'feeRate' || field == 'fee') && recordData.calWay == 'A') {
            Ext.each(theFeeRawData.feeDetailList, function (item) {
                if (item.feeId == recordData.feeId &&
                    ((field == 'feeRate' && Number(item.feeRate) != context.value)
                        || (field == 'fee' && Number(item.fee) != context.value))) {
                    record.set('calWay', 'C');
                }
            });
        }

        // 更新费用
        if (field == 'feeRate') {
            record.set('fee', NumberUtil.times(context.value, recordData.feeWt));
        }
    },

    /**
     * 计费项单元格渲染
     */
    feeItemColumnRenderer: function (value, metaData, record) {
        var editor = metaData.column.getEditor(record);
        return record.getData().feeShortNm;
    },

    /**
     * 计费方式单元格渲染
     */
    calWayColumnRenderer: function (value, metaData, record) {
        if (value == 'A') {
            return '自动计费';
        } else if (value == 'B') {
            return '授权计费';
        } else if (value == 'C') {
            return '手工输入或修改';
        }
        return value;
    },

    /**
     * 费用编辑页面的提交费用
     */
    onFeeEditSubmit: function () {
        var me = this,
            view = me.getView();
        view.callCallback(view.up('window'));
    }
});