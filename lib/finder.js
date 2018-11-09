const Router = require('express').Router;
const Path = require('path');
const XError = require('./xerror');
const Ctx = require('./context');
const BodyParser = require('body-parser');
const Querystring = require('querystring');

module.exports = function (app, opt) {
    let {ctrlDir, ctrlBaseUrl, onError} = opt;
    let router = Router();
    router.all('*', function (req, res, next) {
        let url = req._parsedUrl.pathname
            , mth = req.method
            , ok = (/^[a-zA-z0-9\/]+$/).test(url)
            , err
            , ctx = Object.create(Ctx);
        ctx.req = req;
        ctx.res = res;
        if (ok) {
            try {
                let ctrl = require(Path.join(ctrlDir, url));
                if (ctrl) {
                    return resolve(ctrl.run, ctrl, ctx, mth, opt)
                        .then(r => _success(ctx, r))
                        .catch(e => _error(ctx, e));
                }
            } catch (e) {
                err = e;
            }
        }
        _error(ctx, XError.attach(XError.NotFound(), err));
    });
    app.use(BodyParser.raw({type: '*/*'}));
    app.use(ctrlBaseUrl, router);

    function _success(ctx, r) {
        if (!ctx.respond) {
            ctx.res.end(JSON.stringify({code: 100, data: r, info: 'success'}));
        }
    }

    function _error({res}, e) {
        if (!(e instanceof XError)) {
            e = XError.attach(XError.E('fail'), e);
        }
        let {code, extra, message: info} = e;
        res.json({code, extra, info});
        onError && onError(e);
    }
};

async function resolve(fn, ctrl, ctx, mth, opt) {
    let {auth} = opt
        , {req: {body, query}} = ctx
        , data;
    if (auth ? await auth.call(null, ctx) : true) {
        data = mth === 'POST' ? parseBody(body, ctrl.dataType) : query;
        if (!(ctrl.hasPermis(ctx) && ctrl.isCtxOk(ctx))) {
            throw XError.Permis();
        }
        return fn.call(ctrl, ctx, ctrl.wash(data));
    }
    throw XError.NotFound();
}


function parseBody(body, type) {
    switch (type) {
        case 'json':
            return body && JSON.parse(body) || {};
        case 'urlencode':
            return body && Querystring.parse(body.toString('utf-8')) || {};
        case 'raw':
            return body;
        case 'text':
            return body && body.toString('utf-8');
    }
}
