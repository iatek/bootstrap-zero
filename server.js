var port = process.env.PORT || 4000,
    app = require('./app').init(port),
    utils = require('./utils'),
    conf = require('./conf'),
    request = require('request'),
    pageSize = 20;
   
    
app.get('/', function(req, res){

    var templates = require('./templates');
    var starters = [], themes = [];
    
    for (var i=0;i<templates.length;i++) {
    
        if (templates[i].tags.indexOf("starter")!=-1) {
            starters.push(templates[i]);    
        }
        
        if (templates[i].tags.indexOf("theme")!=-1) {
            themes.push(templates[i]);  
        } 
    }
    
    res.render("index",{templates:templates,starters:starters,themes:themes,path:"/"});
    
});

app.get('/templates/:id', function(req, res){

    console.log("/templates.......");

    var templates = require('./templates');
    var id = req.params.id;
   
    if (typeof id==="undefined") {
        return;
    }
    
    for (var i=0;i<templates.length;i++) {
    
        var prev = (templates[i-1])||templates[templates.length-1];
        var next = (templates[i+1])||templates[0];
    
        if (templates[i].id===id) {
            res.render("detail",{template:templates[i],next:next,prev:prev,title:templates[i].title+" Bootstrap template",desc:"Bootstrap " + templates[i].title + " template example. This is a free, responsive starter template and theme for Bootstrap 3 from BootstrapZero.",utils:utils});
            return;
        }    
        
    }
    
    res.render("404",{error:"no results"});
    
});

app.get('/bootstrap-template/:title', function(req, res){

    console.log("/template by title.......");

    var templates = require('./templates');
    var title = req.params.title;
   
    if (typeof title==="undefined") {
        return;
    }
    else {
        title = title.replace(/-/g," ");
    }
    
    for (var i=0;i<templates.length;i++) {
    
        var prev = (templates[i-1])||templates[templates.length-1];
        var next = (templates[i+1])||templates[0];
    
        if (templates[i].title.toLowerCase()===title.toLowerCase()) {
            res.render("detail",{template:templates[i],next:next,prev:prev,title:"Bootstrap "+title+" template",desc:"Bootstrap " + title + " template example. This is a free, responsive starter template and theme for Bootstrap 3 from BootstrapZero.",keywords:"bootstrap,"+templates[i].tags+",free,bootstrap template"});
            return;
        }    
        
    }
    
    res.render("404",{error:"no results"});
    
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
    
    //res.writeHead(200, {"Content-Type": "application/json"});
    //fs.createReadStream('templates.json',{flags:'r',encoding:'utf-8'}).pipe(res);
    
});

app.get('/bootstrap-templates', function(req, res){

    console.log("/templates list.......");
    var templates = require('./templates');
    
    res.render("list",{templates:templates,utils:utils,tag:"Bootstrap",title:"Free bootstrap themes and template",desc:"Bootstrap templates and examples. A collection of free, responsive starter templates and themes for Bootstrap from BootstrapZero."});
});

app.get('/bootstrap-templates/:tag', function(req, res){

    var templates = require('./templates');
    var tag = req.params.tag;
    var tagged = [];
    
    for (var i=0;i<templates.length;i++) {
    
        if (templates[i].tags.indexOf(tag)!=-1) {
            tagged.push(templates[i]);    
        }
    }
    
    res.render("list",{templates:tagged,utils:utils,tag:tag});
    
});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs');
});

