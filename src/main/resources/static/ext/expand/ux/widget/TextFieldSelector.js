/**
 * 该组件包含一个表单的文本框，鼠标双击可弹出选择面板。
 * 选择条目后可将该条目指定字段的值回填到文本框。
 * 参照的MultiSelector
 */
Ext.define('Ming.expand.ux.widget.TextFieldSelector', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'textfieldselector',

    requires: [
        'Ext.form.field.Text',
        'Ming.expand.ux.widget.TextFieldSelectorSearch',
        'Ming.utils.WidgetConfig'
    ],

    config: {
        /**
         * @cfg {Object} searchCfg
         * This object configures the searchCfg popup component. By default this contains the
         * `xtype` for a `Ext.view.MultiSelectorSearch` component and specifies `autoLoad`
         * for its `store`.
         * 此对象配置搜索弹出组件, 主要配置弹出组件中的gridpanel。
         * 下面是默认配置。使用组件时可以另外指定。
         */
        searchCfg: {
            /**
             * @cfg {Object} searchTextfieldCfg
             * 搜索输入框
             */
            searchTextfieldCfg: {},

            /**
             * @cfg {Object} searchGridCfg
             * 搜索输入框
             */
            searchGridCfg: {
                store: {
                    autoLoad: true // 注意无论指定何值，后面都设置为true。
                },
                selModel: {
                    // 单选无checkbox框设置，默认是复选框单选模式。
                    // type: 'rowmodel', // rowmodel is the default selection model
                    // mode: 'SINGLE' // Allows selection of multiple rows
                }
            }
        },

        /**
         * @cfg {Object} inputTextfieldCfg
         * 输入框的配置
         */
        inputTextfieldCfg: {
            // name 必须指定
            name: null,
            spliter: '/'
            // isToUpperCase: false,// 标记是否转为大写，注意业务配置中写，否则被覆盖。
        },

        /**
         * @cfg {Object} valueField
         * 设置输入框值时，用到的字段名称。默认为code。
         */
        valueField: 'code',

        /**
         * @cfg {Object} queryMode
         * 可选值为：remote或者local
         * remote 查询时调用后台api
         */
        queryMode: 'local',

        /**
         * @cfg {Object} queryMode
         * 当queryMode为remote时，gridPanel的store传给后台接口的查询参数的名称，默认为query，
         */
        queryParam: 'query',

        /**
         * @cfg {Number} pageSize
         * 每页页数，大于0时，表示要用分页查询，gridpanel会在底部添加分页工具栏。
         * 仅当queryMode为remote时用到，gridPanel的store传给后台接口的参数。
         */
        pageSize: 0,

        /**
         * @cfg {Number} pageNo
         * 查询的页码
         * 仅当queryMode为remote时用到，gridPanel的store传给后台接口的参数。
         */
        pageNo: 1,

        /**
         * @cfg {Object} queryCode
         * 基础数据查询代码
         */
        queryCode: null,

        /**
         * @cfg {Object} queryParamMap
         * 基础数据查询参数
         */
        queryParamMap: null,

        /**
         * @cfg {Object} maxSelections
         * 最多选择或输入的数量
         */
        maxSelections: Number.MAX_VALUE
    },

    initComponent: function () {
        var me = this,
            inputTextfieldCfg = me.inputTextfieldCfg,
            inputTextfield;

        // 设置组件
        me.items = me.makeItems();
        // 设置输入框
        if (!inputTextfieldCfg || !inputTextfieldCfg.name) {
            Ext.raise('请指定输入框配置项：name的值。');
        }

        me.callParent();

        me.addPopup();

        me.inputTextfieldItemId = me.inputTextfieldCfg.itemId;

        inputTextfield = me.getInputTextfieldCmp();
        inputTextfield.on('keyup', me.onInputTextfieldKeyUp, me);
    },

    /**
     * 获取输入框组件
     * @return {Object}
     */
    getInputTextfieldCmp: function () {
        var me = this;

        return me.getComponent(me.inputTextfieldItemId);
    },

    /**
     * 获取输入框组件值
     * @return {Object}
     */
    getInputTextfieldValue: function () {
        var me = this;

        return me.getInputTextfieldCmp().getValue();
    },

    /**
     * 设置输入框组件值
     * @param {Object}
     */
    setInputTextfieldValue: function (val) {
        var me = this;
        me.getInputTextfieldCmp().setValue(val);
    },

    /*
     * 获取显示的组件
     */
    makeItems: function () {
        var me = this,
            inputTextfieldCfg;

        me.inputTextfieldCfg = inputTextfieldCfg = Ext.merge({
            xtype: 'textfield',
            itemId: 'inputTextfield',
            allowBlank: false,
            value: '',
            fieldCls: Ext.baseCSSPrefix + 'custom-widget-input',
            enableKeyEvents: true,
            keyMap: {
                scope: me,
                DOWN: 'onShowSearch',
                ESC: 'onDismissSearch',
                F8: 'onShowSearch'
            },
            listeners: {
                afterrender: function (component) {
                    component.inputEl.on('dblclick', me.onShowSearch.bind(me));
                },
                change: me.onInputTextFieldChange.bind(me)
            }
        }, me.inputTextfieldCfg);

        me.inputTextfieldCfg = inputTextfieldCfg = Ext.merge({
            validator: me.inputTextfieldValidator.bind(me)
        }, me.inputTextfieldCfg);
        me.inputTextfieldCfg = inputTextfieldCfg = Ext.merge(inputTextfieldCfg, me.inputTextfieldCfg);

        var items = [
            inputTextfieldCfg
        ];

        return items;
    },

    /**
     * 文本框值改变时，设置表格的被选择条目。
     * @param textfield
     */
    onInputTextFieldChange: function (textfield, newValue, oldValue, eOpts) {
        var me = this,
            searchPopup = me.searchPopup;
        if (searchPopup) {
            searchPopup.selectRecords(true);
        }
    },

    /**
     * 文本框值keyup时，转为大写。
     * @param textfield
     */
    onInputTextfieldKeyUp: function (textfield, event, eOpts) {
        var me = this,
            value = textfield.getValue(),
            valLength = value ? value.length : 0,
            maxLength = me.inputTextfieldCfg.maxLength,
            keyCode = event.keyCode;
        if (keyCode >= Ext.event.Event.A && keyCode <= Ext.event.Event.Z) {
            if (me.inputTextfieldCfg.isToUpperCase && value) {
                if (maxLength && valLength > maxLength) {
                    value = value.substr(maxLength * -1, maxLength);
                }
                value = value.toUpperCase();
                textfield.setValue(value);
            }
        }
    },

    /**
     * 失去焦点隐藏表格，并重置文本框值。模板方法。
     * @param e
     */
    onFocusLeave: function (e) {
        var me = this;
        me.onDismissSearch();
        me.callParent([e]);
    },

    /**
     * 模板方法。
     */
    afterComponentLayout: function (width, height, prevWidth, prevHeight) {
        var me = this,
            popup = me.searchPopup;

        me.callParent([width, height, prevWidth, prevHeight]);
        if (popup && popup.isVisible()) {
            popup.showBy(me.getInputTextfieldCmp().inputEl, me.popupAlign);
        }
    },

    /**
     * 单元格编辑会调用
     */
    setValue: function (val) {
        var me = this;
        me.getInputTextfieldCmp().setValue(val);
    },

    /**
     * 单元格编辑会调用
     */
    resetOriginalValue: function () {
        var me = this;
        me.getInputTextfieldCmp().resetOriginalValue();
    },

    /**
     * 单元格编辑会调用
     */
    getValue: function () {
        var me = this;
        return me.getInputTextfieldCmp().getValue();
    },

    /**
     * 单元格编辑会调用
     */
    isValid: function () {
        var me = this;
        return me.getInputTextfieldCmp().isValid();
    },

    privates: {
        /**
         * 控件失去焦点时触发自定义事件
         */
        fireTextfieldSelectorChangeEvent: function (inputTextfieldValue, selectedRecords) {
            var me = this;
            me.fireEvent('textfieldselectorchange', me, inputTextfieldValue, selectedRecords);
        },

        popupAlign: 'bl?',

        onGlobalScroll: function (scroller) {
            // Collapse if the scroll is anywhere but inside this selector or the popup
            if (!this.owns(scroller.getElement())) {
                this.onDismissSearch();
            }
        },

        onDismissSearch: function (e) {
            var me = this,
                searchPopup = me.searchPopup,
                inputTextfield;

            if (searchPopup && (!e || !(searchPopup.owns(e.getTarget()) || (this.owns(e.getTarget()) && e.keyCode != Ext.event.Event.ESC)))) {
                this.scrollListeners && this.scrollListeners.destroy();
                this.touchListeners && this.touchListeners.destroy();
                searchPopup.hide();

                // check文本框值
                inputTextfield = me.getInputTextfieldCmp();
                inputTextfield.validateValue(inputTextfield.getValue());
                me.fireTextfieldSelectorChangeEvent(inputTextfield.getValue(), searchPopup.getSelectedRecords());
            }
        },

        onShowSearch: function (event) {
            var me = this,
                searchPopup = me.searchPopup,
                inputTextfield;

            inputTextfield = me.getInputTextfieldCmp();
            if (inputTextfield.isDisabled() || inputTextfield.readOnly) {
                return;
            }

            if (!searchPopup) {
                searchPopup = me.makeSearch();
                me.searchPopup = searchPopup = me.add(searchPopup);

                // If we were configured with records prior to the UI requesting the popup,
                // ensure that the records are selected in the popup.
                // if (store.getCount()) {
                //    searchPopup.selectRecords(store.getRange());
                // }
            }

            searchPopup.selectRecords(true);
            searchPopup.invocationEvent = event;
            searchPopup.showBy(me.getInputTextfieldCmp().inputEl, me.popupAlign);

            // It only autofocuses its defaultFocus target if it was hidden.
            // If they're reactivating the show tool, they'll expect to focus the searchCfg.
            if (!event || event.pointerType !== 'touch') {
                searchPopup.getSearchTextfieldCmp().focus();
            }

            me.scrollListeners = Ext.on({
                scroll: 'onGlobalScroll',
                scope: me,
                destroyable: true
            });

            // Dismiss on touch outside this component tree.
            // Because touch platforms do not focus document.body on touch
            // so no focusleave would occur to trigger a collapse.
            me.touchListeners = Ext.getDoc().on({
                // Do not translate on non-touch platforms.
                // mousedown will blur the field.
                translate: false,
                touchstart: me.onDismissSearch,
                scope: me,
                delegated: false,
                destroyable: true
            });
        },

        /**
         * 设置文本框的值。
         * @param selection
         */
        setFieldValue: function (val) {
            var me = this,
                inputTextfield;
            inputTextfield = me.getInputTextfieldCmp();

            // 设置文本框的显示内容
            inputTextfield.setRawValue(val);
        },

        /**
         * 验证输入框的值
         */
        inputTextfieldValidator: function (val) {
            var me = this, msgArray = [], existCheckResult, numberCheckResult;
            if (me.queryMode === 'local') {
                existCheckResult = me.existCheck(val);
                if (existCheckResult != true) {
                    msgArray.push(existCheckResult);
                }
            }
            numberCheckResult = me.numberCheck();
            if (numberCheckResult != true) {
                msgArray.push(numberCheckResult);
            }
            return msgArray.length > 0 ? msgArray.join('') : true;
        },

        /**
         * 验证值是否存在check
         */
        existCheck: function (val) {
            if (!val) {
                return true;
            }
            var me = this,
                searchPopup = me.searchPopup,
                existValueArray = searchPopup.valueArray,
                msgArray = [],
                inputTextfield, label,
                value, valueArray;
            inputTextfield = me.getInputTextfieldCmp();
            label = inputTextfield.fieldLabel ? inputTextfield.fieldLabel + '：' : '值：';
            value = inputTextfield.getValue();
            valueArray = value.split(me.inputTextfieldCfg.spliter);

            if (!existValueArray) {
                valueArray.forEach(
                    function (item, index, array) {
                        if (item != '') {
                            msgArray.push(item);
                            msgArray.push('、');
                        }
                    }
                );
                msgArray.pop();

                return label + msgArray.join('') + '后台查询数据为空。';
            }

            valueArray.forEach(
                function (item, index, array) {
                    if (!Ext.Array.contains(existValueArray, item)) {
                        msgArray.push(item);
                        if (item != '') {
                            msgArray.push('、');
                        }
                    }
                }
            );

            if (msgArray == 0) {
                return true;
            }
            if (msgArray[msgArray.length - 1] === '') {
                msgArray.pop();
            }
            msgArray.pop();

            return label + msgArray.join('') + '在系统中不存在。';

        },

        /**
         * 检查选择或输入的数量
         */
        numberCheck: function () {
            var me = this,
                msgArray = [],
                inputTextfield, label, value, valueArray;
            inputTextfield = me.getInputTextfieldCmp();
            label = inputTextfield.fieldLabel ? inputTextfield.fieldLabel + '：' : '';
            value = inputTextfield.getValue();
            valueArray = value.split(me.inputTextfieldCfg.spliter);
            if (valueArray.length > me.maxSelections) {
                msgArray.push(label + '最多只能选择或输入' + me.maxSelections + '项');
            }

            return msgArray.length > 0 ? msgArray.join('') : true;
        },

        /*
         * 获取搜索弹框组件
         */
        makeSearch: function () {
            var me = this,
                searchCfg;

            searchCfg = Ext.merge({
                owner: me,
                floating: true,
                alignOnScroll: false,
                queryMode: me.queryMode,
                queryParam: me.queryParam,
                pageSize: me.pageSize,
                pageNo: me.pageNo,
                queryCode: me.queryCode,
                queryParamMap: me.queryParamMap
            }, me.searchCfg);

            searchCfg = Ext.merge(searchCfg, me.searchCfg);
            searchCfg.xtype = 'textfieldselector-search';

            return searchCfg;
        },

        /*
         * 添加弹出组件，为了让弹出框的store先加载数据。否则验证可能出现问题。
         */
        addPopup: function () {
            var me = this,
                searchPopup;
            searchPopup = me.searchPopup;
            if (!searchPopup) {
                searchPopup = me.makeSearch();
                me.searchPopup = searchPopup = me.add(searchPopup);

                // If we were configured with records prior to the UI requesting the popup,
                // ensure that the records are selected in the popup.
                // if (store.getCount()) {
                //    searchPopup.selectRecords(store.getRange());
                // }
            }
        }
    }
});