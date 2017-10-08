var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/doLogin', function(req, res, next){
    try {
        console.log(req.body);
        // var input = JSON.parse(JSON.stringify(req.body));

        let data ={
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            username : req.body.username,
            password : req.body.password
        };

        let fetchUser="select username from users where username = '"+
            data.username+"' AND password= '"+data.password+"'";

        mysql.fetchData(function (err,results) {
            console.log(results);
            console.log(results.length);
            if(err){
                throw err;
            }
            else
            {
                if(results.length===1){
                    console.log("User Exists");
                    req.session.username=data.username;
                    console.log(req.session);
                    res.status(201).send(req.sessions);
                }
                else{
                    res.status(301).json({message: "username or password does not exist"});
                }
            }
        }, fetchUser);
    }
    catch (e){
        console.log(e);
        res.status(401).json({message: "Signup Failed"});
    }
});

router.post('/doLogout', function(req, res, next){
    try {
        req.session.destroy();
        console.log(req.session);
        // var input = JSON.parse(JSON.stringify(req.body));
        res.status(201).json({message:"User logged out Successfully"});
    }
    catch (e){
        console.log(e);
        res.status(401).json({message: "Logout Failed"});
    }
});

router.get('/getSession', function(req, res, next){
    try {
        if(req.session.username!==undefined) {
            res.status(201).send(req.session);
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
        // var input = JSON.parse(JSON.stringify(req.body));
    }
    catch (e){
        console.log(e);
        res.status(401).json({message: "Signup Failed"});
    }
});

module.exports = router;
