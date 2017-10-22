let express = require('express');
let router = express.Router();
let multer = require('multer');
// let glob = require('glob');
let act = require('./activity');
let fs = require('fs');
let shell = require('shelljs');
let mongo = require("./mongo");
let mongoURL = "mongodb://localhost:27017/dropbox";
// let fse = require('fs-extra');
let filePath="";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(filePath);
        if(req.session.username!==undefined) {
            cb(null, "./dropboxstorage/" + req.session.username + "/" + filePath);
        }
        else{
            res.status(203).send({"message" : "Session Expired. Login Again"});
        }
    },
    filename: function (req, file, cb) {
        let dirpath = "./dropboxstorage/" + req.session.username + "/" + filePath;
        let filename=file.originalname;
        console.log("IMP");
        doesExist(function (err, result) {
            console.log("Does Exist: "+result);
            if(!result){
                let username = req.session.username;
                if(insertIntoStorage(function (err, result) {
                        if(err){

                        }
                        if(result){
                            console.log("File added in file system as well as database");
                            cb(null, filename) ;
                            deleteIfNotAvailableInStore(filename, dirpath);
                        }
                        else {
                            console.log("Failed to add file into database");
                        }
                    } ,file.originalname, dirpath, "f", username)){
                    console.log("Successfully added "+file.originalname +" into database");
                }
                else {
                    console.log("Failed to add "+file.originalname +" into database");
                }
            }
            else {
                console.log("File already exists in database");
            }
        }, filename, dirpath, Date.toLocaleString());

    }
});

let upload = multer({storage:storage}).any();

/* GET users listing. */
router.post('/getDirData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            console.log("In get dir data");
            console.log(req.body.path);
            let clientPath = req.body.path;
            let dirpath;
            if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            }
            else {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            }
            console.log(dirpath);

            // let files = fs.readdirSync(dirpath);
            // console.log(files);
            let jsonObj = [];
            let i = 0;
            dirpath=dirpath.replace("//","/");
            let fetchQuery = "select * from dropboxstorage where path = '" + dirpath+"'";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                // console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};
                            console.log(results[i].path);
                            tempObj["id"] = results[i].id;
                            tempObj["name"] = results[i].name;
                            tempObj["type"] = results[i].type;
                            tempObj["ctime"] = results[i].creationtime;
                            // tempObj["mtime"] = results[i].modifiedtime;
                            tempObj["path"] = results[i].path;
                            tempObj["size"] = results[i].size;
                            tempObj["starred"] = results[i].starred;
                            tempObj["sharedstatus"] = results[i].sharedstatus;
                            jsonObj.push(tempObj);
                        }
                        res.status(201).send(jsonObj);
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                }
            },fetchQuery);
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/createDir', function(req, res, next){
    try{
        console.log("in create directory");
        console.log(req.session.username);
        console.log(req.body.directoryName);
        let receivedPath = req.body.dirpath;
        let receivedName = req.body.directoryName;
        if(req.session.username!==undefined){
            let username = req.session.username;
            let userDirpath = "./dropboxstorage/"+username+"/"+receivedPath;
            if(fs.existsSync(userDirpath)){
                let createDirpath = userDirpath + receivedName;
                console.log("Create Directory Path: "+createDirpath);
                console.log("Parent Directory Path: "+userDirpath);
                if(!fs.existsSync(createDirpath)) {

                    insertIntoStorage(function (err, result) {
                        if(err){
                            res.status(301).send({message: "Error while adding directory data into database"});
                        }
                        if(result){
                            fs.mkdir(createDirpath, null, function (err) {
                                console.log(err);
                                if (err) {
                                    throw ("failed to create directory" + err);
                                }
                                console.log("Directory Created Successfully");
                                res.status(201).send({message: "Directory Created Successfully"});
                            });
                        }
                        else {
                            res.status(301).send({message: "Error while adding directory data into database"});
                        }
                    },req.body.directoryName, userDirpath, "d", username);

                }
                else {
                    res.status(301).send({message: "Directory already exists"});
                }
            }
            else{
                throw "Error while creating directory";
            }
        }
        else{
            throw "Session Expired. Please login again.";
        }
    }
    catch (e)
    {
        console.log(e);
        res.status(301).json({message:e});
    }
});

