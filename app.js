var restify = require('restify');
var mongojs = require("mongojs");

var ip_addr = '127.0.0.1';
var port    =  '3000';

var server = restify.createServer({
    name : "myapp"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.fullResponse());

//var connection_string = '127.0.0.1:27017/myapp';
var connection_string = 'mongodb://jobs:jobs1200@paulo.mongohq.com:10068/jobs';
var db = mongojs(connection_string, ['jobs']);
var jobs = db.collection("jobs");


//routes
var PATH = '/jobs'
server.get({path : PATH , version : '0.0.1'} , findAllJobs);
server.get({path : '/temp' , version : '0.0.1'} , addTempJob);
server.get({path : PATH +'/:jobId' , version : '0.0.1'} , findJob);
server.get({path : PATH +'/:jobId/title' , version : '0.0.1'} , findJobTitle);
server.post({path : PATH , version: '0.0.1'} ,postNewJob);
server.del({path : PATH +'/:jobId' , version: '0.0.1'} ,deleteJob);

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});


//methods
function findAllJobs(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    jobs.find().limit(20).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }

    });

}

function findJob(req, res , next)
{
    res.setHeader('Access-Control-Allow-Origin','*');
    jobs.findOne({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }
        return next(err);
    })
}

function findJobTitle(req,res,next)
{
    res.setHeader('Access-Control-Allow-Origin','*');
    jobs.findOne({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success.title);
            return next();
        }
        return next(err);
    })
}

function postNewJob(req , res , next){
    var job = {};
    job.title = req.params.title;
    job.description = req.params.description;
    job.location = req.params.location;
    job.postedOn = new Date();

    res.setHeader('Access-Control-Allow-Origin','*');

    jobs.save(job , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , job);
            return next();
        }else{
            return next(err);
        }
    });
}

function addTempJob (req, res, next){
    var job = {};
    job.title = "Voorbeeld title";
    job.description = "voorbeeld omschrijving";
    job.location = "Eindhoven";
    job.postedOn = new Date();

    res.setHeader('Access-Control-Allow-Origin','*');

    jobs.save(job , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , job);
            return next();
        }else{
            return next(err);
        }
    });
}

function deleteJob(req , res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    jobs.remove({_id:mongojs.ObjectId(req.params.jobId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();
        } else{
            return next(err);
        }
    })

}