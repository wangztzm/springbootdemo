Ext.define('Ming.view.sys.logsystem.LogSystemController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sys.logsystem.logsystem',

    //选项卡点击时数据请求渲染
    normal: function (t, n) {
        console.log(n.number);
        var me = this;
        var type = n.number;
        var params = {
            "page": {
                "pageNo": 0,
                "pageSize": 0,
            },
            "type": type
        },
        store = this.getViewModel().storeInfo.Operatedata,
            proxy = store.getProxy(),
            extraParams = {};
        Ext.apply(extraParams, params);
        proxy.setExtraParams(extraParams);
        store.reload();
    },

    //第一次页面进来时渲染页面
    loading: function () {
        console.log('页面加载完毕渲染');
        var params = {
            "page": {
                "pageNo": 0,
                "pageSize": 0
            },
            "type": "1"
        },
        store = this.getViewModel().storeInfo.Operatedata,
            proxy = store.getProxy(),
            extraParams = {};
        Ext.apply(extraParams, params);
        proxy.setExtraParams(extraParams);
        store.reload();
        this.lookupReference('systemOperate').getView().refresh();
    },

    //查询正常
    querylog: function () {
        var startDateValue = this.lookupReference('startDate').rawValue;
        var endDateValue = this.lookupReference('endDate').rawValue;
        var title = this.lookupReference('creat').getValue();
        console.log(title);
        var it = {
            "createtimeend": endDateValue,
            "createtimestatrt": startDateValue,
            "creator": title,
            "page": {
                "pageNo": 0,
                "pageSize": 0
            },
            "type": "1"
        },
        store = this.getViewModel().storeInfo.Operatedata,
            proxy = store.getProxy(),
            extraParams = {};
        Ext.apply(extraParams, it);
        proxy.setExtraParams(extraParams);
        store.reload();
    },

    //查询异常
    querylogerro: function () {
        var title = this.lookupReference('title').getValue();
        console.log(title);
        var it = {
            "creator": title,
            "page": {
                "pageNo": 0,
                "pageSize": 0
            },
            "type": '2'
        },
        store = this.getViewModel().storeInfo.Operatedata,
            proxy = store.getProxy(),
            extraParams = {};
        Ext.apply(extraParams, it);
        proxy.setExtraParams(extraParams);
        store.reload();
    },

    //双击表格行
    onModuledblClick: function (gridpanel, record, tr, rowIndex, e, eOpts) {
        var me = this;
        if (!Ext.isEmpty(record)) {
            var title = "查询『" + record.data.title + "』详情";
            var params = {
                cid: record.data.recid,
            };
            console.log(record.data);
            console.log(record.data.type);
            if (record.data.type == '1') {
                me.openModuleOperate(title, params)
            } else {
                me.openModuleException(title, params)
            }
        }
    },

    //刷新
    onRefresh: function (btn) {
        btn.up("grid").getStore().reload();
    },
    
    //打开正常窗口
    openModuleOperate: function (title, params, callback) {
        var me = this,
            dialog,
            view = me.getView();
        dialog = PU.openModule({
            title: title,
            xtype: "systemOperateEdit",
            width: 500,
            params: params,
            scope: this,
            callback: function (result) {
                console.log(result);
                if (Ext.isEmpty(result)) return;
                if (Ext.isFunction(callback)) callback.call(this, result)
            }
        }, view);
        me.dialog = dialog = view.add(dialog);
        me.loadData(params);
    },

    //打开异常窗口
    openModuleException: function (title, params, callback) {
        var me = this,
        dialog,
        view = me.getView(),
        formPanel;
    dialog =PU.openModule({
            title: title,
            xtype: "systemExceptionEdit",
            width: 600,
            params: params,
            scope: this,
            callback: function (result) {
                if (Ext.isEmpty(result)) return;
                if (Ext.isFunction(callback)) callback.call(this, result);
            }
        },view);
        me.dialog = dialog = view.add(dialog);
        me.loadData(params);
    },

    //渲染弹窗
    loadData: function (params) {
        var me = this;
        var cid = params.cid;
        var systemform = me.dialog.lookupReference('systemformo');
        EU.RS({
            url: UrlUtil.get('/api/log/system', 'get'),
            scope: this,
            msg: false,
            jsonData: {
                data: cid,
            },
            callback: function (result) {
                systemform.getForm().setValues(result.data);
            }
        });
    },
    //关闭窗口
    onFormCancel: function () {
        var me = this,
            dialog = me.dialog,
            formPanel = dialog.lookupReference('SystemEdit');
            formPanel.up('window').close();
    }
});