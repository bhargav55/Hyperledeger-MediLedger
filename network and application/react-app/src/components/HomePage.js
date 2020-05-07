import React, {Component} from 'react'
import './../HomePage.css';
import {Tab, Nav, Row, Col} from 'react-bootstrap'
import Topbar from './Topbar'
import PatientProfile from './PatientProfile'
import { Route , withRouter} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import DoctorList from './DoctorList';
import PatientList from './PatientList';
import PatientMedicalInfo from './PatientMedicalInfo';
import DoctorProfile from './DoctorProfile'

class HomePage extends Component {



  async componentWillMount() {
    
    // this.getProfileData();
    
    
  }

    constructor(props) {
        super(props)
    
        this.state = {
            email:"",
             showSignin:true,
            checked:false,
            profileData:null
        }
    }

     getProfileData()
    {
      console.log("role: ",this.props.location.state.role)
        this.callGetMyMedicalInfoApi()
            .then(res => {
               const jsonData = JSON.parse(res.data);
               //console.log(jsonData.name)
               this.setState({profileData : jsonData})
            })
            .catch(err => {console.log("getProfileData : ",err)})
      
    }

    callGetMyMedicalInfoApi = async () => {
      const response = await fetch("http://localhost:5000/getMyMedicalInfo/"+this.props.location.state.userId)
      console.log(response)
      const body = await response.json();

      if(response.status !== 200) throw Error(body.data)
      console.log(body)
      return body;

    } 
    


    render(){
        return(
            <div className="center-div container-fluid mt-5 " >
            <Topbar />
            {this.props.location.state.role==='patient'? 
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
  <Row>
    <Col sm={2}>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="first">Profile</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="second">Doctor List</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="third">Medical Records</Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content>
        <Tab.Pane eventKey="first">
            <PatientProfile userId={this.props.location.state.userId}/>
         
        </Tab.Pane>
        <Tab.Pane eventKey="second">
            <DoctorList userId={this.props.location.state.userId}/>
        </Tab.Pane>
        <Tab.Pane eventKey="third">
            <PatientMedicalInfo userId={this.props.location.state.userId} />
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>
:
<Tab.Container id="left-tabs-example" defaultActiveKey="first1">
<Row>
  <Col sm={2}>
    <Nav variant="pills" className="flex-column">
      <Nav.Item>
        <Nav.Link eventKey="first1">Profile</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="second1">Patient List</Nav.Link>
      </Nav.Item>
     
    </Nav>
  </Col>
  <Col sm={9}>
    <Tab.Content>
      <Tab.Pane eventKey="first1">
          <DoctorProfile userId={this.props.location.state.userId}/>
       
      </Tab.Pane>
      <Tab.Pane eventKey="second1">
          <PatientList userId={this.props.location.state.userId}/>
      </Tab.Pane>
      
    </Tab.Content>
  </Col>
</Row>
</Tab.Container>
    }
</div>

        )
    }
}

export default withRouter(HomePage)