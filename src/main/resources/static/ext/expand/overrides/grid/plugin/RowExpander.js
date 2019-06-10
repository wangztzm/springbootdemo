Ext.define('classic.expand.overrides.grid.plugin.RowExpander', {
	override: 'Ext.grid.plugin.RowExpander',
    /**
     * 重写getHeaderConfig使如果没数据时，加号可以隐藏
     * 用法：plugins: [{
        ptype: 'rowexpander',
        widget: {
            xtype:'worktaskWidgetGridView',
            autoLoad: true,
            bind: {
                // store: '{record.orders}',
                // title: ''
            }
        },
        配置该方法时，返回true时，可以展开，否则不能展开
        haveRowExpander:function(record){
            if(需要加号即可以展开时){
                return true;
            }else{
                return false;
            }
        }
	}],
     * @returns {{width: number, ignoreExport: boolean, lockable: boolean, autoLock: boolean, sortable: boolean, resizable: boolean, draggable: boolean, hideable: boolean, menuDisabled: boolean, tdCls: string, innerCls: string, renderer: renderer, processEvent: processEvent, isLocked: isLocked, editRenderer: editRenderer}}
     */
//     mixins: [
//         'Ext.mixin.Observable'
//     ],
 
 
 
    relayedEvents: ['collapsebody', 'expandbody'],
    init: function (grid) {
        //--给grid注册expandbody 和collapsebody事件
        var me = this,
            ownerLockable = grid.ownerLockable;
        grid.rowExpanderEventRelayers = grid.relayEvents(grid.view, me.relayedEvents);
        if (ownerLockable) {
            ownerLockable.editorEventRelayers = ownerLockable.relayEvents(ownerLockable.view, me.relayedEvents);
        }
        this.callParent([grid]);
 
    },
    //重写getHeaderConfig，使下级没有数据时，可以隐藏加号,通过haveRowExpander判断
    getHeaderConfig: function () {
        var me = this,
            lockable = me.grid.lockable && me.grid;
 
        return {
            width: me.headerWidth,
            ignoreExport: true,
            lockable: false,
            autoLock: true,
            sortable: false,
            resizable: false,
            draggable: false,
            hideable: false,
            menuDisabled: true,
            tdCls: Ext.baseCSSPrefix + 'grid-cell-special',
            innerCls: Ext.baseCSSPrefix + 'grid-cell-inner-row-expander',
            renderer: function (value, meta, record) {
                if (record.data.leaf) {
                    //if (me.haveRowExpander(record)) {
                      //  return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander" role="presentation" tabIndex="0"></div>';
                    //} else {
                        return "";
                    //}
                } else {
                    return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander" role="presentation" tabIndex="0"></div>';
                }
            },
            processEvent: function (type, view, cell, rowIndex, cellIndex, e, record) {
                var isTouch = e.pointerType === 'touch',
                    isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander');
 
                if ((type === "click" && isExpanderClick) || (type === 'keydown' && e.getKey() === e.SPACE)) {
 
                    // Focus the cell on real touch tap.
                    // This is because the toggleRow saves and restores focus
                    // which may be elsewhere than clicked on causing a scroll jump.
                    if (isTouch) {
                        cell.focus();
                    }
                    me.toggleRow(rowIndex, record, e);
                    e.stopSelection = !me.selectRowOnExpand;
                } else if (e.type === 'mousedown' && !isTouch && isExpanderClick) {
                    e.preventDefault();
                }
            },
 
            // This column always migrates to the locked side if the locked side is visible.
            // It has to report this correctly so that editors can position things correctly
            isLocked: function () {
                return lockable && (lockable.lockedGrid.isVisible() || this.locked);
            },
 
            // In an editor, this shows nothing.
            editRenderer: function () {
                return ' ';
            }
        };
    }
 
})
