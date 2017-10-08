let express = require('express');
let router = express.Router();
let multer = require('multer');
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
        console.log(file.originalname);
        cb(null, file.originalname);
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
                    fs.mkdirSync(createDirpath, function (err) {
                        if (err) {
                            throw ("failed to create directory" + err);
                        } else {
                            console.log("Directory Created Successfully");
                        }
                    });
                    res.status(201).send({message: "Directory Created Successfully"});
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
                console.log(req.body);
                if (err) {
                    console.log("error")
                } else {
                    console.log("succeess")
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

module.exports = router;
