import React, {Component} from 'react';
import dropboxLogo from '../images/dropbox.png'
import * as API from '../api/API';
import { Route, withRouter, Switch} from 'react-router-dom';
import Home from './Home';
import File from './File';
import Profile from './Profile';
import Activity from './Activity';

class User extends Component {

    constructor(){
        super();
        this.state = {
            path : "",
            // modelIsOpen : true
        };
    }

    redirectToFile = ((path) => {
        this.setState({
            path:path
        });
        this.props.history.push("/user/file");
    });


    componentWillMount(){
        API.getSession().then((response)=>{
            if(response.status===201){
                console.log("session active");
            }
            else if(response.status===203){
                this.props.handlePageChange("/");
            }
            else{
                console.log("Error");
            }
        });
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

        window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {

                let dropdowns = document.getElementsByClassName("dropdown-content");
                let i;
                for (i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        };

        return (
            <div className="container-fluid">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <div className="row" height="50">
                            <div align="left">
                                <div>
                                    {/*<button className="btn btn-link" onClick={(()=>{this.props.handlePageChange("/user/home")})}>*/}
                                        <img src={dropboxLogo} width="50" height="50" alt="DropBox" align="left"/>
                                    {/*</button>*/}
                                </div>
                            </div>
                            <div align="right">
                                <div className="dropdown">
                                    <button onClick={(()=> {document.getElementById("userDropdown").classList.toggle("show");})}
                                            className="dropbtn" >
                                        {this.props.username}
                                    </button>
                                    <div id="userDropdown" className="dropdown-content">
                                        <a className="btn btn-link" onClick={(()=>{this.props.handlePageChange("/user/profile")})}>Profile</a>
                                        <a className="btn btn-link" onClick={(()=>{this.props.handlePageChange("/user/activity")})}>
                                            activity
                                        </a>
                                        <a className="btn btn-link" onClick={(()=>{this.props.handleLogout()})}>
                                            Logout
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/*{this.props.username && ( //Just a change here*/}
                                {/*<div className="text-right" role="alert">*/}
                                {/*Welcome {this.props.username}*/}
                                {/*</div>*/}
                                {/*)}*/}
                                {/*{this.props.username && ( //Just a change here*/}
                                {/*<div className="alert alert-warning" role="alert">*/}
                                {/*{this.props.username}*/}
                                {/*</div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                        <br/>
                        <div className="row" >
                            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1" align="left">
                                <div className="container-fluid " >
                                    <div className="btn-group-vertical">
                                        <div className="row">
                                            <button className="btn-link" onClick={(()=>{this.props.handlePageChange("/user/home")})}>Home</button>
                                        </div>
                                        <div className="row">
                                            <button className="btn-link" onClick={(()=>{
                                                this.setState({
                                                    path:""
                                                });
                                                this.props.handlePageChange("/user/file");
                                            })}>Files</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11">
                                <Switch>
                                    <Route path="/user/home" render={() => (
                                        <div>
                                            <Home
                                                username={this.props.username}
                                                handlePageChange={this.props.handlePageChange}
                                                redirectToFile = {this.redirectToFile}
                                            />
                                        </div>
                                    )}/>
                                    <Route path="/user/file" render={() => (
                                        <div>
                                            <File
                                                path = {this.state.path}
                                                username={this.props.username}
                                                handlePageChange={this.props.handlePageChange}
                                            />
                                        </div>
                                    )}/>
                                    <Route path="/user/profile" render={() => (
                                        <div>
                                            <Profile
                                                username={this.props.username}
                                                handlePageChange={this.props.handlePageChange}
                                            />
                                        </div>
                                    )}/>
                                    <Route path="/user/activity" render={() => (
                                        <div>
                                            <Activity
                                                username={this.props.username}
                                                handlePageChange={this.props.handlePageChange}
                                            />
                                        </div>
                                    )}/>

                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(User);