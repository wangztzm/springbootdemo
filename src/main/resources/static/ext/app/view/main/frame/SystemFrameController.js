Ext.define('Ming.view.main.frame.SystemFrameController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.systemFrame',

    init: function () {
        console.debug('SystemFrameController.init');
        var theme = local.get('theme') || cfg.theme;
        var view = this.getView();
        view.removeAll(true);
        //
        var result = [{
            'color': null,
            'custom1': 'Ming.view.main.frame.default.Main',
            'id': '01',
            'text': '\u9ed8\u8ba4\u4e3b\u9898'
        }, {
            'color': null,
            'custom1': 'Ming.view.main.frame.desktop.Main',
            'id': '02',
            'text': '\u684c\u9762\u4e3b\u9898'
        }, {
            'color': 'red',
            'custom1': 'Ming.view.main.frame.dashboard.Main',
            'id': '03',
            'text': '\u5e73\u9762\u4e3b\u9898'
        }];
        var xtype = '';
        Ext.each(result, function (rec) {
            if (rec.id == theme) {
                xtype = rec.custom1;

                return;
            } else if (xtype == '') {
                xtype = rec.custom1;
            }
        });
        if (!Ext.isEmpty(xtype)) {
            cfg.theme = theme;
            var panel = Ext.create(xtype, {view: view});
            if (panel instanceof Ext.panel.Panel) {
                view.add(panel);
            }
        }


        /* EU.RSView("V_THEME",function(result){
            var xtype = "";
            Ext.each(result,function(rec){
                if(rec.id == theme){
                    xtype = rec.custom1;
                    return;
                }else if(xtype==""){
                    xtype = rec.custom1;
                }
            })
            if(!Ext.isEmpty(xtype)){
                cfg.theme = theme;
                var panel = Ext.create(xtype,{view:view});
                if(panel instanceof Ext.panel.Panel){
                    view.add(panel);
                }
            }
        });*/
    }
});