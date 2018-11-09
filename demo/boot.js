const Exboost = require('../lib');
const Path = require('path');
const XError = require('../lib/xerror')

process.env.DEBUG=''

Exboost({
    ctrlDir: Path.join(__dirname, './controllers')
    ,ctrlBaseUrl: '/'
    ,onError: function (e) {
        console.log(e);
    }
});
