class XError extends Error {
    constructor(msg, code, extra, raw) {
        super(msg)
        this.extra = extra;
        this.code = code;
        this.raw = raw;
    }

    static wrp(obj){
        return new XError('系统错误', 99, null, obj);
    }

    static attach(xerr, obj){
        xerr.raw = obj;
        return xerr;
    }

    static LoginError() {
        return new XError('未登录', 94);
    }

    static TokenError() {
        return new XError('token无效或已过期', 95);
    }

    static AuthError() {
        return new XError('没有权限', 96);
    }

    static Permis() {
        return new XError('没有权限', 96);
    }

    static ArgError(path) {
        return new XError('参数错误', 97, path);
    }

    static NotFound() {
        return new XError('接口不存在', 98);
    }

    static E(msg) {
        return new XError(msg, 99);
    }

    static No(data) {
        return new XError('', 0, data);
    }

    static StoreError() {
        return new XError('库存不足', 101);
    }

    static NoResError() {
        return new XError('资源不存在', 102);
    }

    static ExpiredError() {
        return new XError('已过期', 103);
    }

    static SignError() {
        return new XError('签名错误', 104);
    }

    static RepeatError() {
        return new XError('重复提交', 105);
    }

    static IllegalTrade() {
        return new XError('非法交易', 106);
    }
}

module.exports = XError;
