Ext.define('Ming.view.main.frame.SystemFrame', {
    extend: 'Ext.panel.Panel',
/*    alternateClassName: 'vsystemFrame',
    xtype: 'vsystemFrame',*/
    
  alias : 'widget.vsystemFrame',
    requires: [
        'Ming.view.main.frame.SystemFrameController',        ,
        'Ming.view.main.frame.SystemFrameModel',
        'Ming.view.main.frame.desktop.Main'
    ],
    controller: 'systemFrame',    
    viewModel: 'systemFrame',
    layout: 'fit',
    referenceHolder: true,
    items: []
});