router.post('/share', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let recUserArr = req.body.userdata;
            let itemid = req.body.itemid;
            console.log(recUserArr);
            console.log(itemid);
            let message = [];
            let username = req.session.username;

            recUserArr.map((user) => {
                if (username !== user) {
                    let fetchQuery = "select count(*) as records from users where username = '" + user+ "';";
                    console.log("Fetch Query: " + fetchQuery);
                    console.log(user);
                    mysql.fetchData(function (err, results) {
                        console.log("Fetched Records: " + results[0].records);
                        if (err) {
                            console.log(err);
                            message.push({user:"Error in sharing data."});
                        }
                        else if (results[0].records === 0) {
                            message.push({ user : "User does not have account in dropbox."});
                        }
                        else if(results[0].records===1){
                            let fetchQuery1 = "select count(*) as records from sharedetails where shareditemid = '"+itemid+"' " +
                                "AND sharedwith = '"+user+"';";
                            mysql.fetchData(function (err, result) {
                                if(err){
                                    message.push({user:"data shared with user successfully"});
                                }
                                else if(result[0].records === 1){
                                    console.log("User " + user + " already have access to shared item.");
                                    message.push({ user : "User already have access to shared item."});
                                }
                                else if(result[0].records === 0){

                                    // recUserArr.
                                    let insertQuery = "insert into sharedetails (shareditemid, sharedwith) " +
                                        "values('" + itemid + "','" + user + "');";
                                    console.log("Insert Query : " + insertQuery);

                                    mysql.insertData(function (err, results) {
                                        console.log(results);
                                        if (err) {
                                            console.log("Error: " + err);
                                            message.push({user : "Error while inserting data into database"});
                                            // res.status(301).send({"message": "Error while sharing data"});
                                        }
                                        else if (results.affectedRows === 1) {
                                            let updateQuery = "update dropboxstorage set sharedstatus = true where id = '" + itemid + "';";
                                            mysql.updateData(function (err, results) {
                                                if (err) {
                                                    // res.status(301).send({"message": "Error while sharing data"});
                                                    console.log(err);
                                                    message.push({user:"Error while sharing data with this user successfully"});
                                                }
                                                else if (results.affectedRows === 1) {
                                                    message.push({user:"data shared with user successfully"});
                                                    act.insertIntoActivity(function (err, results2) {
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                        if (message.length===recUserArr.length) {
                                                            console.log(message);
                                                            res.status(201).send(message);
                                                        }
                                                        console.log("Activity added : "+results2)
                                                    }, username, "share", itemid);
                                                    console.log("Shared status updated to true successfully in dropboxstorage");
                                                }
                                                else {
                                                    message.push({user:"could not share data with this user"});
                                                    console.log("Failed to update Shared status in dropboxstorage");
                                                }
                                            }, updateQuery);
                                            dataInserted = true;
                                        }
                                        else {
                                            console.log("Error while inserting data into database");
                                        }
                                    }, insertQuery);
                                }
                            },fetchQuery1);
                        }
                        console.log(message.length);
                        console.log(recUserArr.length);


                    }, fetchQuery);
                }
            });

        }
        else{
            res.status(203).json({"message":"Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/changestarredstatus', function (req, res, next) {
    try {
        if(req.session.username!==undefined) {
            let username = req.session.username;
            console.log(JSON.stringify(req.body));
            let itemid = req.body.id;
            let changeStatusTo = req.body.changeStatusTo;


            let updateQuery = "update dropboxstorage set starred = " + changeStatusTo + " where id = '" + itemid + "';";

            mysql.updateData(function (err, results) {
                if (err) {
                    console.log(err);
                }
                else if (results.affectedRows === 1) {
                    console.log("Shared status updated to true successfully in dropboxstorage");
                    let activityType;
                    if(changeStatusTo) {
                        activityType = "starred";
                    }
                    else {
                        activityType = "unstarred";
                    }
                    act.insertIntoActivity(function (err, results2) {
                        if(err){
                            console.log(err);
                        }
                        console.log("Activity added : "+results2)
                    }, username,activityType , itemid);
                    res.status(201).send({"message":"starred status updated successfully"});
                }
                else {
                    console.log("Failed to update Starred status in dropboxstorage");
                }
            }, updateQuery);
        }
        else {
            res.status(203).json({"message": "Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/getStarredData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let clientPath = req.body.path;
            let dirpath;
            if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            }
            else {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            }
            console.log(dirpath);

            let files = fs.readdirSync(dirpath);
            console.log(files);
            let jsonObj = [];
            let i = 0;
            // if(files.length>0) {
            // files.map((file) => {
            //     let tempObj = {};
            //     // console.log(dirpath + file);
            //     fs.lstat((dirpath + file), function (err, stats) {
            //         if (err) {
            //             throw ("Error while fetching list of files/folders .Error: " + err)
            //         }
            //         // console.log(stats);
            //
            //         if (stats.isFile()) {
            //             // console.log('file');
            //             type = "file";
            //         }
            //         if (stats.isDirectory()) {
            //             // console.log('directory');
            //             type = "directory";
            //         }
            //
            //         tempObj["name"] = file;
            //         tempObj["type"] = type;
            //         tempObj["ctime"] = stats["ctime"];
            //         tempObj["mtime"] = stats["mtime"];
            //         tempObj["size"] = stats["size"];
            //
            //         let isFavourite=false;
            //
            //         let insertQuery="update into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) values('"+name+"','"+type+"','"+path+"','"+ctime+"','"+mtime+"','"+size+"','"+username+"');";
            //         console.log("Insert Query : " + insertQuery);
            //
            //         mysql.fetchData(function(err,results){
            //             console.log(results);
            //             if(err){
            //                 throw err;
            //             }
            //             else
            //             {
            //                 console.log("Affected Rows: "+results.affectedRows);
            //                 console.log(results);
            //                 if(results.affectedRows === 1){
            //                     console.log("valid Login");
            //                     return true;
            //                 }
            //                 else {
            //                     console.log("Error while inserting data into database");
            //                     return false;
            //                 }
            //             }
            //         },insertQuery);
            //
            //         tempObj["favourite"] = isFavourite;
            //
            //         jsonObj.push(tempObj);
            //         // console.log(jsonObj);
            //         // console.log(jsonObj.length);
            //         if (jsonObj.length === files.length) {
            //             // console.log(jsonObj);
            //             res.status(201).send(jsonObj);
            //         }
            //         i = i + 1;
            //     });
            // });

            dirpath=dirpath.replace("//","/");
            let fetchQuery="select * from dropboxstorage where path LIKE '" + dirpath+"%' AND starred = "+ true +";";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                // console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};
                            console.log(results[i].path);
                            tempObj["id"] = results[i].id;
                            tempObj["name"] = results[i].name;
                            tempObj["path"] = results[i].path;
                            tempObj["type"] = results[i].type;
                            tempObj["ctime"] = results[i].creationtime;
                            tempObj["size"] = results[i].size;
                            tempObj["starred"] = results[i].starred;
                            tempObj["sharedstatus"] = results[i].sharedstatus;
                            jsonObj.push(tempObj);
                        }
                        res.status(201).send(jsonObj);
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                }
            },fetchQuery);
        }
        else{
            res.status(204).send({"message":"Directory is Empty"});
        }
        // }
        // else{
        //     res.status(203).send({"message":"Session Expired. Please Login Again"});
        // }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/getDataSharedByUser', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let clientPath = req.body.path;
            let dirpath;
            if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            }
            else {
                dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            }
            console.log(dirpath);

            let files = fs.readdirSync(dirpath);
            console.log(files);
            let jsonObj = [];
            let i = 0;
            // if(files.length>0) {
            // files.map((file) => {
            //     let tempObj = {};
            //     // console.log(dirpath + file);
            //     fs.lstat((dirpath + file), function (err, stats) {
            //         if (err) {
            //             throw ("Error while fetching list of files/folders .Error: " + err)
            //         }
            //         // console.log(stats);
            //
            //         if (stats.isFile()) {
            //             // console.log('file');
            //             type = "file";
            //         }
            //         if (stats.isDirectory()) {
            //             // console.log('directory');
            //             type = "directory";
            //         }
            //
            //         tempObj["name"] = file;
            //         tempObj["type"] = type;
            //         tempObj["ctime"] = stats["ctime"];
            //         tempObj["mtime"] = stats["mtime"];
            //         tempObj["size"] = stats["size"];
            //
            //         let isFavourite=false;
            //
            //         let insertQuery="update into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) values('"+name+"','"+type+"','"+path+"','"+ctime+"','"+mtime+"','"+size+"','"+username+"');";
            //         console.log("Insert Query : " + insertQuery);
            //
            //         mysql.fetchData(function(err,results){
            //             console.log(results);
            //             if(err){
            //                 throw err;
            //             }
            //             else
            //             {
            //                 console.log("Affected Rows: "+results.affectedRows);
            //                 console.log(results);
            //                 if(results.affectedRows === 1){
            //                     console.log("valid Login");
            //                     return true;
            //                 }
            //                 else {
            //                     console.log("Error while inserting data into database");
            //                     return false;
            //                 }
            //             }
            //         },insertQuery);
            //
            //         tempObj["favourite"] = isFavourite;
            //
            //         jsonObj.push(tempObj);
            //         // console.log(jsonObj);
            //         // console.log(jsonObj.length);
            //         if (jsonObj.length === files.length) {
            //             // console.log(jsonObj);
            //             res.status(201).send(jsonObj);
            //         }
            //         i = i + 1;
            //     });
            // });

            dirpath=dirpath.replace("//","/");
            let fetchQuery="select * from dropboxstorage where path LIKE '" + dirpath+"%' AND sharedstatus = "+ true +";";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                // console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};
                            console.log(results[i].path);
                            tempObj["id"] = results[i].id;
                            tempObj["name"] = results[i].name;
                            tempObj["path"] = results[i].path;
                            tempObj["type"] = results[i].type;
                            tempObj["ctime"] = results[i].creationtime;
                            tempObj["size"] = results[i].size;
                            tempObj["starred"] = results[i].starred;
                            tempObj["sharedstatus"] = results[i].sharedstatus;
                            jsonObj.push(tempObj);
                        }
                        res.status(201).send(jsonObj);
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                }
            },fetchQuery);
        }
        else{
            res.status(204).send({"message":"Directory is Empty"});
        }
        // }
        // else{
        //     res.status(203).send({"message":"Session Expired. Please Login Again"});
        // }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/fetchDataSharedWithUser', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            let clientPath = req.body.path;
            // let dirpath;
            // if (clientPath === "" || clientPath === null || clientPath === undefined || clientPath === "/") {
            //     dirpath = ("./dropboxstorage/" + req.session.username + "/" );
            // }
            // else {
            //     dirpath = ("./dropboxstorage/" + req.session.username + "/" + clientPath);
            // }
            // console.log(dirpath);

            // let files = fs.readdirSync(dirpath);
            // console.log(files);
            let jsonObj = [];
            let i = 0;
            // if(files.length>0) {
            // files.map((file) => {
            //     let tempObj = {};
            //     // console.log(dirpath + file);
            //     fs.lstat((dirpath + file), function (err, stats) {
            //         if (err) {
            //             throw ("Error while fetching list of files/folders .Error: " + err)
            //         }
            //         // console.log(stats);
            //
            //         if (stats.isFile()) {
            //             // console.log('file');
            //             type = "file";
            //         }
            //         if (stats.isDirectory()) {
            //             // console.log('directory');
            //             type = "directory";
            //         }
            //
            //         tempObj["name"] = file;
            //         tempObj["type"] = type;
            //         tempObj["ctime"] = stats["ctime"];
            //         tempObj["mtime"] = stats["mtime"];
            //         tempObj["size"] = stats["size"];
            //
            //         let isFavourite=false;
            //
            //         let insertQuery="update into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) values('"+name+"','"+type+"','"+path+"','"+ctime+"','"+mtime+"','"+size+"','"+username+"');";
            //         console.log("Insert Query : " + insertQuery);
            //
            //         mysql.fetchData(function(err,results){
            //             console.log(results);
            //             if(err){
            //                 throw err;
            //             }
            //             else
            //             {
            //                 console.log("Affected Rows: "+results.affectedRows);
            //                 console.log(results);
            //                 if(results.affectedRows === 1){
            //                     console.log("valid Login");
            //                     return true;
            //                 }
            //                 else {
            //                     console.log("Error while inserting data into database");
            //                     return false;
            //                 }
            //             }
            //         },insertQuery);
            //
            //         tempObj["favourite"] = isFavourite;
            //
            //         jsonObj.push(tempObj);
            //         // console.log(jsonObj);
            //         // console.log(jsonObj.length);
            //         if (jsonObj.length === files.length) {
            //             // console.log(jsonObj);
            //             res.status(201).send(jsonObj);
            //         }
            //         i = i + 1;
            //     });
            // });

            // dirpath=dirpath.replace("//","/");
            let fetchQuery="select * from sharedetails where sharedwith='" + username+"';";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                // console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};

                            fetchQuery = "select * from dropboxstorage where id = '"+ results[i].shareditemid+"';";
                            mysql.fetchData(function(err,results1) {
                                console.log(results1);
                                if (err) {
                                    throw err;
                                }
                                else {
                                    for (j=0; j<results1.length;  j++ ) {
                                        // console.log(results[i].path);
                                        tempObj["id"] = results1[j].id;
                                        tempObj["name"] = results1[j].name;
                                        tempObj["path"] = results1[j].path;
                                        tempObj["type"] = results1[j].type;
                                        tempObj["ctime"] = results1[j].creationtime;
                                        tempObj["size"] = results1[j].size;
                                        tempObj["starred"] = results[j].starred;
                                        tempObj["sharedstatus"] = results1[j].sharedstatus;
                                        jsonObj.push(tempObj);
                                    }
                                    if(results.length === jsonObj.length) {
                                        res.status(201).send(jsonObj);
                                    }

                                }

                            },fetchQuery);
                        }
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                }
            },fetchQuery);
        }
        else{
            res.status(204).send({"message":"Directory is Empty"});
        }
        // }
        // else{
        //     res.status(203).send({"message":"Session Expired. Please Login Again"});
        // }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/accessSelectedSharedData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            let clientPath = req.body.path;

            // dirpath=dirpath.replace("//","/");
            let fetchQuery="select * from sharedetails where sharedwith='" + username+"';";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                // console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};

                            fetchQuery = "select * from dropboxstorage where id = '"+ results[i].shareditemid+"';";
                            mysql.fetchData(function(err,results1) {
                                console.log(results1);
                                if (err) {
                                    throw err;
                                }
                                else {
                                    for (j=0; j<results1.length;  j++ ) {
                                        // console.log(results[i].path);
                                        tempObj["id"] = results1[j].id;
                                        tempObj["name"] = results1[j].name;
                                        tempObj["path"] = results1[j].path;
                                        tempObj["type"] = results1[j].type;
                                        tempObj["mtime"] = results1[j].modifiedtime;
                                        tempObj["size"] = results1[j].size;
                                        tempObj["starred"] = results[j].starred;
                                        tempObj["sharedstatus"] = results1[j].sharedstatus;
                                        jsonObj.push(tempObj);
                                    }
                                    if(results.length === jsonObj.length) {
                                        res.status(201).send(jsonObj);
                                    }

                                }

                            },fetchQuery);
                        }
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                }
            },fetchQuery);
        }
        else{
            res.status(204).send({"message":"Directory is Empty"});
        }
        // }
        // else{
        //     res.status(203).send({"message":"Session Expired. Please Login Again"});
        // }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/accessSharedData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            console.log(req.body.item);
            let item = req.body.item;
            path=item.path + item.name + "/";
            console.log(path);
            let fetchQuery="select * from dropboxstorage where path='" + path+"';";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                console.log("result:");
                console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length>0) {
                        let jsonObj=[];
                        for (j = 0; j < results.length; j++) {
                            let tempObj = {};
                            tempObj["id"] = results[j].id;
                            tempObj["name"] = results[j].name;
                            tempObj["path"] = results[j].path;
                            tempObj["type"] = results[j].type;
                            tempObj["mtime"] = results[j].modifiedtime;
                            tempObj["size"] = results[j].size;
                            tempObj["starred"] = results[j].starred;
                            tempObj["sharedstatus"] = results[j].sharedstatus;
                            jsonObj.push(tempObj);
                        }
                        res.status(201).send(jsonObj);
                    }
                    else {
                        res.status(204).send({"message":"Directory is Empty"});
                    }
                }
            },fetchQuery);
        }
        else{
            res.status(204).send({"message":"Directory is Empty"});
        }
        // }
        // else{
        //     res.status(203).send({"message":"Session Expired. Please Login Again"});
        // }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

