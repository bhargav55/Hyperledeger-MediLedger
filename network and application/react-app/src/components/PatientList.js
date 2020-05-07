import React, {Component} from 'react'
import { toast } from 'react-toastify';
import Select from 'react-select'
import DataTable from 'react-data-table-component';
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

class PatientList extends Component {

    componentWillMount()
    {
        this.getPatientList();
    }
  

    constructor(props) {
        super(props)
    
        this.state = {
            selectedPatient:"",
            newDoctor: null,
            patientList:null,
            showMedicalRecords:false,
            healthissue:null,
            medicine:null,
            hospital:null,
            showAddMedicalInfo:false,
            data:[]

        }
    }

    handleHealthIssueChange(e)
    {
        this.setState({healthissue:e.target.value})
    }
    handleMedicineChange(e)
    {
        this.setState({medicine : e.target.value})
    }
    handleHospitalChange(e)
    {
        this.setState({hospital : e.target.value})
    }

    handlePatientChange(option){
        console.log("selected patient: ", option.value)
        this.setState({selectedPatient : option.value})

        this.setState({showAddMedicalInfo : true})
        
    }

    addMedicalInfo(e){

        e.preventDefault()
        this.callWritePatientRecordApi()
        .then(res => {
           
            if(res.status === "success"){
                toast.success("Successfully added health record")
               

            }
            else{
                toast.error("Adding health record failed")
            }
           
            
        })
        .catch(err => {console.log("addMedicalInfo : ",err)
                       toast.error("Error adding health record")})

    }

    callWritePatientRecordApi = async () =>{
        const response = await fetch("http://localhost:5000/writePatientRecord/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                patientId: this.state.selectedPatient,
                doctorId : this.props.userId,
                healthissue: this.state.healthissue,
                medicine:this.state.medicine,
                hospital:this.state.hospital
               })
            // body:{
               
            //     "patientId" : this.state.registerUserId
               
            // }
        });
            console.log(response)
            const body = await response.json();
      
            if(response.status !== 200) throw Error(body.data)
            console.log(body)
            return body;
    }

    getPatientList(){
        this.callPatientListApi()
        .then(res => {
            if(res.status === "success"){
           const jsonData = res.data;
           //console.log(jsonData.name)
           const patients=[]
           jsonData.forEach(function(patientData){
            console.log(patientData)
            var patient= {value:patientData, label:patientData}
            patients.push(patient)
        });
           
           this.setState({
            patientList:patients
            })
            toast.success("Successfully retrieved patient list")
        }
        else{
            toast.error("Retrieving patient list failed")
        }

        })
        .catch(err => {console.log("getPatientList : ",err)
                       toast.error("Error getting patient list") })
    }
    getMedicalRecords(){
        this.callGetMedicalInfoByPatientIdApi()
        .then(res => {
            if(res.status === "success"){
           const jsonData = res.data;
           //console.log(jsonData.name)
           this.setState({
               data : jsonData
            })
            this.setState({
                showMedicalRecords: true
              });
            toast.success("Successfully retrieved medical records")
        }
        else{
            toast.error("failed retrieving medical records")
        }
        })
        .catch(err => {console.log("getMedicalRecords : ",err)})

    }
    callPatientListApi = async () =>{
        const response = await fetch("http://localhost:5000/getAllowedList/"+this.props.userId)
        console.log(response)
        const body = await response.json();
  
        if(response.status !== 200) throw Error(body.data)
        console.log(body)
        return body;
    }

    callGetMedicalInfoByPatientIdApi = async () =>{
        const response = await fetch("http://localhost:5000/getMedicalInfoByPatientId/"+this.props.userId+"/"+this.state.selectedPatient)
        console.log(response)
        const body = await response.json();
  
        if(response.status !== 200) throw Error(body.data)
        console.log(body)
        return body;
    }

    render() {
        const {selectedPatient} = this.state.selectedPatient
        return(
            <div>

            <div  className="row">
                <div className="form-group col-lg-3">
                   <Select placeholder="Select Patient..." value={selectedPatient} onChange={this.handlePatientChange.bind(this)} options={this.state.patientList}/>
                </div>
                <div className="form-group col-lg-3">
                <button class="btn btn-primary btn-block" type="button" id="btn-signup" onClick={this.getMedicalRecords.bind(this)}><i class="fas fa-user-plus"></i> Get Medical Records</button>
                </div>
                
                
            </div>
            {this.state.showAddMedicalInfo ?

            <form onSubmit={this.addMedicalInfo.bind(this)}  >
                 <div className="row">

                          <div className=" form-group col-lg-3">
                              
                              <input type="text" className="form-control" name="healthissue" id="healthissue" placeholder="Health issue" onChange={this.handleHealthIssueChange.bind(this)}  value={this.state.name}/>
                          </div>



                          <div className=" form-group col-lg-3">
                           
                              <input type="text" className="form-control" name="medicine" id="medicine" placeholder="Medicine Prescription" onChange={this.handleMedicineChange.bind(this)}  value={this.state.address}/>
                          </div>

                          <div className=" form-group col-lg-3">
                           
                              <input type="text" className="form-control" name="hospital" id="hospital" placeholder="Hospital" onChange={this.handleHospitalChange.bind(this)}  value={this.state.address}/>
                          </div>
                          <div className=" form-group col-lg-3">
                          <button className="btn btn-primary btn-block" type="submit"><i className="glyphicon glyphicon-ok-sign"></i> Add Medical Record</button>
                          </div>

                      </div>

                     

            </form>
            :''}
            {
                this.state.showMedicalRecords ?
                <div>
                    <DataTable
        title="Medical Records"
        columns={columns}
        data={this.state.data}
      />
                </div>

                :''
            }
            </div>
        )
    }
}

export default PatientList