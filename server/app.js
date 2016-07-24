/**
 * Created by rishabh on 13/07/16.
 */
var express=require('express');
var path  = require("path");
var async  = require("async");
var app =new express();
var server = require('http').Server(app);
var bodyParser=require("body-parser");
var io=require('socket.io')(server);

var static=path.join(__dirname+"/../client/");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbInstance,userDetailCollection;

var mongoUrl = 'mongodb://localhost:20001/test';

server.listen('20000',function(){
    console.log(static);
    console.log('listening at 20000');
});
app.use(express.static(static));
app.use(bodyParser.urlencoded({ extended: true, limit:'1mb'}));

app.get('/',function(req,res){

    res.sendFile("index.html");
})

app.post('/register',register);
app.post('/login',login);
app.post('/addComment',addComment);
app.post('/getCommentsForUserPair',getCommentsForUserPair);



MongoClient.connect(mongoUrl, function(err, db) {
        dbInstance=db;
        console.log("Connected correctly to mongo db.");
});


function register(req,res){

    userDetailCollection= dbInstance.collection('userDetailCollection');
    var userName=req.body.userName;
    var password=req.body.password;
    async.waterfall([function(callback){
        userDetailCollection.find({'userName':userName}).toArray(function(err,result){
            if(result.length){
                callback({'err':'@alreadyExists'});
            }else{
              callback(err);
            }
        });
    },function(callback){
        userDetailCollection.insert({'userName':userName,'password':password},function(err,result){
            callback(err);
        });
    }],function(err,result){

        if(err){
            res.json(err);
        }else{
            res.json({"status":"ok"});
        }
    });
}

function login(req,res){

    userDetailCollection= dbInstance.collection('userDetailCollection');
    var userName=req.body.userName;
    var password=req.body.password;
    async.waterfall([function(callback){
        userDetailCollection.find({'userName':userName}).toArray(function(err,result){
            if(result.length ==1){
                callback(null);
            }else{
                callback({'err':'@notFound'});
            }
        });
    },function(callback){
        userDetailCollection.find({},{'userName':true}).toArray(function(err,result){
           if(result.length){


               io.emit('userListUpdate',result);
               callback(null);
           }
        });

    }],function(err,result){

        if(err){
            res.json(err);
        }else{
            res.json({"status":"ok"});
        }
    });
}
var onlineUsers={};


function addComment(req,res){

    // req.body is of the form {sender,reciever,createdAt,title,type}

   var commentDetailCollection= dbInstance.collection('commentDetailCollection');
   var comment=req.body;

   async.waterfall([function(callback){
        commentDetailCollection.insert(comment,function(err,result) {
            callback(err);
        });
    },
    function(callback){
        for(var i in onlineUsers){
            if(onlineUsers[i] === req.body.reciever){
                io.to(i).emit('message',req.body);
            }

        }
        callback(null);

    }],function(err,result){

       if(err) {
           res.json(err);
       }
       else{
           res.json({'status':'ok'});
       }
    });
}

function getCommentsForUserPair(req,res){
    var commentDetailCollection= dbInstance.collection('commentDetailCollection');
    var sender=req.body.thisUser;
    var reciever=req.body.chatPartner;
    commentDetailCollection.find({$or:[{sender:sender,reciever:reciever},{sender:reciever,reciever:sender}]}).sort({createdAt:1}).toArray(function(err,result){
        if(err){
            res.json({err:err});

        }else{
            res.json({status:'ok',data:result});
        }
    });
}


io.on('connect',function(socket) {
    socket.on('authenticated', function (data) {
        onlineUsers[socket.id]=data;
        emitOnlineStatus();
    });

    socket.on('disconnect',function(){
        delete onlineUsers[socket.id];
        emitOnlineStatus();
    });

});
function getOnlineUserList(){
    var result={};
    for(var i in onlineUsers){
        result[onlineUsers[i]]=i;
    }
    return result;
}
function emitOnlineStatus(){
    var onlineUsers=getOnlineUserList();
    io.emit("onlineUsersUpdate",onlineUsers);
}

