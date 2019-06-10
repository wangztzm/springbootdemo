Ext.define('Ming.expand.ux.FormPanel', {
    extend: 'Ext.form.Panel',
    alternateClassName: 'ux.form.Panel',
    xtype: 'winform',
    plugins: [{ptype: 'PRQ'}],
    frame: false,
    border: false,
    autoScroll: true,
    bodyPadding: 5,
    referenceHolder: true,
    fieldDefaults: {labelAlign: 'right', labelWidth: 70, msgTarget: 'side'},
    dataObject: [], // 除form以为的其他数据容器
    trackResetOnLoad: true, // 开启/关闭验证提醒
    submitFunction: 'onFormSubmit',

    /**
     * form表单数据数据变动验证
     * dataObject,除表单数据外其他需要验证的组件对象.如果不写,默认只验证form表单变动
     * @return {}
     */
    isAllDirty: function () {
        var me = this;
        var isdirty = me.superclass.isDirty.call(me);
        if (isdirty) return isdirty;
        for (var i = 0; i < me.dataObject.length; i++) {
            if (Ext.isFunction(me.dataObject[i].isDirty)) {
                isdirty = me.dataObject[i].isDirty();
            }
            if (isdirty) break;
        }

        return isdirty;
    },

    /**
     * 弹出框关闭时候执行调用（关闭按钮、右上角关闭x）
     * 必须设置submitFunction=?提交的方法名称,缺省:onFormSubmit,如果不存在且无法验证,submitFunction第一个参数为提交回调方法,提交成功后回调才关闭窗口。
     * trackResetOnLoad:true 开启退出验证功能,缺省:true
     */
    closeWindowVerify: function () {
        var me = this;
        var func = eval(me[me.submitFunction]);
        if (me.trackResetOnLoad && me.isAllDirty() && Ext.isFunction(func) && func.length > 0) {
            EU.showMsg({
                title: '保存修改', message: '当前记录已经被修改过，需要保存吗?', option: 1, scope: this, callback: function (btn, text) {
                    if (btn == 'yes') {
                        func.call(this, function () {
                            me.closeWindow();
                        });
                    } else {
                        me.closeWindow();
                    }
                }
            });
        } else {
            me.closeWindow();
        }
    },

    /**
     * 选中表格的上一条或者下一条
     * @param gridPanel 用到的表格，必须项
     * @param isPrevious 标记要查看或者修改的是前一条还是后一条
     * @param submitCallBack 通常提交表单后，再加载下一条数据到表单
     * @param notSubmitCallBack 通常不提交表单，然后加载下一条数据到表单
     * @param callBackScope 回调函数的作用域
     * @param options 可选项         // actionMode： C: 新建 U: 更新 R: 查看
     */
    anotherItem: function (gridPanel, isPrevious, submitCallBack, notSubmitCallBack, callBackScope, options) {
        if (!gridPanel) {
            return;
        }
        var me = this,
            callBackScope = callBackScope || me,
            store,
            selectedRecArray,
            selectRec,
            index,
            isNew = options && options.actionMode == 'C';
        if (!isNew) {
            selectedRecArray = gridPanel.getSelection();
            if (!selectedRecArray) {
                return;
            }

            store = gridPanel.getStore();
            index = store.indexOf(selectedRecArray[0]);
            if (isPrevious) {
                if (index == 0) {
                    EU.toastWarn('已是第一条数据了！');

                    return;
                }
                index = --index;

            } else {
                if (index == store.getCount() - 1) {
                    EU.toastWarn('已是最后一条数据了！');

                    return;
                }
                index = ++index;

            }
            selectRec = store.getAt(index);
            gridPanel.setSelection(selectRec);
        }

        if (me.isDirty()) {
            EU.showMsg({
                title: '保存修改',
                message: '当前记录已经被修改过，需要保存吗?',
                option: 1,
                scope: callBackScope,
                callback: function (btn, text) {
                    if (btn == 'yes') {
                        if (submitCallBack) {
                            submitCallBack.call(this);
                        }
                    } else {
                        if (notSubmitCallBack) {
                            notSubmitCallBack.call(this);
                        }
                    }
                }
            });
        } else {
            if (notSubmitCallBack) {
                notSubmitCallBack.call(callBackScope);
            }
        }
    }
});