module.exports = {
    respond : false,

    redirect: function (url) {
        this.respond = true;
        this.res.redirect(url);
    }
    ,raw: function(raw){
        this.respond = true;
        this.res.end(raw);
    }
};
