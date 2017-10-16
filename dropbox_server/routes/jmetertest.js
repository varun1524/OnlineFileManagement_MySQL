let express = require('express');
let router = express.Router();
let mysql = require('./mysql');

router.get('/getUsers', function (req, res, next) {
    try {
        let fetchQuery="select * from users;";
        console.log("fetch Query : " + fetchQuery);

        mysql.fetchData(function(err,results){
            if(err){
                throw err;
            }
            else
            {
                if(results.length>0) {
                    res.status(201).send(results);
                }
                else {
                    res.status(204).send({"message":"Users table is empty"});
                }
            }
        },fetchQuery);
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});


module.exports = router;
