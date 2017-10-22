// var mysql = require('./mysql');
// var router = express.Router();
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/dropbox";


function insertIntoActivity (callback ,username ,activitytype ,itemid ,activitytime){
    try{
        var dataInserted=false;

        if(activitytime===null || activitytime===undefined || activitytime==="") {
            activitytime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        var activityData;


        if(itemid!==null && itemid!==undefined && itemid!=="") {
            activitytime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            activityData = {
                itemid : itemid,
                activitytype : activitytype,
                username : username,
                activitytime : activitytime
            };
        }
        else {
            activityData = {
                itemid : null,
                activitytype : activitytype,
                username : username,
                activitytime : activitytime
            };
        }


        mongo.connect(mongoURL, function () {
            var activity = mongo.collection("activity");
            activity.insertOne(activityData, function (err, results) {
                console.log(results);
                if (err) {
                    console.log(err);
                }
                else {
                    if (results.insertedCount === 1) {
                        console.log("activity added successfully");
                        dataInserted=true;
                    }
                    else {
                        console.log("Error while inserting data into database");
                    }
                }
                callback(err, dataInserted)
            });
        });
    }
    catch (e){
        console.log(e);
    }
}

exports.insertIntoActivity = insertIntoActivity;
// module.exports = router;