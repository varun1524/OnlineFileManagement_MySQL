import React, {Component} from 'react';
import * as API from '../api/API';
class Profile extends Component{

    constructor(){
        super();
        this.state = {
            profiledata : {
                overview: "",
                work: "",
                education: "",
                contact: "",
                lifeevent: ""
            },
            recprofiledata:[]
        };
    }

    handleSubmitProfileChange = (()=> {
        API.changeProfile(this.state.profiledata).then((response) => {
            if(response.status===201){
                console.log("Added successfully");
            }
            else  if(response.status===203){
                this.props.handlePageChange("/home/login");
            }
            else  if(response.status===301){
                console.log("Error while adding profile data")
            }
        });
    });

    componentWillMount(){
        API.getprofile().then((response)=>{
           if(response.status===201){
               response.json().then((data)=>{
                   console.log(data);
                   this.setState({
                       ...this.state,
                       recprofiledata:data
                   })
               });
           }
           else  if(response.status===203){
               this.props.handlePageChange("/home/login");
           }
           else  if(response.status===301){
                console.log("Error while fetching profile data")
           }
        });
    }

    render(){
        return(
            <div className="container-fluid">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                        <form className="form-horizontal">

                            <div className="form-group">
                                <label className="text-justify">About</label><hr/>
                            </div>
                            <div className="form-group">
                                Overview:<input type="text" id="txtoverview" className="input-sm"
                                                onChange={(event) => {
                                                    this.setState({
                                                        ...this.state.profiledata,
                                                        overview: event.target.value
                                                    })
                                                }}
                            />
                            </div>
                            <div className="form-group">
                                Work:<input type="text" id="txtwork" className="input-sm"
                                            onChange={(event) => {
                                                this.setState({
                                                    ...this.state.profiledata,
                                                    work: event.target.value
                                                })
                                            }}
                                />
                            </div>
                            <div className="form-group">
                                Education:<input type="text" id="txteducation" className="input-sm"
                                                 onChange={(event) => {
                                                     this.setState({
                                                         ...this.state.profiledata,
                                                         education: event.target.value
                                                     })
                                                 }}
                                />
                            </div><br/>
                            <div className="form-group">
                                Contact info:<input type="text" id="txtcontact" className="input-sm"
                                                    onChange={(event) => {
                                                        this.setState({
                                                            ...this.state.profiledata,
                                                            contact: event.target.value
                                                        })
                                                    }}
                                />
                            </div>
                            <div className="form-group">
                                Life Events:<input type="text" id="txtlifeevents" className="input-sm"
                                                   onChange={(event) => {
                                                       this.setState({
                                                           ...this.state.profiledata,
                                                           lifeevent: event.target.value
                                                       })
                                                   }}
                                />
                            </div><br/>
                            {/*<label>Interest</label><hr/>*/}
                            {/*<div className="form-group">*/}
                                {/*<input type="checkbox" name="interest" value="Music" />Music*/}
                                {/*<input type="checkbox" value="Sports" name="interest"/>Sports*/}
                                {/*<input type="checkbox" value="Reading" name="interest"/>Reading*/}
                            {/*</div><br/>*/}
                            <div className="form-group">
                                <button onClick={(()=>{this.handleSubmitProfileChange()})}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default Profile;