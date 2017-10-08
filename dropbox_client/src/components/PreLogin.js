import React, {Component} from 'react';
import {Route, withRouter, Switch} from 'react-router-dom';
import SignUp from './SignUp';
import * as API from '../api/API';
import Login from './Login';
import Message from './Message';
import dropboxImage from '../images/dropbox.png'

class PriorLogin extends Component {

    state={
        isPurposeServed:false,
        username:"",
        message:""
    };

    handleSignUp=((userdata)=>{
        console.log(userdata);

        API.doSignUp(userdata)
            .then((status) => {

                console.log(status);

                if (status === 201) {
                    this.setState({
                        ...this.state,
                        isPurposeServed: true,
                        message: "You have successfully signed up. Please login here",
                        username: userdata.username
                    });
                    this.props.handlePageChange("/prelogin/login");
                } else if (status === 401) {
                    console.log("State");
                    this.setState({
                        ...this.state,
                        isPurposeServed: false,
                        message: "Error while adding userdata"
                    });
                }
                else if(status === 301){
                    this.setState({
                        ...this.state,
                        isPurposeServed: false,
                        message: "Email Id already exists. Try to sign up with another Email Id"
                    });
                }
                else
                {
                    this.setState({
                        ...this.state,
                        isPurposeServed: false,
                        message: "Error while signing up."
                    });
                }
            });
    });

    // handleLogin=((loginData)=>{
    //     console.log(loginData);
    //     API.doLogin(loginData)
    //         .then((status) => {
    //             if(status===201){
    //                 this.setState({
    //                     ...this.state,
    //                     isPurposeServed: true,
    //                     message: ("Welcome to my App " + loginData.username),
    //                     username: loginData.username
    //                 });
    //                 // this.props.username=loginData.username;
    //                 // console.log(this.props.username);
    //                 this.props.getusername(loginData.username);
    //                 this.props.handlePageChange("/postlogin");
    //             }
    //             else if(status===301){
    //                 this.setState({
    //                     ...this.state,
    //                     isPurposeServed: false,
    //                     message: "username or password is invalid"
    //                 });
    //             }
    //             else if(status===401){
    //                 this.setState({
    //                     ...this.state,
    //                     isPurposeServed: false,
    //                     message: "Error on server side while fetching data"
    //                 });
    //             }
    //         });
    // });
    //
    // handlePageChange=((page)=>{
    //     this.props.history.push(page);
    // });

    // componentDidMount(){
    //     console.log("In Did Mount");
    // }
    //
    // componentWillMount(){
    //     console.log("In Will Mount");
    // }

    render(){
        return(
            <div className="container-fluid">
                <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12">
                    <div className={"row"}>
                        <img src={dropboxImage} width="50" height="50" alt="DropBox"/>
                    </div>
                    <div className="row">
                        <div className="col-lg-7 col-xs-7 col-md-7 col-sm-7">
                            vghvghvghvvbubu
                        </div>
                        <div className="col-lg-5 col-xs-5 col-md-5 col-sm-5">
                            <Switch>
                                <Route exact path="/prelogin" render={() => (
                                    <div>
                                        {this.props.handlePageChange("/prelogin/signup")}
                                    </div>
                                )}/>
                                <Route path="/prelogin/signup"  render={() => (
                                    <div>
                                        <SignUp
                                            handleSignUp={this.handleSignUp}
                                            handlePageChange={this.props.handlePageChange}
                                        />
                                        <Message message={this.state.message}/>
                                    </div>
                                )}/>
                                <Route path="/prelogin/login" render={() => (
                                    <div>
                                        <Login
                                            handleLogin={this.props.handleLogin}
                                            handlePageChange={this.props.handlePageChange}
                                        />
                                        <Message message={this.state.message}/>
                                    </div>
                                )}/>
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(PriorLogin);