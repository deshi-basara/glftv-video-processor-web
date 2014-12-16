module.exports = Risotto.Application.extend({

    // process title
    title: "GLF-Video-Processor Beta 1",

    onAuthorizationError : function*(koaContext, next){
        //do something onAuthorizationError
    },

    onNotFoundError : function*(koaContext, next){
        // do something onNotFoundError
    },

    onError : function*(koaContext, next){
        // do something onError
    }

});