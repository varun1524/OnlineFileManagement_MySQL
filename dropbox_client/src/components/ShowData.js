import React, {Component} from 'react';
// import { Link } from 'react-router-dom'
// import Login from "./Login";

class ShowData extends Component{

    constructor(){
        super();
        this.state = {
            firstname: "",
            lastname: "",
            username: "",
            password: ""
        };
    }

    render(){

        const {item} = this.props;

        return(
            <tbody>
                <tr>
                    <td className="text-justify col-sm-1 col-md-1">
                        <input type="button" value={ item.name } className="btn-link" onClick={()=>{this.props.fetchSelectedDirectoryData(item)}}/>
                    </td>
                    <td>
                        { item.type }
                    </td>
                    <td>
                        { item.ctime }
                    </td>
                    <td>
                        { item.mtime }
                    </td>
                    <td>
                        { item.size }
                    </td>
                </tr>
            </tbody>
        );
    }
}


export default ShowData;