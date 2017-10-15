let mysql = require('./mysql');
// let router = express.Router();

function insertIntoActivity (callback ,username, activitytype, itemid, activitytime){
    try{
        let dataInserted=false;

        if(activitytime===null || activitytime===undefined || activitytime==="") {
            activitytime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        let insertQuery="";


        if(itemid!==null && itemid!==undefined && itemid!=="") {
            activitytime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            insertQuery = "insert into storageactivities (itemid, activitytype, username, activitytime) " +
                "values('" + itemid + "','" + activitytype + "','" + username + "','" + activitytime + "');";
            console.log("Insert Query : " + insertQuery);
        }
        else {
            insertQuery = "insert into useractivities (activitytype, username, activitytime) " +
                "values('" + activitytype + "','" + username + "','" + activitytime + "');";
            console.log("Insert Query : " + insertQuery);
        }

        mysql.insertData(function (err, results) {
            console.log(results);

            if (err) {
                console.log(err);
            }
            else {
                console.log("Affected Rows: " + results.affectedRows);
                console.log(results);
                if (results.affectedRows === 1) {
                    console.log("activity added successfully");
                    dataInserted=true;
                }
                else {
                    console.log("Error while inserting data into database");
                }
            }
            callback(err, dataInserted)
        }, insertQuery);
    }
    catch (e){
        console.log(e);
    }
}

exports.insertIntoActivity = insertIntoActivity;
// module.exports = router;