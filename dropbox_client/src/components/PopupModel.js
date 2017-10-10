// import React,{Component} from 'react';
// import Modal from 'react-bootstrap';
//
// const Trigger = React.createClass({
//     getInitialState() {
//         return { show: false };
//     },
//
//     render() {
//         let close = () => this.setState({ show: false});
//
//         return (
//             <div className="modal-container" style={{height: 200}}>
//                 <input type="button"
//                     bsStyle="primary"
//                     bsSize="large"
//                     onClick={() => this.setState({ show: true})}
//                 />
//
//                 <Modal
//                     show={this.state.show}
//                     onHide={close}
//                     container={this}
//                     aria-labelledby="contained-modal-title"
//                 >
//                     <Modal.Header closeButton>
//                         <Modal.Title id="contained-modal-title">Contained Modal</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body>
//                         <input/>
//                     </Modal.Body>
//                     <Modal.Footer>
//                         <input type="button" onClick={close}>Close</input>
//                     </Modal.Footer>
//                 </Modal>
//             </div>
//         );
//     }
// });
//
