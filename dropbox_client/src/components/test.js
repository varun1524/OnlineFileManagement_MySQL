import React, {Component} from 'react';

// let cols = [
//     { key: 'name', label: 'name' },
//     { key: 'type', label: 'type' },
//     { key: 'Creation Time', label: 'Creation Time' },
//     { key: 'Modified TIme', label: 'Modified TIme'},
//     { key: 'size', label: 'size'}
// ];
//
// let data = [
//     {
//         "userId": 1,
//         "id": 1,
//         "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//         "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
//     },
//     {
//         "userId": 1,
//         "id": 2,
//         "title": "qui est esse",
//         "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
//     }
// ];

class Table extends Component {

    render = function() {
        let headerComponents = this.generateHeaders(),
            rowComponents = this.generateRows();

        return (
            <table>
                <thead> {headerComponents} </thead>
                <tbody> {rowComponents} </tbody>
            </table>
        );
    };

    generateHeaders= function(cols) {
        console.log(cols);
        // generate our header (th) cell components
        return cols.map(function(colData) {
            return <th key={colData.key}> {colData.label} </th>;
        });
    };

    generateRows= function(cols, data) {
        console.log(cols);
        console.log(data);
        return data.map(function(item) {
            // handle the column data within each row
            let cells = cols.map(function(colData) {

                // colData.key might be "firstName"
                return <td> {item[colData.key]} </td>;
            });
            return <tr key={item.id}> {cells} </tr>;
        });
    };
}

// React.render(<Table cols={cols} data={data}/>,  document.getElementById('example'));

export default Table;