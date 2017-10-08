import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import Home from './Home';
import dropboxLogo from '../images/dropbox.png'
// import Message from './Message';

class PostLogin extends Component {

    // state={
    //     isPurposeServed:false,
    //     username:"",
    //     message:""
    // };

    handlePageChange=((page)=>{
        this.props.history.push(page);
    });

    render(){

        return(
            <div className="container-fluid">
                <div className="col-lg-12 col-xs-12 col-md-12 col-sm-12">
                    <div className="row">
                        <img src={dropboxLogo} width="50" height="50" alt="DropBox" align="left"/>
                    </div>
                    <div className="col-lg-5 col-xs-5 col-md-5 col-sm-5">
                        <Route exact path="/postlogin" render={() => (
                            <div>
                                {this.props.username}
                                {this.props.handlePageChange("/postlogin/home")}
                            </div>
                        )}/>
                        <Route path="/home" render={() => (
                            <div>
                                <Home username={this.props.username}/>
                                {/*<Message message={this.state.message}/>*/}
                            </div>
                        )}/>
                    </div>
                </div>
            </div>

        );
    }
}

export default withRouter(PostLogin);
