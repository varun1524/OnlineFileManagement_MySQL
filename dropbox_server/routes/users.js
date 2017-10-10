let express = require('express');
let router = express.Router();
let multer = require('multer');
let mysql = require('./mysql');
// let glob = require('glob');
let fs = require('fs-extra');
let filePath="";



let storage = multer.diskStorage(
    {
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
            doesExist(function (err, result) {
                console.log("Does Exist: "+result);
                if(!result){
                    cb(null, filename);
                    fs.exists(dirpath+filename, function (exist) {
                        let username = req.session.username;
                        console.log(dirpath+filename+" Exist in File System: "+ exist);
                        if(exist){
                            if(insertIntoStorage(function (err, result) {
                                    if(err){

                                    }
                                    if(result){
                                        console.log("File added in file system as well as database");
                                    }
                                    else {
                                        res.status(301).send({"message":"Failed to add file into database"});
                                    }
                                } ,file.originalname, dirpath, "f", username)){
                                console.log("Successfully added "+file.originalname +" into database");
                            }
                            else {
                                console.log("Failed to add "+file.originalname +" into database");

                            }
                        }
                        else {
                            console.log("File does not exist in the storage on specified path");
                        }
                    });
                }
                else {
                    console.log("File already exists in database");
                }
            }, filename, dirpath);

        }
    });

let upload = multer({storage:storage}).any();

/* GET users listing. */
router.post('/getDirData', function (req, res, next) {
    try {
        console.log(req.session.username);
        if(req.session.username!==null || req.session.username!==undefined) {
            console.log("hello");
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

            let files = fs.readdirSync(dirpath);
            console.log(files);
            let jsonObj = [];
            let type;
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
            let fetchQuery="select * from dropboxstorage where path = '" + dirpath+"'";
            console.log("fetch Query : " + fetchQuery);

            mysql.fetchData(function(err,results){
                // console.log(results);
                if(err){
                    throw err;
                }
                else
                {
                    let isFavourite=false;

                    // console.log("Affected Rows: "+results.affectedRows);
                    if(results.length>0) {
                        for (i = 0; i < results.length; i++) {
                            let tempObj = {};
                            console.log(results[i].path);
                            tempObj["id"] = results[i].id;
                            tempObj["name"] = results[i].name;
                            tempObj["type"] = results[i].type;
                            tempObj["ctime"] = results[i].creationtime;
                            tempObj["mtime"] = results[i].modifiedtime;
                            tempObj["size"] = results[i].size;
                            tempObj["favourite"] = results[i].starred;
                            jsonObj.push(tempObj);
                        }
                        // console.log(jsonObj);
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
//,

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
        if(req.session.username!==undefined){
            let recDataArr = req.body;
            recDataArr.every((item) => {

            });
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
                    console.log("error")
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


function doesExist (callback, name, path){
    try {
        let fetchQuery = "select count(*) as records from dropboxstorage where name = '" + name + "' AND path = '" + path + "'";
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
        console.log(name);
        console.log(path);
        console.log(type);
        console.log(username);
        let ctime;
        let mtime;
        let size;
        fs.stat((path), function (err, stats) {
            let dataInserted=false;
            if (err) {
                throw ("Error while fetching list of files/folders .Error: " + err)
            }
            ctime = stats["ctime"];
            mtime = stats["mtime"];
            size = stats["size"];
            let insertQuery = "insert into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) values('" + name + "','" + type + "','" + path + "','" + ctime + "','" + mtime + "','" + size + "','" + username + "');";
            console.log("Insert Query : " + insertQuery);

            mysql.insertData(function (err, results) {
                console.log(results);

                if (err) {
                    throw err;
                }
                else {
                    console.log("Affected Rows: " + results.affectedRows);
                    console.log(results);
                    if (results.affectedRows === 1) {
                        console.log("valid Login");
                        dataInserted = true;
                    }
                    else {
                        console.log("Error while inserting data into database");
                    }
                }
                callback(err, dataInserted)
            }, insertQuery);
        });
    }
    catch (e){
        console.log(e);
        return false;
    }
}

deleteFromFileSystem = ((name, path) => {
    try{
        console.log("Delete here: "+name+"   "+path);
        // fse.re
    }
    catch(e) {
        throw e;
    }
});

module.exports = router;
