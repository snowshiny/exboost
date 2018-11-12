const Exboost = require('../lib');
const Path = require('path');

Exboost.start({
    ctrlDir: Path.join(__dirname, './controllers')
    ,ctrlBaseUrl: '/'
    ,enableLog: true
    ,onError: function (e) {
        console.log(e);
    }
});
