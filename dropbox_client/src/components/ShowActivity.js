import React, {Component} from 'react';

class ShowActivity extends Component{

    constructor(){
        super();
        this.state = {
            hover: false,
        };
    }

    render(){

        const {item} = this.props;

        return(
            <tbody>
            <tr>

                <td className="text-justify">
                    {item.activitytype}
                </td>
                <td>
                    {item.activitytime}
                </td>
            </tr>
            </tbody>
        );
    }
}

export default ShowActivity;