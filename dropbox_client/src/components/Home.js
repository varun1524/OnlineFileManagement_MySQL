import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import dropboxLogo from '../images/dropbox.png'
import * as API from '../api/API';
// import Table from './test'
// import JsonTable from 'react-json-table';
import ShowData from './ShowData';

class Home extends Component {

    // static propTypes = {
    //     message: PropTypes.string.isRequired,
    //     title: PropTypes.string.isRequired,
    //     visible: PropTypes.bool
    // };
    constructor(){
        super();
        this.state = {
            message : "",
            dirpath : "",
            dirData : [],
        };

        this.fetchSelectedDirectoryData = this.fetchSelectedDirectoryData.bind(this);
    }

    handleFileUpload = (event) => {
        const payload = new FormData();
        let fileArray = event.target.files;
        Array.from(fileArray).map((file)=>{
            console.log(file);
            payload.append('mypic',file);
            return file;
        });

        let path;
        if(this.state.dirpath.trim()!=="" || this.state.dirpath!==undefined || this.state.dirpath!==null){
            path = {
                "path" : this.state.dirpath
            };
        }
        else {
            path = {
                "path" : ""
            };
        }
        API.sendDirectorayPath(path).then((response) => {
            if(response.status===201){
                API.uploadFile(payload)
                    .then((status) => {
                        if (status === 201) {
                            this.setState({
                                ...this.state,
                                message: "File uploaded successfully"
                            });
                            this.fetchDirectoryData();
                            console.log("File uploaded successfully");
                        }
                        else if(status === 203){
                            console.log("Session Timed Out");
                            this.props.handlePageChange("/home/signup");
                        }
                        else if(status === 301){
                            console.log("Error while uploading file");
                        }
                        else {
                            console.log("File upload failed");
                        }
                    });
            }
            else if(response.status === 203) {
                console.log("Session Expired");
                this.props.handlePageChange("/");
            }
        });
    };

    addDictionary = (()=> {
        let directoryName = prompt("Please enter directory name:", "New Folder");
        if (directoryName === null || directoryName === "") {
            console.log("User cancelled the prompt.");
        }
        else {
            if(directoryName.trim()!=='') {
                console.log("Directory Name: " + directoryName);
                let data = {
                    directoryName: directoryName,
                    dirpath: this.state.dirpath
                };
                console.log(data);
                API.createDirectory(data).then((response) => {
                    response.json().then((msg)=>{
                        console.log(msg);
                        if(response.status===201){
                            this.setState({
                                ...this.state,
                                message : msg.message
                            });
                            this.fetchDirectoryData(this.state.dirpath);
                        }
                        else if(response.status === 301) {
                            this.setState({
                                ...this.state,
                                message : msg.message
                            })
                        }

                    });
                });
            }
            else {
                console.log("Directory Name is Empty");
            }
        }
    });

    redirectParentDirectory(){
        console.log(this.state.dirpath);
        if(this.state.dirpath.trim()!=="" || this.state.dirpath!==undefined || this.state.dirpath!==null){
            let splitPath = this.state.dirpath.trim().split("/");
            console.log(splitPath);
            let tempPath = "";
            if(splitPath.length>0) {
                splitPath.splice(splitPath.length - 2, 2);

                if(splitPath.length>0) {
                    for(let i=0; i<splitPath.length;i++){
                        tempPath=tempPath + splitPath[i] + "/";
                    }
                }
            }

            console.log(splitPath);

            this.setState({
                ...this.state,
                dirpath : tempPath
            });
            this.fetchDirectoryData();
        }
        else {
            console.log("Already in Root Directory");
        }
    }

    fetchDirectoryData = (() => {
        this.setState((state) => {
            let tempPath="";
            if(state.dirpath!==null || state.dirpath!== undefined) {
                tempPath = state.dirpath + "/";
            }
            else{
                tempPath = "";
            }
            let path = {
                "path": tempPath
            };
            console.log(state.dirpath);

            API.getDirectoryData(path).then((response) => {
                if (response.status === 204) {
                    this.setState({
                        ...this.state,
                        dirData: [],
                        message: "Directory is Empty",
                    });
                    state.dirpath = state.dirpath + path.path;
                }
                else {
                    response.json().then((data) => {
                        if (response.status === 201) {
                            console.log(data);
                            this.setState({
                                ...this.state,
                                dirData: data,
                                message: "Directory Data Received",
                            });
                            state.dirpath = state.dirpath + path.path;
                        }
                        else if (response.status === 301) {
                            this.setState({
                                ...this.state,
                                message: "Error while loading directories"
                            });
                            console.log(data.message);
                        }
                        else if (response.status === 203) {
                            this.setState({
                                ...this.state,
                                message: data.message
                            });
                            console.log(data.message);
                            this.props.handlePageChange("/");
                        }
                        else {
                            console.log("Error");
                        }
                    });
                }
            });
            console.log(state);
        });

    });

