var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var fs = require('fs');

/* GET Sign Up Page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/doSignUp', function(req, res, next){
    try {
        console.log(req.body);
        // var input = JSON.parse(JSON.stringify(req.body));

        var data ={
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            username : req.body.username,
            password : req.body.password
        };

        var fetchUser="select username from users where username = '"+ data.username+"'";

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
                    res.status(301).json({message: "username already exist"})
                }
                else{
                    var insertUser="insert into users (username,firstname,lastname,password) values('"+data.username+"','"+data.firstname+"','"+data.lastname+"','"+data.password+"');";
                    console.log("Insert Query : " + insertUser);
                    //var insertUser="insert into users (username, firstname, lastname, password, address) values('varun@yahoo.com','varun','shah','varun123','1246 alameda')";

                    mysql.insertData(function(err,results){
                        console.log(results);
                        if(err){
                            throw err;
                        }
                        else
                        {
                            console.log("Affected Rows: "+results.affectedRows);
                            console.log(results);
                            if(results.affectedRows === 1){
                                console.log("valid Login");
                                res.status(201).json({message: "Signup successful"});
                                createUserDirectory(data.username);
                            }
                            else {
                                console.log("Error while inserting data into database");
                                res.status(401).json({message: "Signup Failed"});
                            }
                        }
                    },insertUser);
                }
            }
        }, fetchUser);
    }
    catch (e){
        console.log(e);
        res.status(401).json({message: "Signup Failed"});
    }
});

function createUserDirectory(user){
    try {
        if(fs.existsSync('./dropboxstorage')){
            let userdirpath="./dropboxstorage/" + user;
            console.log(userdirpath);
            let userPath = fs.mkdirSync(userdirpath);
            console.log(userPath);
        }
        else{
            console.log("dropboxstorage does not exist");
        }
    }
    catch(e) {
        throw e;
    }
}

module.exports = router;
