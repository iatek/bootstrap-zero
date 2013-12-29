var port = process.env.PORT || 4000,
    app = require('./app').init(port),
    utils = require('./utils'),
    conf = require('./conf'),
    request = require('request'),
    pageSize = 20;
   
    
app.get('/', function(req, res){

    request.get({url:'/api/templates',json:true},function(e,r,b){
         
        var j = JSON.parse(b);
        
        //console.log(j);
        
        res.render("index",{templates:j.templates,utils:utils});
         
    });
    
});

app.get('/api/templates', function(req, res){
    var fs = require('fs');
    
   //fs.readFile('./templates.json', 'utf8', function (err, data) {
    //    res.json(data);
    //});
    
    var data = require('./templates');
    res.send(data);
    
    //var fileJSON = require('./static/templates.json');
    //res.send(fileJSON);

    //fs.readFile('./templates.json', 'utf8', function (err, data) {
    //    res.send(data);
    //});
    
    //res.writeHead(200, {"Content-Type": "application/json"});
    //fs.createReadStream('templates.json',{flags:'r',encoding:'utf-8'}).pipe(res);
    
});

    
app.get('/:page?', function(req,res){
    
    var offset = 0
    var page = (req.params.page)||1;
   
    if (page>1) {
        offset = ((page*pageSize)+1)-pageSize ;
    }
    
    console.log("page.......");
    
    request.get({url:'https://api.parse.com/1/classes/Post',json:true,qs:{limit:pageSize,count:1,skip:offset,order:"-createdAt"},headers:{'X-Parse-Application-Id':conf.parse.appKey,'X-Parse-REST-API-Key':conf.parse.restKey}},function(e,r,b){
        if (b.results) {
            res.render("index",{stories:b.results,count:b.count,page:page,utils:utils});
        }
        else {
            //next();
            res.json({error:"no results"});
        }
    });
    
});

app.get('/tag/:tag/:page?', function(req,res){
    
    console.log("/tag");
    
    var tag = req.params.tag;
    var whereClause = {tags:{"$all":[tag]}};
    var offset = 0;
    var page = (req.params.page)||1;
    
    if (page>1) {
        offset = ((page*pageSize)+1)-pageSize;
    }

    request.get({url:'https://api.parse.com/1/classes/Post',json:true,qs:{limit:pageSize,count:1,where:JSON.stringify(whereClause)},headers:{'X-Parse-Application-Id':conf.parse.appKey,'X-Parse-REST-API-Key':conf.parse.restKey}},function(e,r,b){
        if (b.results && b.results.length>0) {
            res.render("index",{stories:b.results,count:b.count,page:page,utils:utils});
        }
        else {
            res.json({error:"no results for tag"+tag});
            //console.log("no /tag get next");
        }
    });
});




app.post("/post",function(req, res){
    
    console.log("post /post..");
    
    var p = req.body;
    
    request.post({url:'http://in1-api.herokuapp.com/post',json:true,
        body:p}, function (e,r,b){
        console.log("wrote post to in1 api....."+e);
        
        if (e) {
            res.json({error:"no write"});
        }
        else {
            //var objectId = b.objectId;
            res.json({status:1});      
        }
        
    });
});

/* The 404 Route (ALWAYS Keep this as the last route) */
app.get('/*', function(req, res){
    res.render('404.ejs');
});

