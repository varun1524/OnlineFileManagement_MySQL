import React, {Component} from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import PostLogin from './PostLogin';
import PreLogin from './PreLogin';
import * as API from '../api/API';

class MainPage extends Component {

    state={
        isPurposeServed:false,
        username:"",
        message:""
    };

    handleLogin=((loginData)=>{
        console.log(loginData);

        API.doLogin(loginData)
            .then((status) => {
                if(status===201){
                    this.setState({
                        ...this.state,
                        isPurposeServed: true,
                        message: ("Welcome to my App " + loginData.username),
                        username: loginData.username
                    });
                    this.props.history.push("/postlogin/home")
                }
                else if(status===301){
                    this.setState({
                        ...this.state,
                        isPurposeServed: false,
                        message: "username or password is invalid"
                    });
                    // this.props.history.push("/login")
                }
                else if(status===401){
                    this.setState({
                        ...this.state,
                        isPurposeServed: false,
                        message: "Error on server side while fetching data"
                    });
                    // this.props.history.push("/login")
                }
            });
    });

    handlePageChange=((page)=>{
        console.log(page);
        this.props.history.push(page);
    });

    // setusername = ((uname)=>{
    //    console.log(uname);
    //    this.setState({
    //        ...this.state,
    //        username:uname
    //    })
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
            <div>
                <Switch>
                <Route exact path="/" render={() => (
                    <div>
                        {this.props.history.push("/prelogin")}
                    </div>
                )}/>

                <Route path="/prelogin" render={() => (
                    <div>
                        <PreLogin
                            handleLogin = {this.handleLogin}
                            handlePageChange={this.handlePageChange}
                        />
                    </div>
                    )}
                />

                <Route path="/postlogin" render={() => (
                    <div>
                        <PostLogin
                            handlePageChange={this.handlePageChange}
                            username={this.state.username}
                        />
                    </div>
                )}
                />
                </Switch>
            </div>
        );
    }

}

export default withRouter(MainPage);