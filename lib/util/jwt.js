var onHeaders = require('on-headers');
var Jwt = require('jwt-simple');

function encode(obj, sec) {
    if (typeof obj === 'object') {
        return Jwt.encode(obj, sec, 'HS256');
    }
    return null;
}

function decode(tk, sec) {
    try {
        return Jwt.decode(tk, sec, false, 'HS256');
    } catch (e) {
    }
    return null;
}

module.exports = function (opt) {
    let {
        secret = 'e119faa3a3ce6879fda39b450fc84a321df090240d6a3ab316fdad09ac73452e'
        , cookieName = 'jwt'
        , expire = 300 * 1000
        , varName = 'jwt'
    } = opt;

    function jwtCookie(req, res, next) {
        var jwt = req.cookies[cookieName], dnow = Date.now();
        if (typeof jwt === 'string') jwt = decode(jwt, secret);
        res[varName] = (jwt && jwt.exp && jwt.exp > dnow) ? jwt : {};

        onHeaders(res, function () {
            if (typeof res.ua === 'object' && res.ua !== null) {
                res.ua.exp = new Date().getTime() + expire * 1000;
                expire > 0 ? res.cookie(cookieName, encode(res[varName], secret), {maxAge: expire * 1000})
                    : res.cookie(cookieName, encode(res[varName]), secret);
            } else res.clearCookie(cookieName);
        });
        next();
    }

    return jwtCookie;
};
