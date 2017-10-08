let express = require('express');
let router = express.Router();
let multer = require('multer');
let mysql = require('./mysql');
let datetime = require('datetime');
// let glob = require('glob');
let formiddable = require('formidable');
let fs = require('fs');
// let tree = require('direcotrytree');
let filePath="";


let storage = multer.diskStorage(
    {

    destination: function (req, file, cb) {
        console.log("path:"+filePath);
        if(req.session.username!==undefined) {
            cb(null, "./dropboxstorage/" + req.session.username + "/" + filePath);
        }
        else{
            res.status(203).send({"message" : "Session Expired. Login Again"});
        }
    },
    filename: function (req, file, cb) {
        // console.log(file.originalname);
        cb(null, file.originalname);
        fs.exists("./dropboxstorage/" + req.session.username + "/" + filePath, function (exist) {
            let username = req.session.username;
            if(exist){
                if(this.insertIntoStorage(file.originalname, "./dropboxstorage/" + req.session.username + "/" + filePath+ file.originalname, "f", username)){
                    console.log("Successfully added "+file.originalname +" into database");
                }
                else {
                    console.log("Failed to add "+file.originalname +" into database");
                }
            }
            else {
                console.log("File does not exist in the storage on specified path");
                res.status(301).send({"message":"File does not exist in the storage on specified path"});
            }
        });
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
            if (clientPath === "" || clientPath === null || clientPath === undefined) {
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
            if(files.length>0) {
                files.map((file) => {
                    let tempObj = {};
                    // console.log(dirpath + file);
                    fs.lstat((dirpath + file), function (err, stats) {
                        if (err) {
                            throw ("Error while fetching list of files/folders .Error: " + err)
                        }
                        // console.log(stats);

                        if (stats.isFile()) {
                            // console.log('file');
                            type = "file";
                        }
                        if (stats.isDirectory()) {
                            // console.log('directory');
                            type = "directory";
                        }

                        tempObj["name"] = file;
                        tempObj["type"] = type;
                        tempObj["ctime"] = stats["ctime"];
                        tempObj["mtime"] = stats["mtime"];
                        tempObj["size"] = stats["size"];

                        jsonObj.push(tempObj);
                        // console.log(jsonObj);
                        // console.log(jsonObj.length);
                        if (jsonObj.length === files.length) {
                            // console.log(jsonObj);
                            res.status(201).send(jsonObj);
                        }
                        i = i + 1;
                    });
                });
            }
            else{
                res.status(204).send({"message":"Directory is Empty"});
            }
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
//,

router.post('/createDir', function(req, res, next){
    try{
        console.log("in create directory");
        console.log(req.session.username);
        console.log(req.body.directoryName);
        let clientPath = req.body.dirpath + req.body.directoryName;
        console.log("Client Path: " + clientPath);
        if(req.session.username!==undefined){
            let username = req.session.username;
            let userDirpath = "./dropboxstorage/"+username+"/";
            if(fs.existsSync(userDirpath)){
                let createDirpath = userDirpath + clientPath;
                console.log("Create Directory Path: "+createDirpath);
                console.log("User Directory Path: "+userDirpath);
                if(!fs.existsSync(createDirpath)) {
                    fs.mkdir(createDirpath, null, function (err) {
                        console.log(err);
                        if (err) {
                            throw ("failed to create directory" + err);
                        } else {
                            console.log("Directory Created Successfully");
                            this.insertIntoStorage(req.body.directoryName, createDirpath, "d", username);
                            res.status(201).send({message: "Directory Created Successfully"});
                        }
                    });
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

router.post('/setdirPath', function (req, res, next) {
    try {
        console.log("Hii");
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
                    res.status(201).send({"message": "Successfully Uploaded"});
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

insertIntoStorage = ((name, path, type, username)=>{
    try{
        console.log(name);
        console.log(path);
        console.log(type);
        console.log(username);
        let ctime;
        let mtime;
        let size;
        fs.stat((path), function (err, stats) {
            if (err) {
                throw ("Error while fetching list of files/folders .Error: " + err)
            }
            ctime = stats["ctime"];
            mtime = stats["mtime"];
            size = stats["size"];

            console.log(ctime);
            console.log(mtime);
            console.log(size);
            let insertQuery="insert into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) values('"+name+"','"+type+"','"+path+"','"+ctime+"','"+mtime+"','"+size+"','"+username+"');";
            console.log("Insert Query : " + insertQuery);

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
                        return true;
                    }
                    else {
                        console.log("Error while inserting data into database");
                        return false;
                    }
                }
            },insertQuery);

        });
    }
    catch (e){
        console.log(e);
        return false;
    }
});

module.exports = router;
