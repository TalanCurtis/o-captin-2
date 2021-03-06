import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import AssignmentsModal from '../components/AssignmentsModal';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

class InfoBox extends Component {
    constructor() {
        super();
        this.state = {
            displayAssignmentsModal: false,
            itemToEdit: {},
            modalRenderSwitch: '',
            list: [{class_name:'hello'}, {class_name:'Randy'}, {class_name: 'Aldo'}]
        }
        this.addAssignment = this.addAssignment.bind(this)
        this.editAssignment = this.editAssignment.bind(this)
        this.editMark = this.editMark.bind(this)
        this.deleteAssignment = this.deleteAssignment.bind(this)
    }


    sortBy(key, kind, stateName) {
        // sortBy takes in the state 'key' you want to reorder and  'kind' numerc and alpha.
        let newOrder = []
        switch (kind) {
            case 'alpha':
                newOrder = this.props.infoList.slice().sort((a, b) => {
                    let textA = a[key].toLowerCase();
                    let textB = b[key].toLowerCase();
                    if (this.state.sortByToggle) {
                        if (textA > textB) { return -1 }
                        if (textA < textB) { return 1 }
                    } else {
                        if (textA > textB) { return 1 }
                        if (textA < textB) { return -1 }
                    }
                    return 0;
                })
                this.setState({ sortByToggle: !this.state.sortByToggle })
                this.props.sort(newOrder, stateName)
                break;
            case 'number':
                newOrder = this.props.infoList.slice().sort((a, b) => {
                    let textA = a[key];
                    let textB = b[key];
                    if (this.state.sortByToggle) {
                        if (textA > textB) { return -1 }
                        if (textA < textB) { return 1 }
                    } else {
                        if (textA > textB) { return 1 }
                        if (textA < textB) { return -1 }
                    }
                    return 0;
                })
                this.setState({ sortByToggle: !this.state.sortByToggle })
                this.props.sort(newOrder, stateName)
                break;

            default:
                return console.log('sort by switch defaulted')
        }
    }
    /// new modal
    /////////////
    ////////////
    openModal(key, itemToEdit) {
        this.setState({
            displayAssignmentsModal: true,
            itemToEdit: itemToEdit,
            modalRenderSwitch: key
        })
    }
    cancelModal() {
        this.setState({
            displayAssignmentsModal: false,
            itemToEdit: {}
        })
    }
    addAssignment(assignment) {
        let body = Object.assign({}, assignment, { class_id: this.props.class_id })
        axios.post('/api/class/assignments/add', body).then(res => {
            this.props.refreshLists()
        })
        this.setState({ displayAssignmentsModal: false })
    }
    editAssignment(assignment) {
        let body = assignment
        axios.put('/api/class/assignments/update', body).then(res => {
            this.props.refreshLists()
        })
        this.setState({
            displayAssignmentsModal: false,
            itemToEdit: {}
        })
    }
    editMark(mark) {
        let body = {
            id: mark.mark_id,
            score: mark.score,
            date_recieved: 121212,
            notes: "",
            assignment_id: mark.assignment_id,
            user_id: mark.user_id
        }
        axios.put('/api/class/student/marks/' + mark.mark_id, body).then(res => {
            this.props.refreshLists()
        })
        this.setState({
            displayAssignmentsModal: false,
            itemToEdit: {}
        })

    }
    deleteAssignment(assignment) {
        // When using delete with a body it needs to be in a data: key
        let body = {
            data: { id: assignment.id }
        }
        axios.delete('/api/class/assignments/delete', body).then(res => {
            this.props.refreshLists()
        })
        this.setState({
            displayAssignmentsModal: false,
            itemToEdit: {}
        })
    }

    //////////////
    //////////////
    //////////////
 
