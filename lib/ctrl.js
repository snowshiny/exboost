const V = require('./validator');

// 控制器基类，所有控制器需要继承此类
class Ctrl {
    constructor() {

        // 权限范围
        this.scopes = [];

        this.dataType = 'json';

        /**接口输入数据验证模板
         * type 类型, 通用属性，必须(可选值object, array, string, int ,float, number),
         * nullable 是否可以为null， 通用属性， 默认false,
         * emptyable 是否可以为空，类型为string或array的时候可选，默认false,
         * reg 正则表达式，用于值验证, 类型不为object或array的时候可选,
         * fmt 格式化函数，用于对值进行自定义转换，类型不为object或array的时候可选,
         * props 对象的属性，类型为object的时候必须,
         * items 数组的元素，类型为array的时候必须,
         * min 最小值(包含)，类型为int,float,number的时候可选,
         * max 最大值（包含），类型为int,float,number的时候可选,
         * lt 最小值（不包含），类型为int,float,number的时候可选,
         * gt 最大值（不包含），类型为int,float,number的时候可选,
         * minlen 最小长度，类型为string的时候可选,
         * maxlen 最达长度，类型为string的时候可选,
         */
        this.inputSchema = null;

        // 调用此接口必须存在且有值的上下文参数，格式为['arg1', 'arg2.childarg', 'arg3']
        // 有值的判断条件为 !==null, typeof !== 'undefined', !== ''
        this.requireCtx = null;

        // 支持的http方法，可选both, get, post
        this.method = 'both';
    }

    hasPermis(ctx) {
        return V.hasPermis(this, ctx);
    }

    isCtxOk(ctx){
        return V.isCtxOk(this, ctx);
    }

    wash(data) {
        return V.wash(this,data);
    }

    async run(ctx, data) {
        throw new Error('该接口未实现');
    }
}

module.exports = Ctrl;
