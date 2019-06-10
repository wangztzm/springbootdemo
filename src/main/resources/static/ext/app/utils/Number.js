Ext.define('Ming.utils.Number', {
    alternateClassName: 'NumberUtil',
    singleton: true,

    /**
     * Return digits length of a number
     * @param {*number} num Input number
     */
    digitLength: function (num) {
        // Get digit length of e
        var eSplit, len;
        eSplit = num.toString().split(/[eE]/);
        len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
        return len > 0 ? len : 0;
    },

    /**
     * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
     * @param {number} num 输入数
     */
    float2Fixed: function (num) {
        var me = this, dLen;
        if (num.toString().indexOf('e') === -1) {
            return Number(num.toString().replace('.', ''));
        }
        dLen = me.digitLength(num);
        return dLen > 0 ? num * Math.pow(10, dLen) : num;
    },

    /**
     * 检测数字是否越界，如果越界给出提示
     * @param {number} num 输入数
     */
    checkBoundary: function (num) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn('%s is beyond boundary when transfer to integer, the results may not be accurate', num);
        }
    },

    /**
     * 精确乘法
     */
    times: function (num1, num2) {
        var me = this, num1Changed, num2Changed, baseNum, leftValue;
        num1 = Number(num1);
        num2 = Number(num2);
        num1Changed = me.float2Fixed(num1);
        num2Changed = me.float2Fixed(num2);
        baseNum = me.digitLength(num1) + me.digitLength(num2);
        leftValue = num1Changed * num2Changed;

        me.checkBoundary(leftValue);

        return leftValue / Math.pow(10, baseNum);
    },

    /**
     * 精确加法
     */
    plus: function (num1, num2) {
        var me = this;
        num1 = Number(num1);
        num2 = Number(num2);
        var baseNum = Math.pow(10, Math.max(me.digitLength(num1), me.digitLength(num2)));
        return (me.times(num1, baseNum) + me.times(num2, baseNum)) / baseNum;
    },

    /**
     * 精确减法
     */
    minus: function (num1, num2) {
        var me = this, baseNum;
        num1 = Number(num1);
        num2 = Number(num2);
        baseNum = Math.pow(10, Math.max(me.digitLength(num1), me.digitLength(num2)));
        return (me.times(num1, baseNum) - me.times(num2, baseNum)) / baseNum;
    },

    /**
     * 精确除法
     */
    divide: function (num1, num2) {
        var me = this, num1Changed, num2Changed;
        num1 = Number(num1);
        num2 = Number(num2);
        num1Changed = me.float2Fixed(num1);
        num2Changed = me.float2Fixed(num2);
        me.checkBoundary(num1Changed);
        me.checkBoundary(num2Changed);
        return me.times((num1Changed / num2Changed), Math.pow(10, me.digitLength(num2) - me.digitLength(num1)));
    }
});