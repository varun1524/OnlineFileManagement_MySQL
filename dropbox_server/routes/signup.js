let express = require('express');
let router = express.Router();
let mysql = require('./mysql');
let fs = require('fs');

let act = require('./activity');
let bcrypt = require('bcrypt');


/* GET Sign Up Page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/doSignUp', function(req, res, next){
    try {
        console.log(req.body);
        // var input = JSON.parse(JSON.stringify(req.body));

        let data ={
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            username : req.body.username,
            password : req.body.password
        };

        let fetchUser="select username from users where username = '"+ data.username+"'";

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

                    let salt = bcrypt.genSaltSync(10);

                    let hash = bcrypt.hashSync(data.password, salt);

                    console.log(salt);
                    console.log(hash);

                    let insertUser="insert into users (username,firstname,lastname,hashpassword, salt) " +
                        "values('"+data.username+"','"+data.firstname+"','"+data.lastname+"','"+hash+"','"+salt+"');";
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
                                console.log("Sign up successful");
                                insertUser="insert into userprofile (overview,work,education,contactinfo, lifeevents, music, sports, reading, username) " +
                                    "values('','','','','',false,false,false,'"+ data.username +"');";
                                mysql.insertData(function (err, result2) {
                                    console.log(result2);
                                    if(err){
                                        console.log(err);
                                        throw "Error while adding data into userprofile table";
                                    }
                                    act.insertIntoActivity(function (err, results3) {
                                        if(err){
                                            console.log(err);
                                            res.status(301).json({message: "Signup Successful. Failed to add user activity"});
                                        }
                                        console.log(results3);
                                        res.status(201).json({message: "Signup successful"});
                                        createUserDirectory(data.username);
                                    },data.username, "signup");
                                },insertUser);
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
            let userPath = fs.mkdir(userdirpath);
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
