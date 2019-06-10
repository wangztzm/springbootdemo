Ext.define('Ming.view.fee.chargefee.ChargeFeeTabController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fee-chargefee-chargefeetab',

    /*
     * 页面关闭前处理
     */
    beforeClose: function () {
        var me = this,
            hasNotSavedFee,
            callback = function () {
                var me = this,
                    view = me.getView();
                view.destroy();
            };
        hasNotSavedFee = me.hasNotSavedFee();
        if (hasNotSavedFee) {
            me.showCloseMsg(callback);
            return false;
        }
        return true;
    },

    /*
     * 对话框关闭前处理
     */
    closeWindowVerify: function () {
        var me = this,
            view = me.getView(),
            hasNotSavedFee,
            callback = function () {
                var me = this,
                    view = me.getView();
                view.up('window').close();
            };
        hasNotSavedFee = me.hasNotSavedFee();
        if (hasNotSavedFee) {
            me.showCloseMsg(callback);
        } else {
            view.up('window').close();
        }
    },

    /*
     * 判断有未保存的数据
     */
    hasNotSavedFee: function () {
        var me = this,
            view = me.getView(),
            chargeFeeView = view.child('fee-chargefee-chargefee'),
            chargeFeeController = chargeFeeView.getController(),
            hasNotSavedFee;
        hasNotSavedFee = chargeFeeController.hasNotSavedFee();
        return hasNotSavedFee;
    },

    /*
     * 显示关闭提示框
     */
    showCloseMsg: function (callback) {
        var me = this;
        EU.showMsg({
            title: '警告信息',
            message: '有未保存且费用大于0的记录，确定退出？',
            icon: Ext.Msg.WARNING,
            option: 3,
            callback: function (btn) {
                if (btn === 'ok') {
                    callback.apply(me);
                }
            }
        });
    }
});