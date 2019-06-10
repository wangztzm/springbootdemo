Ext.define('Ming.expand.widget.RadioColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.radiocolumn',

    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this;
        var headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex);
        if (!Ext.isEmpty(column.viewname) || !(Ext.isEmpty(column.url) || Ext.isEmpty(column.fieldname))) {
            var key = Ext.isEmpty(column.fieldname) ? column.viewname : column.fieldname;
            var cache = Ext.isEmpty(column.cache) ? true : column.cache;// 是否缓存,缺省true
            var data = cache ? session.get(key) : column.datas;
            if (Ext.isEmpty(data) || !Ext.isArray(data)) {
                var url = Ext.isEmpty(column.url) ? 'platform/basecode/getviewlist.do' : column.url;
                var params = !Ext.isEmpty(column.url) ? null : {viewname: column.viewname};
                EU.RS({
                    url: url, async: false, msg: false, params: params, callback: function (result) {
                        data = result;
                        if (cache) { // 如果不做session缓存,那么就当前grid渲染缓存
                            session.set(key, result);
                        } else {
                            store.datas = result;
                        }
                    }
                });
            }
            var html = '';
            var disabled = Ext.isEmpty(column.disabled) ? true : column.disabled;
            Ext.each(data, function (rec) {
                var inputValue = rec.id;
                var boxLabel = rec.text;
                var checked = inputValue == value;
                var name = view.id + '_Grdi_Column_Radio_' + record.internalId + '_' + rowIndex;
                html += '<input name=\'' + name + '\' type=\'radio\' ' + (checked ? 'checked' : '') + ' ' + (disabled ? 'disabled' : '') + ' dataindex=\'' + column.dataIndex + '\' value=\'' + inputValue + '\' class=\'action-col-radioconlumncss\'/>' + boxLabel + '&nbsp;&nbsp;';
            });

            return html || value;
        }
    },

    processEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
        if (type === 'click') {
            var target = e.getTarget(),
                actionIdRe = 'action-col-radioconlumncss';
            if (target.className.indexOf(actionIdRe) != -1) {
                var dataindex = target.attributes.dataindex.value;
                record.set(dataindex, target.value);

                return false;
            }
        }
        this.superclass.processEvent.call(this, type, view, cell, recordIndex, cellIndex, e, record, row);
    }
});