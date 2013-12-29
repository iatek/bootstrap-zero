var port = process.env.PORT || 4000,
    app = require('./app').init(port),
    utils = require('./utils'),
    conf = require('./conf'),
    request = require('request'),
    pageSize = 20;
   
    
app.get('/', function(req, res){

    var templates = require('./templates');
    res.render("index",{templates:templates,utils:utils});
    
});

app.get('/templates/:id', function(req, res){

    console.log("/templates.......");

    var templates = require('./templates');
    var id = req.params.id;
   
    if (typeof id==="undefined") {
        return;
    }
    
    for (var t in templates) {
    
        console.log("t..."+t);
    
        if (templates[t].id===id) {
            res.render("detail",{template:templates[t],utils:utils});
        }    
        
    }
    
    res.render("404",{error:"no results"});
    
    //res.render("index",{templates:data,utils:utils});
    
});

app.get('/api/templates', function(req, res){
    var fs = require('fs');
    
   //fs.readFile('./templates.json', 'utf8', function (err, data) {
    //    res.json(data);
    //});
    
    var data = require('./templates');
    res.json(data);
    
    //var fileJSON = require('./static/templates.json');
    //res.send(fileJSON);

    //fs.readFile('./templates.json', 'utf8', function (err, data) {
    //    res.send(data);
    //});
    
    //res.writeHead(200, {"Content-Type": "application/json"});
    //fs.createReadStream('templates.json',{flags:'r',encoding:'utf-8'}).pipe(res);
    
});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs');
});