router.post('/removesharing', function (req, res, next) {
    try {
        if(req.session.username!==undefined){
            let id = req.body.itemid;
            console.log(id);
        }
        else{
            res.status(203).json({"message":"Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/setdirPath', function (req, res, next) {
    try {
        if(req.session.username!==undefined){
            filePath = req.body.path;
            res.status(201).json({"message":"Path set for the directory"})
        }
        else{
            res.status(203).json({"message":"Session Expired. Login again"})
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/upload', function (req, res, next) {
    try {
        console.log(req.body);
        if(req.session.username!==undefined) {
            upload(req, res, function (err) {
                // console.log(req.body);
                if (err) {
                    res.status(301).send({"message:":"Error while uploading files"});
                } else {
                    console.log("File Successfully Uploaded");
                    res.status(201).send({"message": "File Successfully Uploaded"});
                }
            });
        }
        else {
            res.status(203).send({"message":"Session Expired. Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).end();
    }
});

router.post('/getActivityData', function (req, res, next) {
    try {
        console.log("In fetching activity");
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;

            let jsonObj = [];

            let fetchQuery="select * from useractivities where username = '" + username+"' AND activitytype='signup'";
            mysql.fetchData(function (err, result) {
                if(err){
                    console.log("Error while fetting account creation data");
                }
                if(result.length===1) {
                    let tempObj={};
                    tempObj["activitytype"] = result[0].activitytype;
                    tempObj["activitytime"] = result[0].activitytime;
                    tempObj["username"] = result[0].username;
                    jsonObj.push(tempObj);

                    fetchQuery="select * from useractivities where username = '" + username+"' AND activitytype!='signup'" +
                        " ORDER BY useractivityid DESC LIMIT 1";
                    console.log("fetch Query : " + fetchQuery);

                    mysql.fetchData(function(err,results){
                        console.log(results);
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        else
                        {
                            if(results.length>0) {
                                for (i = 0; i < results.length; i++) {
                                    let tempObj = {};
                                    console.log(results[i].path);
                                    tempObj["activitytype"] = results[i].activitytype;
                                    tempObj["activitytime"] = results[i].activitytime;
                                    jsonObj.push(tempObj);
                                }


                                fetchQuery="select * from storageactivities where username = '" + username+"'" +
                                    " ORDER BY activityid DESC LIMIT 5";
                                console.log(fetchQuery);
                                mysql.fetchData(function(err,results1) {
                                    console.log(results1);
                                    if (err) {
                                        throw err;
                                    }
                                    if (results1.length > 0) {
                                        let count=0;
                                        for (i = 0; i < results1.length; i++) {
                                            let tempObj = {};
                                            tempObj["activitytype"] = results1[i].activitytype;
                                            tempObj["activitytime"] = results1[i].activitytime;

                                            let fetchquery1="select name, type from dropboxstorage where id = '"+
                                                results1[i].itemid +"';";
                                            console.log(fetchquery1);
                                            mysql.fetchData(function (err, results2) {
                                                console.log("results2:");
                                                console.log(results2);
                                                if(err){
                                                    console.log(err);
                                                    throw "Error while fetching file/folder name";
                                                }
                                                if(results2.length===1){
                                                    tempObj["name"] = results2[0].name;
                                                    tempObj["type"] = results2[0].type;
                                                    jsonObj.push(tempObj);
                                                    count++;
                                                    console.log("i:"+i);
                                                    if(count===results1.length) {
                                                        console.log(i+"m here"+results1.length);
                                                        res.status(201).send(jsonObj);
                                                    }
                                                }
                                            }, fetchquery1);
                                        }
                                        console.log(jsonObj);
                                    }
                                    else if(results1.length === 0){
                                        console.log("here");
                                        res.status(201).send(jsonObj);
                                    }
                                },fetchQuery);
                            }
                            else {
                                res.status(301).send({"message":"Unrecognized Error. No activity found"});
                            }
                        }
                    },fetchQuery);
                }
            },fetchQuery);
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.post('/changeProfile', function (req, res, next) {
    try {
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            console.log(username);
            let data = req.body;
            console.log(data);
            updateQuery="update userprofile " +
                "set overview='"+ data.overview + "'," +
                " education= '"+ data.education + "'," +
                " contactinfo= '"+ data.contactinfo + "'," +
                " lifeevents= '"+ data.lifeevent + "'," +
                " work= '"+ data.work + "'," +
                " music= "+ data.music + "," +
                " reading= "+ data.reading+ "," +
                " sports= "+ data.sports +
                " where username = '"+username+"';";


            console.log(updateQuery);
            mysql.updateData(function(err,results) {
                console.log(results);
                if (err) {
                    throw err;
                }
                if (results.affectedRows === 1) {
                    res.status(201).send({"message":"Profile updated successfully"});
                }
            },updateQuery);
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.get('/getprofile', function (req, res, next) {
    try {
        console.log("In fetching activity");
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            let data = req.body;
            console.log(data);
            fetchQuery="select * from userprofile where username = '"+ username +"';";
            console.log(fetchQuery);
            mysql.fetchData(function(err,results1) {
                console.log(results1);
                if (err) {
                    throw err;
                }
                if (results1.length === 1) {
                    res.status(201).send(results1);
                }
            },fetchQuery);
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : "Error while fetching activity data"});
    }
});

router.post('/deleteContent', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            let username = req.session.username;
            console.log(req.body);
            let item = req.body.id;
            let fetchQuery = "select type, name, path from dropboxstorage where id = '"+ item + "' " +
                "AND ownerusername = '"+ username +"';";

            mysql.fetchData(function(err,results){
                console.log(results);
                if(err){
                    console.log(err);
                    throw err;
                }
                if(results.length===1) {
                    let deleteQuery="delete from dropboxstorage where path LIKE '"+ results[0].path+"%' AND " +
                        "id = '"+ item +"' "+
                        "AND ownerusername= '"+ username +"';";
                    // act.insertIntoActivity(function (err, dataInserted) {
                    //     if(dataInserted){
                    //         console.log("Added to Activity");
                    //     }
                    //     else{
                    //         console.log("Failed to add Activity");
                    //     }
                    // }, username, "delete", item);
                    mysql.deleteData(function (err, results1) {
                        console.log(results1);
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        if(results1.affectedRows>0){
                            if(results[0].type==="d") {
                                let deleteQuery = "delete from dropboxstorage where path LIKE '" +
                                    results[0].path + results[0].name + "%'" +
                                    "AND ownerusername= '" + username + "';";
                                mysql.deleteData(function (err, results2) {
                                    console.log("Content Deleted Successfully");
                                    if (results2.affectedRows >= 0) {
                                        deleteFromFileSystem(function (err, deleteResult) {
                                            if (deleteResult) {
                                                res.status(201).send({"message": "Deleted Successfully"});
                                            }
                                            else {
                                                res.status(301).send({"message": "Deleted Unsuccessful"})
                                            }
                                        }, results[0].name, results[0].path);
                                    }
                                    else {
                                        console.log("Failed to Remove");
                                    }
                                }, deleteQuery);
                            }
                            else if(results[0].type==="f"){
                                deleteFromFileSystem(function (err, deleteResult) {
                                    if (deleteResult) {
                                        res.status(201).send({"message": "Deleted Successfully"});
                                    }
                                    else {
                                        res.status(301).send({"message": "Deleted Unsuccessful"})
                                    }
                                }, results[0].name, results[0].path);
                            }
                        }
                        else {
                            console.log("Error while deletion");
                        }
                    }, deleteQuery);
                }
                else {
                    res.status(204).send({"message":"Directory is Empty"});
                }
            },fetchQuery);
        }
        else{
            res.status(203).send({"message":"Session Expired. Please Login Again"});
        }
    }
    catch (e){
        console.log(e);
        res.status(301).send({"message" : e});
    }
});

function doesExist (callback, name, path){
    try {
        let fetchQuery = "select count(*) as records from dropboxstorage where name = '" + name + "' AND path = '" + path + "';";
        console.log("Fetch Query: " + fetchQuery);
        let exists=true;
        mysql.fetchData(function (err, results) {
            if (err) {
                console.log("Fetched Records: " + results[0].records);
            }
            if(results[0].records===0) {
                console.log("Count: " + results[0].records);
                exists=false;
            }
            callback(err, exists);
        }, fetchQuery);
    }
    catch (err){
        console.log(err);
    }
}

function insertIntoStorage (callback, name, path, type, username){
    try{
        // console.log(name);
        // console.log(path);
        // console.log(type);
        // console.log(username);
        let ctime;
        // let mtime;
        let size;
        fs.stat((path), function (err, stats) {
            let dataInserted=false;
            if (err) {
                throw ("Error while fetching list of files/folders .Error: " + err)
            }
            ctime = stats["ctime"].toISOString().slice(0, 19).replace('T', ' ');
            size = stats["size"];

            let insertData = {
                name : name,
                type : type,
                path : path,
                creationtime : ctime,
                size : size,
                username : username
            };

            let insertQuery = "insert into dropboxstorage (name, type, path, creationtime, size, ownerusername) " +
                "values('" + name + "','" + type + "','" + path + "','" + ctime + "','" + size + "','" + username + "');";
            console.log("Insert Query : " + insertQuery);

            mongo.connect(mongoURL, function () {
                let storagecoll = mongo.collection("dropboxstorage");
                storagecoll.insertOne(function (err, results) {
                    console.log(results);

                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("Affected Rows: " + results.affectedRows);
                        console.log(results);
                        if (results.affectedRows === 1) {
                            console.log("data inserted successfully");
                            dataInserted = true;
                            let fetchQuery = "select id, creationtime from dropboxstorage " +
                                "where name = '" + name + "' AND path = '" + path + "';";
                            mysql.fetchData(function (err, results1) {
                                if(err){
                                    console.log(err);
                                }
                                if(results1.length===1){
                                    act.insertIntoActivity(function (err, results2) {
                                        if(err){
                                            console.log(err);
                                        }
                                        console.log("Activity added : "+results2)
                                    }, username, "insert", results1[0].id, results1[0].creationtime );
                                }
                                else{
                                    console.log("does not contain the data")
                                }

                            }, fetchQuery);

                        }
                        else {
                            console.log("Error while inserting data into database");
                        }
                    }
                    callback(err, dataInserted)
                }, insertQuery);
            });

        });
    }
    catch (e){
        console.log(e);
        return false;
    }
}

deleteIfNotAvailableInStore = ((filename, dirpath) => {});

deleteFromDatabase = ((name, path) => {
    try{
        console.log("Delete here: "+name+"   "+path);
    }
    catch(e) {
        throw e;
    }
});

deleteFromFileSystem = ((callback, name, path) => {
    let deleteResult=false;
    let err=null;
    try{
        // console.log("Delete here: "+name+"   "+path);
        console.log(path+name);
        // if(exist){
        shell.rm("-r",path+name);
        if(!fs.existsSync(path+name)){
            console.log("Deletion Done");
            deleteResult=true;
        }
        // }
    }
    catch(e) {
        err=e;
        console.log(e);
        throw e;
    }
    finally {
        callback(err, deleteResult);
    }
});

module.exports = router;
