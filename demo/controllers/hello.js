const Ctrl = require('../../lib/ctrl');

class Class extends Ctrl {
    constructor() {
        super();
        this.scopes = 'public';
        this.inputSchema = {name: {type: 'string'}};
    }

    async run(ctx, data) {
        return `hello ${data.name}`;
    }
}

module.exports = new Class();
