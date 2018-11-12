const Ctrl = require('../../lib/ctrl');

class Class extends Ctrl {
    constructor() {
        super();
        this.scopes = 'public';
    }

    async run(ctx, data) {
        ctx.raw('<h1>welcome to use exboost</h1>');
    }
}

module.exports = new Class();