    fetchSelectedDirectoryData = ((item) => {
        console.log(item);
        this.setState((state) => {
            let path={
                "path": state.dirpath + item.name +"/"
            };
            console.log(state.dirpath);

            if(item.type==="directory") {
                state.dirpath = path.path;
                API.getDirectoryData(path).then((response) => {
                    if (response.status === 204) {
                        this.setState({
                            ...this.state,
                            dirData: [],
                            message: "Directory is Empty",
                        });
                    }
                    else {
                        response.json().then((data) => {
                            if (response.status === 201) {
                                console.log(data);
                                this.setState({
                                    ...this.state,
                                    dirData: data,
                                    message: "Directory Data Received",
                                });
                            }
                            // else if (response.status === 204) {
                            //     this.setState({
                            //         ...this.state,
                            //         dirData: data
                            //     });
                            //     console.log(data.message);
                            // }
                            else if (response.status === 301) {
                                this.setState({
                                    ...this.state,
                                    message: "Error while loading directories"
                                });
                                console.log(data.message);
                            }
                            else if (response.status === 203) {
                                this.setState({
                                    ...this.state,
                                    message: data.message
                                });
                                console.log(data.message);
                                this.props.handlePageChange("/");
                            }
                            else {
                                console.log("Error");
                            }
                        });
                    }
                });
            }
            else{
                console.log("You selected file");
            }
            console.log(state);
        });

    });


    componentWillMount(){
        // let path = {
        //   path: this.state.dirpath.trim()
        // };
        //
        //
        // console.log(this.state.dirpath);
        API.getSession().then((status)=>{
           if(status===201){
               this.fetchDirectoryData(this.state.dirpath);
           }
           else if(status===203){
               this.props.handlePageChange("/");
           }
           else{
               console.log("Error");
           }
        });

        // this.fetchDirectoryData(this.state.dirpath);
        // API.getDirectoryData(path).then((response) => {
        //     response.json().then((data) => {
        //         if(response.status === 201){
        //             console.log(data);
        //             this.setState({
        //                 dirData:data,
        //                 message:"Directory Data Received"
        //             });
        //         }
        //         else if (response.status === 301){
        //             this.setState({
        //                 ...this.state,
        //                 message:"Error while fetching directories"
        //             });
        //             console.log(data.errorMessage);
        //         }
        //         else {
        //             console.log("Error");
        //         }
        //     });
        // });
    }

    componentDidMount(){
        console.log("did");
    }

    componentDidUpdate(){
    }

    componentWillUpdate(){
        // this.fetchDirectoryData(this.state.dirpath);
    }

    shouldComponentUpdate(){
        return true;
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                                <img src={dropboxLogo} width="50" height="50" alt="DropBox" align="left"/>
                            </div>
                            <div>
                                <button onClick={this.props.handleLogout}>Logout</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                <div className="btn-group-vertical">
                                    <div className="row">
                                        <button>Home</button>
                                    </div>
                                    <div className="row">
                                        <button>Files</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8 col-xs-8 col-md-8 col-sm-8">
                                Hellooowwwwwwwsssssss
                                <div className="row">
                                    {this.props.username && ( //Just a change here
                                        <div className="alert alert-warning" role="alert">
                                            {this.props.username}
                                        </div>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="row">
                                        <input type="button" value="Add Directory" onClick={()=>this.addDictionary()}/>
                                        {this.state.message && ( //Just a change here
                                            <div className="alert alert-warning" role="alert">
                                                {this.state.message}
                                            </div>
                                        )}
                                    </div>
                                    <div className="row" id="example">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>name</th>
                                                        <th>type</th>
                                                        <th>ctime</th>
                                                        <th>mtime</th>
                                                        <th>sizr</th>
                                                    </tr>
                                                </thead>
                                                <tr>
                                                    <td className="text-justify">
                                                        <input type="button" value=".." className="btn btn-link btn-group-lg" onClick={()=>{this.redirectParentDirectory()}}/>
                                                    </td>
                                                </tr>
                                                {
                                                    this.state.dirData.map((item, index) => {
                                                        return(<ShowData
                                                            key={index}
                                                            item={item}
                                                            fetchSelectedDirectoryData = {this.fetchSelectedDirectoryData}
                                                        />)
                                                    })
                                                }
                                            </table>
                                        </div>
                                        {/*<input type="button" value="Get Directory Data" onClick={()=>this.getDirectoryData()}/>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-xs-2 col-md-2 col-sm-2">
                                Hellooowwwwwwwsssssss
                                <form>
                                <input
                                    className={'fileupload'}
                                    type="file"
                                    name="mydata"
                                    multiple="multiple"
                                    onChange={this.handleFileUpload}
                                />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;