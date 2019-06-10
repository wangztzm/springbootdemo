Ext.define('Ming.view.fee.common.PayWayController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-common-payway',

    /**
     * 单元格编辑前
     */
    onPayWayBeforeEdit: function (editor, context, eOpts) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            totalBalanceAmount = viewModel.getData().totalBalanceAmount,
            field = context.field,
            record = context.record,
            items,
            sumOther = 0,
            remainder = 0,
            parentRowSumAmount = 0;

        if (view.opeMode == 'A' && field == 'payAmount') {
            items = me.lookupReference('gridPanel').getStore().getData().items;
            // 计算其它行的总值
            Ext.each(items, function (item) {
                if (record.getId() != item.getId()) {
                    sumOther = NumberUtil.plus(sumOther, item.data.payAmount);
                }
            });
            remainder = NumberUtil.minus(totalBalanceAmount, sumOther);
            remainder = remainder > 0 ? remainder : 0;
            record.set('payAmount', remainder);
        } else if (view.opeMode == 'B' && field == 'cancelPayAmount') {
            items = context.grid.getStore().getData().items;
            parentRowSumAmount = me.getParentSumAmount(view.opeMode, items[0].data.balanceRecId);
            //计算其它行的总值
            Ext.each(items, function (item) {
                if (record.getId() != item.getId()) {
                    sumOther = NumberUtil.plus(sumOther, item.data.payAmount);
                }
            });
            remainder = NumberUtil.minus(parentRowSumAmount, sumOther);
            if (remainder > 0) {
                remainder = remainder < record.data.payAmount ? remainder : record.data.payAmount;
            } else {
                remainder = 0;
            }
            record.set('cancelPayAmount', remainder);
        } else if (view.opeMode == 'C' && field == 'modifyPayAmount') {
            items = context.grid.getStore().getData().items;
            parentRowSumAmount = me.getParentSumAmount(view.opeMode, items[0].data.balanceRecId);
            // 计算其它行的总值
            Ext.each(items, function (item) {
                if (record.getId() != item.getId()) {
                    sumOther = NumberUtil.plus(sumOther, item.data.modifyPayAmount);
                }
            });
            remainder = NumberUtil.minus(parentRowSumAmount, sumOther);
            remainder = remainder > 0 ? remainder : 0;
            record.set('modifyPayAmount', remainder);
        }
    },

    /**
     * 单元格编辑验证 如果值输大了 就恢复原来的值
     */
    onPayWayValidateEdit: function (editor, context, eOpts) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            totalBalanceAmount = viewModel.getData().totalBalanceAmount,
            field = context.field,
            items,
            record = context.record,
            parentRowSumAmount = 0;

        if (context.value < 0) {
            context.cancel = true;
            return false;
        }

        if (view.opeMode == 'A' && field == 'payAmount') {
            items = me.lookupReference('gridPanel').getStore().getData().items;
            var sumPayAmountInput = 0;
            Ext.each(items, function (item) {
                if (record.getId() != item.getId()) {
                    sumPayAmountInput = NumberUtil.plus(sumPayAmountInput, item.data.payAmount);
                }
            });
            sumPayAmountInput = NumberUtil.plus(sumPayAmountInput, context.value);
            if (totalBalanceAmount < sumPayAmountInput) {
                context.cancel = true;
                return false;
            }

        } else if (view.opeMode == 'B' && field == 'cancelPayAmount') {
            items = context.grid.getStore().getData().items;
            parentRowSumAmount = me.getParentSumAmount(view.opeMode, items[0].data.balanceRecId);
            var sumCancelPayAmountInput = 0;
            Ext.each(items, function (item) {
                if (record.getId() != item.getId()) {
                    sumCancelPayAmountInput = NumberUtil.plus(sumCancelPayAmountInput, item.data.cancelPayAmount);
                }
            });
            sumCancelPayAmountInput = NumberUtil.plus(sumCancelPayAmountInput, context.value);
            if (parentRowSumAmount < sumCancelPayAmountInput) {
                context.cancel = true;
                return false;
            }
        } else if (view.opeMode == 'C' && field == 'modifyPayAmount') {
            items = context.grid.getStore().getData().items;
            parentRowSumAmount = me.getParentSumAmount(view.opeMode, items[0].data.balanceRecId);
            var sumModifyPayAmountInput = 0;
            Ext.each(items, function (item) {
                if (record.getId() != item.getId()) {
                    sumModifyPayAmountInput = NumberUtil.plus(sumModifyPayAmountInput, item.data.modifyPayAmount);
                }
            });
            sumModifyPayAmountInput = NumberUtil.plus(sumModifyPayAmountInput, context.value);
            if (parentRowSumAmount < sumModifyPayAmountInput) {
                context.cancel = true;
                return false;
            }
        }
    },

    /**
     * 保存
     */
    savePayWay: function (btn) {
        var me = this,
            gridPanel = me.lookupReference('gridPanel'),
            store = gridPanel.getStore(),
            view = me.getView(),
            opeMode = view.opeMode,
            viewModel = view.getViewModel(),
            viewModelData = viewModel.getData(),
            totalBalanceAmount = viewModelData.totalBalanceAmount,
            callbackOptions = view.get('options'),
            items = store.getData().items,
            balanceList = viewModelData.balanceList,
            balance = viewModelData.balance;

        if (opeMode == 'A') {
            var sumPayAmountInput = 0;
            Ext.each(items, function (item) {
                sumPayAmountInput = NumberUtil.plus(sumPayAmountInput, item.data.payAmount);
            });
            if (sumPayAmountInput > totalBalanceAmount) {
                EU.toastErrorInfo('付款明细总额不能大于应付款总额！');
                return;
            }
            if (sumPayAmountInput < totalBalanceAmount) {
                EU.toastErrorInfo('付款明细总额不能小于应付款总额！');
                return;
            }

            balance = balance ? balance : {};
            balance.balanceDetails = [];
            Ext.each(items, function (item) {
                var data = item.data;
                // 记录下预付金额
                if (data.payWay == 'PREPAY') {
                    balance.prePayAmount = data.payAmount;
                }
                if (data.payAmount > 0) {
                    var balanceDetail = {
                        payWay: data.payWay,
                        payAmount: data.payAmount
                    };
                    balance.balanceDetails.push(balanceDetail);
                }
            });
        } else if (opeMode == 'B') {
            var i,
                itemB,
                itemDataB,
                balanceDetailListB;
            for (i = 0; i < items.length; i++) {
                var sumCancelPayAmountInput = 0,
                    sumCancelPayAmount = 0;
                itemB = items[i];
                itemDataB = itemB.data;
                sumCancelPayAmount = itemDataB.sumCancelPayAmount;
                balanceDetailListB = itemDataB.balanceDetailList;
                Ext.each(balanceDetailListB, function (balanceDetailItem) {
                    sumCancelPayAmountInput = NumberUtil.plus(sumCancelPayAmountInput, balanceDetailItem.cancelPayAmount);
                });
                if (sumCancelPayAmount < sumCancelPayAmountInput) {
                    EU.toastErrorInfo('取消付款明细总额不能大于该次结算的取消总额！');
                    return;
                }
                if (sumCancelPayAmount > sumCancelPayAmountInput) {
                    EU.toastErrorInfo('取消付款明细总额不能小于该次结算的取消总额！');
                    return;
                }
            }

            if (balanceList && balanceList.length > 0) {
                Ext.each(items, function (itemB) {
                    var itemDataB = itemB.data,
                        balanceDetailListB = itemDataB.balanceDetailList,
                        processBalance = Ext.Array.findBy(balanceList, function (balanceItem) {
                            return itemB.balanceRecId == balanceItem.balanceRecId;
                        });
                    processBalance.balanceDetails = [];
                    Ext.each(balanceDetailListB, function (balanceDetailItem) {
                        // 记录下预付金额
                        if (balanceDetailItem.payWay == 'PREPAY') {
                            processBalance.prePayAmount = balanceDetailItem.cancelPayAmount;
                        }
                        if (balanceDetailItem.payAmount > balanceDetailItem.cancelPayAmount) {
                            var balanceDetail = {
                                balanceRecId: balanceDetailItem.balanceRecId,
                                payWay: balanceDetailItem.payWay,
                                payamount: NumberUtil.minus(balanceDetailItem.payAmount, balanceDetailItem.cancelPayAmount)
                            };
                            processBalance.balanceDetails.push(balanceDetail);
                        }
                    });
                });
            }
        } else if (opeMode == 'C') {
            var j,
                itemC,
                itemDataC,
                balanceDetailListC;
            for (j = 0; j < items.length; j++) {
                var sumModifyPayAmountInput = 0,
                    sumModifyPayAmount = 0;
                itemC = items[j];
                itemDataC = itemC.data;
                sumModifyPayAmount = itemDataC.sumModifyPayAmount;
                balanceDetailListC = itemDataC.balanceDetailList;
                Ext.each(balanceDetailListC, function (balanceDetail) {
                    sumModifyPayAmountInput = NumberUtil.plus(sumModifyPayAmountInput, balanceDetail.modifyPayAmount);
                });
                if (sumModifyPayAmount < sumModifyPayAmountInput) {
                    EU.toastErrorInfo('修改付款明细总额不能大于该次结算的修改总额！');
                    break;
                }

                if (sumModifyPayAmount > sumModifyPayAmountInput) {
                    EU.toastErrorInfo('修改付款明细总额不能小于该次结算的修改总额！');
                    break;
                }
            }

            if (balance) {
                balance.balanceDetails = [];
                Ext.each(items[0].data.balanceDetailList, function (balanceDetailItem) {
                    // 记录下预付金额
                    if (balanceDetailItem.payWay == 'PREPAY') {
                        balance.prePayAmount = NumberUtil.minus(balanceDetailItem.payAmount, balanceDetailItem.modifyPayAmount);
                    }
                    if (balanceDetailItem.modifyPayAmount > 0) {
                        var balanceDetail = {
                            balanceRecId: balanceDetailItem.balanceRecId,
                            payWay: balanceDetailItem.payWay,
                            payAmount: balanceDetailItem.modifyPayAmount
                        };
                        balance.balanceDetails.push(balanceDetail);
                    }
                });
            }
        }

        var param = opeMode == 'B' ? balanceList : balance;
        view.closeWindow({
            balanceInfo: param,
            options: callbackOptions
        });
    },

    /**
     * 取消
     */
    cancelPayWay: function (btn) {
        var me = this,
            view = me.getView();
        view.up('window').close();
    },

    /**
     * 获取父行的总额
     */
    getParentSumAmount: function (opeMode, balanceRecId) {
        var me = this,
            gridPanel = me.lookupReference('gridPanel'),
            store = gridPanel.getStore(),
            parentRowRecord,
            parentRowSumAmount = 0;
        parentRowRecord = store.findRecord('balanceRecId', balanceRecId);
        if (!parentRowRecord) {
            return parentRowSumAmount;
        }
        if (opeMode == 'B') {
            parentRowSumAmount = parentRowRecord.data.sumCancelPayAmount;
        } else if (opeMode == 'C') {
            parentRowSumAmount = parentRowRecord.data.sumModifyPayAmount;
        }

        return parentRowSumAmount;
    }
});