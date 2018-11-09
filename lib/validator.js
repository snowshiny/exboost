const V = require('validator');
const XError = require('./xerror');

function _filterObject(schema, source, out, path) {
    Object.keys(schema).forEach(k => _filter(k, schema[k], source[k], out, [...path || [], k]));
    return out;
}

function _filterArray(schema, source, out, path) {
    source.forEach((val, k) => {
        _filter(k, schema, val, out, [...path || [], `[${k}]`]);
    });
    return out;
}

function _filter(k, schema, source, out, path) {
    let {type, nullable, emptyable, reg, fmt, props, items, min, max, minlen, maxlen} = schema;
    if (typeof source === 'undefined' || source === null) {
        if (nullable) {
            return out[k] = null;
        } else throw XError.ArgError(_pathToStrng(path));
    }

    // 类型检查
    let opt = ['min', 'max', 'minlen', 'maxlen', 'lt', 'gt'].reduce((o, k) => {
        if (schema.hasOwnProperty(k)) o[k] = schema[k];
        return o;
    }, {});
    if (!_is(source, type, opt)) {
        throw XError.ArgError(_pathToStrng(path));
    }
    if (type === 'object') {
        out[k] = _filterObject(props, source, {}, path);
    } else if (type === 'array') {
        out[k] = _filterArray(items, source, [], path);
    } else if (type === 'int' || type === 'number' || type === 'float' || type === 'string') {
        if (reg && !reg.test(source)) {
            throw XError.ArgError(_pathToStrng(path));
        }

        // 空字符串
        if (type === 'string' && source === '' && !emptyable) {
            throw XError.ArgError(_pathToStrng(path));
        }

        if (fmt) {
            source = fmt(source);
        }

        out[k] = source;
    } else {
        // 不支持的类型
        throw XError.ArgError(_pathToStrng(path));
    }

    // 空字符串和空数组检查
    if (!emptyable && _isEmpty(out[k], type)) {
        throw XError.ArgError(_pathToStrng(path));
    }
    return out;
}

function _isEmpty(val, type) {
    switch (type) {
        case 'array':
            return val.length === 0;
        case 'string':
            return val.length === 0;
    }
}

function _is(val, type, option) {
    let sval = String(val);
    switch (type) {
        case 'int':
            return typeof val === 'number' && V.isInt(sval, option);
        case 'float':
            return typeof val === 'number' && V.isFloat(sval, option);
        case 'number':
            return typeof val === 'number' && (V.isFloat(sval, option) || V.isInt(sval, option));
        case 'string':
            let r = (typeof val === type);
            if (r && option) {
                let {minlen = 0, maxlen = Number.MAX_SAFE_INTEGER} = option
                    , len = val.length;
                r = len >= minlen && len <= maxlen;
            }
            return r;
        case 'array':
            return Array.isArray(val);
        default:
            return typeof val === type;
    }
}

function _pathToStrng(path) {
    return path.join('.').replace(/\.\[/g, '[');
}

function _isNullOrEmpty(val) {
    return typeof val === 'undefined' || val === null || val === '';
}


module.exports = {
    hasPermis(ctrl, ctx) {
        let s1 = ctrl.scopes
            ,s2 = ctx.scopes;
        return Array.isArray(s1)
            && Array.isArray(s2) &&
            ctrl.scopes.some(scope => s2.indexOf(scope) !== -1)
            || 'public' === s1;
    },

    isCtxOk(ctrl, ctx) {
        let {requireCtx} = ctrl;
        return !Array.isArray(requireCtx) || requireCtx.every(keys => {
            let arr = keys.split('.'), val = ctx;
            return arr.every(k => !_isNullOrEmpty(val = val[k]));
        });
    },

    wash(ctrl, data) {
        let { inputSchema } = ctrl;
        if (inputSchema === null) {
            return {};
        } else if (typeof inputSchema === 'object') {
            return _filterObject(inputSchema, data, {});
        } else if ('raw' === inputSchema) {
            return data;
        }
        throw XError.ArgError('not defined');
    }
};
