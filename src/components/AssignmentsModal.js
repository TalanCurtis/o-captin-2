import React, { Component } from 'react';
import Modal from 'react-modal';

class AssignmentsModal extends Component {
    constructor(props) {
        Modal.setAppElement('body');
        super(props)
        this.state = {
            inputName: 'Placeholder',
            inputScoreMax: 0,
            inputNewScore: 0
        }
    }

    handleOnChange(title, value) {
        this.setState({
            [title]: value
        })
    }

    renderSwitch(key) {
        let modalDisplay = []
        switch (key) {
            case 'addAssignment':
                modalDisplay = (
                    <div className='Modal_Container'>
                        <div className='ModalTitle'>
                                <h2> Add New {this.props.itemToEdit.hasOwnProperty('kind') ? this.props.itemToEdit.kind.toUpperCase(): null}</h2>
                        </div>
                        <div>
                            <h2>Name</h2>
                            <input title='inputName' type="text" onChange={(e) => (this.handleOnChange(e.target.title, e.target.value))} />
                        </div>
                        <div>
                            <h2>Max Score</h2>
                            <input title='inputScoreMax' type="number" onChange={(e) => (this.handleOnChange(e.target.title, e.target.value))} />
                        </div>
                        <div className='ConfimationButtons_Container'>
                            <button onClick={this.props.cancel}>Cancel</button>
                            <button onClick={() => this.props.addAssignment(Object.assign({}, this.props.itemToEdit,
                                {
                                    max_score: this.state.inputScoreMax * 1,
                                    description: this.state.inputName,
                                    due_date: '11/22/2016',
                                    class_id: this.props.class_id
                                }
                            ))}>Add</button>
                        </div>

                    </div>
                )

                return (
                    <div>
                        {modalDisplay}
                    </div>
                )
            case 'editAssignment':
                modalDisplay = (
                    <div>
                        <h2> Edit: {this.props.itemToEdit.description}</h2>
                        <div>
                            <h2>Name : {this.props.itemToEdit.description}</h2>
                            <input title='inputName' type="text" onChange={(e) => (this.handleOnChange(e.target.title, e.target.value))} />
                        </div>
                        <div>
                            <h2>Max Score: {this.props.itemToEdit.max_score}</h2>
                            <input title='inputScoreMax' type="number" onChange={(e) => (this.handleOnChange(e.target.title, e.target.value))} />
                        </div>
                        <div className='ConfimationButtons_Container'>
                            <button onClick={() => this.props.deleteAssignment(this.props.itemToEdit)} >Delete</button>
                            <button onClick={this.props.cancel}>Cancel</button>
                            <button onClick={() => this.props.editAssignment(Object.assign({}, this.props.itemToEdit,
                                {
                                    max_score: this.state.inputScoreMax * 1,
                                    description: this.state.inputName
                                }
                            ))}>Update</button>
                        </div>

                    </div>
                )

                return (
                    <div>
                        {modalDisplay}
                    </div>
                )
            case 'editMark':
                modalDisplay = (
                    <div>
                        <h2> Change: {this.props.itemToEdit.description}</h2>
                        <div>
                            <h2>Score: {this.props.itemToEdit.score} / {this.props.itemToEdit.max_score}</h2>
                            <input title='inputNewScore' type="number" onChange={(e) => (this.handleOnChange(e.target.title, e.target.value))} />
                        </div>
                        <div className='ConfimationButtons_Container'>
                            <button onClick={this.props.cancel}>Cancel</button>
                            <button onClick={() => this.props.editMark(Object.assign({}, this.props.itemToEdit,
                                {
                                    score: this.state.inputNewScore * 1
                                }
                            ))}>Update</button>
                        </div>
                    </div>
                )

                return (
                    <div>
                        {modalDisplay}
                    </div>
                )

            default:
                return console.log('assignment modal render switch defaulted');
        }
    }

    render() {
        return (
            <Modal
                isOpen={!!this.props.displayAssignmentsModal}
                onRequestClose={this.props.cancel}
                contentLabel='Assignment Modal'
                closeTimeoutMS={200}
                className='AssignmentsModal'
            >
                {this.renderSwitch(this.props.modalRenderSwitch)}

            </Modal>
        )
    }
}

export default AssignmentsModal