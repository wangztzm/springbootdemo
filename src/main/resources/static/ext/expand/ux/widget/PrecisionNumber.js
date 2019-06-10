/**
 * 精度控制数字输入框
 *
 * 每个精度控制因子有如下配置项目。
 * 取值顺序为
 * 1、value、
 * 2、viewField
 * 3、①isTextfieldSelector为true，则根据refHolderRef查询到组件后,调用getInputTextfieldValue。
 *    ②isWaybillNumber为true，则根据refHolderRef查询到组件后,调用getStockType、getStockPre获取运单类型的值。
 * 4、ref，根据ref查找到组件后获取其值。isTextfieldSelector为true或者isWaybillNumber为true时可以不指定。
 * 其他说明：
 * value：不为空，直接返回该值。
 * viewField: view中配置项目。譬如viewField: 'domInt'。然后通过该字段获取值。
 * refHolderRef：注意要获取值的组件的reference在另一个referenceHolder中，需要指定此值。
 * ref: 组件的引用
 * isTextfieldSelector:是否为自定义的文本框选择器。譬如特货代码、城市。
 * isWaybillNumber：是否为自定义的运单号控件。
 */
Ext.define('Ming.expand.ux.widget.PrecisionNumber', {
    extend: 'Ext.form.field.Number',
    xtype: 'precisionnumberfield',

    requires: [
        'Ming.utils.Precision'
    ],

    /**
     * @cfg reference
     * @inheritdoc
     */
    reference: 'precisionnumber',

    /**
     * @cfg fieldLabel
     * @inheritdoc
     */
    fieldLabel: '精度控制数字输入框',

    /**
     * @cfg hideTrigger
     * @inheritdoc
     */
    hideTrigger: true,

    config: {
        /**
         * @cfg 精度控制字段代码
         */
        precisionId: null,

        /**
         * @cfg 精度控制因子
         */
        factor: {
            // 单证类型
            stockType: {},
            // 单证前缀
            stockPre: {},
            // 国内国际
            domInt: {viewField: 'domInt'},
            // 进港出港
            expImp: {viewField: 'expImp'},
            // 特货代码
            specificId: {},
            // 目的站
            destCity: {}
        }
    },

    initComponent: function () {
        var me = this;
        // 设置组件
        me.callParent();

        // 监听失去焦点事件
        if (me.precisionId) {
            me.on('blur', me.onBlur, me);
        }
    },

    /**
     * 失去焦点调用后台
     * */
    onBlur: function (numberfield, event, eOpts) {
        var me = this,
            factor = me.factor;
        var params = {
            recId: null,
            precisionId: null,
            precisionName: null,
            stockTypeId: null,
            stockPre: null,
            expImp: null,
            domInt: null,
            specificId: null,
            destCity: null,
            precisionRule: null,
            srcNum: me.getValue()
        };
        params.precisionId = me.precisionId;
        params.stockTypeId = me.getFactorValue(factor.stockType, {getStockType: true});
        params.stockPre = me.getFactorValue(factor.stockPre, {getStockPre: true});
        params.expImp = me.getFactorValue(factor.expImp);
        params.domInt = me.getFactorValue(factor.domInt);
        params.specificId = me.getFactorValue(factor.specificId);
        params.destCity = me.getFactorValue(factor.destCity);

        PrecisionUtil.getPricosionInfo(me, params);
    },

    getFactorValue: function (factorItem, options) {
        var me = this,
            refHolder = me.lookupReferenceHolder(true),
            holder;
        if (factorItem.value) {
            return factorItem.value;
        }
        if (factorItem.viewField) {
            return refHolder[factorItem.viewField];
        }
        if (factorItem.isTextfieldSelector) {
            holder = refHolder.lookupReference(factorItem.refHolderRef);
            return holder.getInputTextfieldValue();
        }
        if (factorItem.isWaybillNumber) {
            holder = refHolder.lookupReference(factorItem.refHolderRef);
            if (options.getStockType) {
                return holder.getStockType();
            }
            if (options.getStockPre) {
                return holder.getStockPre();
            }
        }

        if (factorItem.ref) {
            var cmp = refHolder.lookupReference(factorItem.ref);
            if (cmp) {
                return cmp.getValue();
            }
        }
        return null;
    }
});
