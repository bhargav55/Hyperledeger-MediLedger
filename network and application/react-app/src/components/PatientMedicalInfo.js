import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
import { Route , withRouter} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { useHistory } from "react-router-dom";

const columns=[
    {
     name: 'Date',
     selector: 'date',
     sortable: true,
    },
    {
     name: 'DoctorId',
     selector: 'docterid',
     sortable: true,
    },
    {
     name: 'Hospital',
     selector: 'hospital',
     sortable: true,
    },
    {
     name: 'Health issue',
     selector: 'healthissue',
     sortable: true,
    },
    {
     name: 'Medicine',
     selector: 'medicine',
     sortable: true,
    }

];

class PatientMedicalInfo extends Component {

    componentWillMount()
    {
        this.getMedicalRecords();
    }

    constructor(props) {
        super(props)
        this.state = ({
         
           data:[]
        })
          
      
    }

    getMedicalRecords()
    {
        this.callGetMyMedicalInfoApi()
            .then(res => {
               const jsonData = JSON.parse(res.data);
               //console.log(jsonData.name)
               this.setState({
                   data : jsonData.medicalinfos
                })
            })
            .catch(err => {console.log("getMedicalRecords : ",err)})
    }

    callGetMyMedicalInfoApi = async () => {
        const response = await fetch("http://localhost:5000/getMyMedicalInfo/"+this.props.userId)
        console.log(response)
        const body = await response.json();
  
        if(response.status !== 200) throw Error(body.data)
        console.log(body)
        return body;
  
      } 

    render(){
        return(
            <DataTable
        title="Medical Records"
        columns={columns}
        data={this.state.data}
      />
        )

    }

}

export default PatientMedicalInfo