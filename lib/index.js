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

    // 控制器路径
    ,ctrlDir: null

    //控制器请求路径
    ,ctrlBaseUrl: null

    // http端口号
    ,port: 3006

    // 错误监听函数
    ,onError: null
};


const Express = require('express');
const Jwt = require('./util/jwt');
const Debug = require('debug')('server:server');
const Http = require('http');
const Finder = require('./finder');

let port;
let app;
let server;

module.exports = function (options) {
    if(!app) {
        app = Express();
        options = Object.assign({}, DEFAULT_OPTIONS, options || {});
        let { enableCookie, jwt, port: dfPort  } = options ;
        jwt && app.use(Jwt(jwt));
        enableCookie && app.use(require('cookie-parser'));
        Finder(app, options);

        port = normalizePort(dfPort || '3006');
        server = Http.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    }
    return app;
};


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
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

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    Debug('Listening on ' + bind);
}
