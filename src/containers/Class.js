import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import InfoBox from '../components/InfoBox';
import axios from 'axios';

class Class extends Component {
    constructor() {
        super();
        this.state = {
            class_info: {class_name:''},
            assignments: [],
            tests: [],
            students: []
        }
        this.refreshLists = this.refreshLists.bind(this)
        this.sort= this.sort.bind(this)
    }
    componentDidMount() {
        // Go get assignments from database
        axios.get('/api/class/assignments/' + this.props.match.params.classId * 1).then((res) => {
            this.setState({
                assignments: res.data.assignments,
                tests: res.data.tests
            })
        })
        // Go get Students from database
        axios.get('/api/class/students/' + this.props.match.params.classId * 1).then((res) => {
            this.setState({
                students: res.data
            })
        })
        // Go get class info
        axios.get('/api/class/info/'+ this.props.match.params.classId * 1).then((res) => {
            this.setState({
                class_info: res.data[0]
            })
        })
    }

    refreshLists() {
        // Go get assignments from database
        axios.get('/api/class/assignments/' + this.props.match.params.classId * 1).then((res) => {
            this.setState({
                assignments: res.data.assignments,
                tests: res.data.tests
            })
        })
        // Go get Students from database
        axios.get('/api/class/students/' + this.props.match.params.classId * 1).then((res) => {
            this.setState({
                students: res.data
            })
        })
    }


    sort(sortedList, stateName){
        this.setState({[stateName]: sortedList})
    }

    render() {
        // get class id from url
        let class_id = this.props.match.params.classId * 1
        return (
            <div className='Class'>
                <Header title={this.state.class_info.class_name} />
                
                <InfoBox renderSwitch='Tests'
                    infoList={this.state.tests}
                    class_id={class_id}
                    refreshLists={this.refreshLists}
                    sort={this.sort}
                />
                <InfoBox renderSwitch='Assignments'
                    infoList={this.state.assignments}
                    class_id={class_id}
                    refreshLists={this.refreshLists}
                    sort={this.sort}
                />
                <InfoBox renderSwitch='Students'
                    infoList={this.state.students}
                    class_id={class_id}
                    refreshLists={this.refreshLists}
                    sort={this.sort}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return state
}
export default connect(mapStateToProps)(Class);