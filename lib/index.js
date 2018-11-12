const DEFAULT_OPTIONS = {

    // 权限验证方法，必须为async function(ctx)
    auth: null

    ,enableCookie: false

    // jwt配置，必须先启用cookie，默认不启用，配置项为
    // { secret: jwt密钥,
    // cookieName: cookie名,
    // expire: cookie过期时间，单位秒,
    // varName: 解析后的jwt名称 }
    ,jwt: false

    // 控制器路径，必须为绝对路径
    ,ctrlDir: null

    //控制器请求路径，以/为开头
    ,ctrlBaseUrl: null

    // 配置静态资源服务
    // { path: 静态资源目录绝对路径, baseUrl: 请求静态资源的url，以/开头 }
    ,useStatic: null

    // http端口号
    ,port: 3006

    // 错误监听函数
    ,onError: null


    // 是否启用http log
    ,enableLog: false
};


const Express = require('express');
const Jwt = require('./util/jwt');
const Debug = require('debug')('exboost:init');
const Http = require('http');
const Finder = require('./finder');
const Morgan = require('morgan');
const LogFormat = ':method :url :remote-addr :user-agent :status  :res[content-length] - :response-time ms';

const Exboost = module.exports = {};

Exboost.start = function (options) {
    let port
        , app
        , server;

    app = Express();
    options = Object.assign({}, DEFAULT_OPTIONS, options || {});
    let { enableCookie, jwt, port: dfPort, enableLog, useStatic  } = options ;
    enableLog && app.use(Morgan(LogFormat));
    enableCookie && app.use(require('cookie-parser'));
    jwt && app.use(Jwt(jwt));
    useStatic && app.use(useStatic.url, Express.static(useStatic.path));
    Finder(app, options);

    port = _normalizePort(dfPort || '3006');
    server = Http.createServer(app);
    server.listen(port);
    server.on('error', _onError);
    server.on('listening', _onListening);
    return app;

    function _normalizePort(val) {
        let port = parseInt(val, 10);
        if (isNaN(port) || port <= 0) {
            throw new Error('无效的端口号！');
        }
        return port;
    }

    function _onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    function _onListening() {
        let addr = server.address()
            , bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        Debug('Listening on ' + bind);
    }
};

Exboost.XError = require('./xerror');
