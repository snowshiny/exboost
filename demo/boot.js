const Exboost = require('../lib');
const Path = require('path');

Exboost.start({
    ctrlDir: Path.join(__dirname, './controllers')
    ,ctrlBaseUrl: '/'
    ,enableLog: true
    ,port: 3007
    ,onError: function (e) {
        console.log(e);
    }
});
