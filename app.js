var express = require('express'),
    engine = require('ejs-locals'),
    app = express();

exports.init = function(port) {
    
    app.locals({
        _layoutFile:'layout.ejs',
    });

    app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');

        app.use(express.compress());
        app.use(express.staticCache());
        app.use(express.static(__dirname + '/static', {maxAge: 86400000}));
        
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.cookieSession({cookie:{path:'/',httpOnly:true,maxAge:null},secret:'skeletor'}));
       
        app.use(app.router);
    });

    app.engine('ejs', engine);
    
    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
        // app.use(express.logger({ format: ':method :url' }));
    });

    app.configure('production', function(){
        app.use(express.errorHandler()); 
    })

    app.use(function(err, req, res, next){
        res.render('500.ejs', { locals: { error: err },status: 500 });	
    });
	
    var server = app.listen(port);
    console.log("Listening on port %d in %s mode", server.address().port, app.settings.env);
    return app;
    
}