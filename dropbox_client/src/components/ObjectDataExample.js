// import React, {Component} from 'React';
// // import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
// import FixedDataTable from 'fixed-data-table';
//
// "use strict";
//
// // var ExampleImage = require('./helpers/ExampleImage');
//
//
//
// const {Table, Column, Cell} = FixedDataTable;
//
// const DateCell = ({rowIndex, data, col, ...props}) => (
//     <Cell {...props}>
//         {data.getObjectAt(rowIndex)[col].toLocaleString()}
//     </Cell>
// );
//
// const ImageCell = ({rowIndex, data, col, ...props}) => (
//     <ExampleImage
//         src={data.getObjectAt(rowIndex)[col]}
//     />
// );
//
// const LinkCell = ({rowIndex, data, col, ...props}) => (
//     <Cell {...props}>
//         <a href="#">{data.getObjectAt(rowIndex)[col]}</a>
//     </Cell>
// );
//
// const TextCell = ({rowIndex, data, col, ...props}) => (
//     <Cell {...props}>
//         {data.getObjectAt(rowIndex)[col]}
//     </Cell>
// );
//
// class ObjectDataExample extends Component {
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             dataList: new FakeObjectDataListStore(1000000),
//         };
//     }
//
//     render() {
//         var {dataList} = this.state;
//         return (
//             <Table
//                 rowHeight={50}
//                 headerHeight={50}
//                 rowsCount={dataList.getSize()}
//                 width={1000}
//                 height={500}
//                 {...this.props}>
//                 <Column
//                     cell={<ImageCell data={dataList} col="avatar" />}
//                     fixed={true}
//                     width={50}
//                 />
//                 <Column
//                     header={<Cell>First Name</Cell>}
//                     cell={<LinkCell data={dataList} col="firstName" />}
//                     fixed={true}
//                     width={100}
//                 />
//                 <Column
//                     header={<Cell>Last Name</Cell>}
//                     cell={<TextCell data={dataList} col="lastName" />}
//                     fixed={true}
//                     width={100}
//                 />
//                 <Column
//                     header={<Cell>City</Cell>}
//                     cell={<TextCell data={dataList} col="city" />}
//                     width={100}
//                 />
//                 <Column
//                     header={<Cell>Street</Cell>}
//                     cell={<TextCell data={dataList} col="street" />}
//                     width={200}
//                 />
//                 <Column
//                     header={<Cell>Zip Code</Cell>}
//                     cell={<TextCell data={dataList} col="zipCode" />}
//                     width={200}
//                 />
//                 <Column
//                     header={<Cell>Email</Cell>}
//                     cell={<LinkCell data={dataList} col="email" />}
//                     width={200}
//                 />
//                 <Column
//                     header={<Cell>DOB</Cell>}
//                     cell={<DateCell data={dataList} col="date" />}
//                     width={200}
//                 />
//             </Table>
//         );
//     }
// }
//
// export default ObjectDataExample;