    renderSwitch(key) {
        let info = []
        // Chart variables
        //// labels is they name of the classes in chart
        let labels = []
        //// numbers is the value of the average for class grade
        let numbers = []
        // colors array lets me choose different color for value in numbers
        let colors = []
        let data = {}
        let options = {}

        switch (key) {
            case 'Classes':
                info = this.props.infoList.map((x, i) => {
                    labels.push(x.class_name)
                    numbers.push(x.average)
                    colors.push(x.average > 65 ? ('#00C800') : ('#FF0000'))
                    return (
                        <Link className='Link' key={i} to={'/Class/' + x.class_id} style={{ textDecoration: 'none' }} >
                            <div className='InfoBox_Text'>
                                <h3>{x.class_name}</h3>
                                {(x.average > 65) ? <h3>{x.average}</h3> : <h3 style={{ "color": "red" }}>{x.average}</h3>}
                                {(x.assignments > 65) ? <h3>{x.assignments}</h3> : <h3 style={{ "color": "red" }}>{x.assignments}</h3>}
                                {(x.tests > 65) ? <h3>{x.tests}</h3> : <h3 style={{ "color": "red" }}>{x.tests}</h3>}
                            </div>
                        </Link>
                    )
                })
                // Chart Data
                data = {
                    labels: labels,
                    datasets: [{
                        label: 'Grade Average',
                        data: numbers,
                        backgroundColor: colors
                    }]
                }
                // Chart Options
                options = {
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 100
                            }
                        }]
                    },
                }
                return (
                    <div>
                        <div className='chart_container'>
                            <div>
                                <Bar options={options} data={data} maintainAspectRatio='false' />
                            </div>
                        </div>
                        <div className="InfoBox_Header">
                            <h2 onClick={()=>this.sortBy('class_name', 'alpha', 'classList')}>{'Class'}</h2>
                            <h2 onClick={()=>this.sortBy('average', 'number', 'classList')} >{'Avg'}</h2>
                            <h2 onClick={()=>this.sortBy('assignments', 'number', 'classList')} >{'Asgmts'}</h2>
                            <h2 onClick={()=>this.sortBy('tests', 'number', 'classList')} >{'Tests'}</h2>
                        </div>
                        <div className='InfoBox_Content'>
                            {info}
                        </div>
                    </div>
                )
            case "Tests":
                info = this.props.infoList.map((x, i) => {
                    return (
                        <div key={i}>
                            <div  className='InfoBox_Text' onClick={() => this.openModal('editAssignment', x)}>
                                <h3>{x.description}</h3>
                                <h3>{x.max_score}</h3>
                                <h3>{x.due_date}</h3>
                            </div>
                        </div>
                    )
                })
                return (
                    <div>
                        <div className="InfoBox_Header">
                            <h2 onClick={()=>this.sortBy('description', 'alpha', 'tests')} >{'Test'}</h2>
                            <h2 onClick={()=>this.sortBy('max_score', 'number', 'tests')} >{'Max'}</h2>
                            <h2>{'Due'}</h2>
                            <button onClick={() => this.openModal('addAssignment', { kind: 'test' })}>Add</button>
                        </div>
                        <div className='InfoBox_Content'>
                            {info}
                        </div>

                    </div>
                )
            case "Assignments":
                info = this.props.infoList.map((x, i) => {
                    return (
                        <div key={i} >
                            <div className='InfoBox_Text' onClick={() => this.openModal('editAssignment', x)}>
                                <h3>{x.description}</h3>
                                <h3>{x.max_score}</h3>
                                <h3>{x.due_date}</h3>
                            </div>
                        </div>
                    )
                })
                return (
                    <div>
                        <div className="InfoBox_Header">
                            <h2 onClick={()=>this.sortBy('description', 'number', 'assignments')} >{'Asgmt'}</h2>
                            <h2 onClick={()=>this.sortBy('max_score', 'number', 'assignments')} >{'Max'}</h2>
                            <h2>{'Due'}</h2>
                            <button onClick={() => this.openModal('addAssignment', { kind: 'assignment' })}>Add</button>
                        </div>
                        <div className='InfoBox_Content'>
                            {info}
                        </div>

                    </div>
                )
            case 'Students':
                info = this.props.infoList.map((x, i) => {
                    return (
                        <Link className='Link' key={i} to={'/Class/' + x.class_id + '/Student/' + x.id} style={{ textDecoration: 'none' }}>
                            <div className='InfoBox_Text'>
                                <h3>{x.first_name}</h3>
                                <h3>{x.last_name}</h3>
                                {(x.tests_avg > 65) ? <h3>{x.tests_avg}</h3> : <h3 style={{ "color": "red" }}>{x.tests_avg}</h3>}
                                {(x.assignments_avg > 65) ? <h3>{x.assignments_avg}</h3> : <h3 style={{ "color": "red" }}>{x.assignments_avg}</h3>}                                
                            </div>
                        </Link>
                    )
                })
                return (
                    <div>
                        <div className="InfoBox_Header">
                            <h2 onClick={()=>this.sortBy('first_name', 'alpha', 'students')} >{'First'}</h2>
                            <h2 onClick={()=>this.sortBy('last_name', 'alpha', 'students')} >{'Last'}</h2>
                            <h2 onClick={()=>this.sortBy('tests_avg', 'number', 'students')} >{'Tests'}</h2>
                            <h2 onClick={()=>this.sortBy('assignments_avg', 'number', 'students')} >{'Asgmts'}</h2>
                        </div>
                        <div className='InfoBox_Content'>
                            {info}
                        </div>
                    </div>
                )
            case 'StudentTests':
                info = this.props.infoList.map((x, i) => {
                    return (
                        <div key={i}>
                            <div className='InfoBox_Text' onClick={()=>this.openModal('editMark', x)}>
                                <h3>{x.description}</h3>
                                {(x.score > 65) ? <h3>{x.score}</h3> : <h3 style={{ "color": "red" }}>{x.score}</h3>}                                
                                <h3>{x.max_score}</h3> 
                                {(x.average > 65) ? <h3>{x.average}</h3> : <h3 style={{ "color": "red" }}>{x.average}</h3>}                                

                            </div>
                        </div>
                    )
                })
                return (
                    <div>
                        <div className="InfoBox_Header">
                            <h2 onClick={()=>this.sortBy('description', 'alpha', 'tests')} >{'Test'}</h2>
                            <h2 onClick={()=>this.sortBy('score', 'number', 'tests')} >{'Score'}</h2>
                            <h2 onClick={()=>this.sortBy('max_score', 'number', 'tests')} >{'Max'}</h2>
                            <h2 onClick={()=>this.sortBy('average', 'number', 'tests')} >{'Percent'}</h2>
                        </div>
                        <div className='InfoBox_Content'>
                            {info}
                        </div>
                    </div>
                )
            case 'StudentAssignments':
                info = this.props.infoList.map((x, i) => {
                    return (
                        <div key={i}>
                            <div className='InfoBox_Text'  onClick={()=>this.openModal('editMark', x)}>
                                <h3>{x.description}</h3>
                                {(x.score > 65) ? <h3>{x.score}</h3> : <h3 style={{ "color": "red" }}>{x.score}</h3>}                                
                                <h3>{x.max_score}</h3>
                                {(x.average > 65) ? <h3>{x.average}</h3> : <h3 style={{ "color": "red" }}>{x.average}</h3>}                                
                            </div>
                        </div>
                    )
                })
                return (
                    <div>
                        <div className="InfoBox_Header">
                            <h2 onClick={()=>this.sortBy('description', 'alpha', 'assignments')} >{'Asgmt'}</h2>
                            <h2 onClick={()=>this.sortBy('score', 'number', 'assignments')} >{'Score'}</h2>
                            <h2 onClick={()=>this.sortBy('max_score', 'number', 'assignments')} >{'Max'}</h2>
                            <h2 onClick={()=>this.sortBy('average', 'number', 'assignments')} >{'Percent'}</h2>
                        </div>
                        <div className='InfoBox_Content'>
                            {info}
                        </div>
                    </div>
                )
            default:
                return console.log('render switch defaulted');
        }
    }

    render() {
        return (
            <div className='InfoBox'>
                {this.renderSwitch(this.props.renderSwitch)}
                <AssignmentsModal
                    modalRenderSwitch={this.state.modalRenderSwitch}
                    itemToEdit={this.state.itemToEdit}
                    cancel={() => this.cancelModal()}
                    displayAssignmentsModal={this.state.displayAssignmentsModal}
                    addAssignment={this.addAssignment}
                    editAssignment={this.editAssignment}
                    editMark={this.editMark}
                    deleteAssignment={this.deleteAssignment}
                />
            </div>
        )
    }
}

export default InfoBox;