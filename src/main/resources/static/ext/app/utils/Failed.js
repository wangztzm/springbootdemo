Ext.define('Ming.utils.Failed', {
    singleton: true,
    alternateClassName: 'FailedUtil',

    requires: [
        'Ming.locale.Locale'
    ],

    ajax: function (conn, response, options, eOpts) {
    	
        	console.debug(response);
        var title = I18N.FailedTitle;
      //  Ext.msg.alert(title,response);
        if (response.status === 404) {
            Ext.Msg.alert(title, I18N.Failed404);
        } else if (response.status === 500) {
            Ext.Msg.alert(title, I18N.Failed500);
        } else if (!Ext.isEmpty(response.responseText)) {
            Ext.Msg.alert(title, Ext.String.format(I18N.FailedOtherCode, response.status, response.responseText));
        }
    },

    proxy: function (proxy, response, options, epots) {
    	  
        var status = response.status;
        if (status === 200 && !Ext.isEmpty(options.error)) { 
        	//var json=Ext.JSON.encode(response.responseText);
        	console.debug(response,options);
        	/*if(json.resultCode=="401"){
        		EU.toastErrorInfo(json.msg,{callback:function(){
        			session.clean();
        			local.clean();
        			this.redirectTo(cfg.xtypeLogin);
        		}});
        	}*/
            Ext.Msg.alert(I18N.FailedTitle, options.error);
        } else {
            FailedUtil.ajax(response, options);
        }
    },

    form: function (form, action) {
        if (action.result) {
            if (action.result.errors) return;
            if (!Ext.isEmpty(action.result.msg)) {
                Ext.Msg.alert(I18N.FailureProcessTitle, action.result.msg);

                return;
            }
        }
        FailedUtil.ajax(action.response);
    }

});