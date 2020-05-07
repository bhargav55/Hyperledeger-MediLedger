import React, {Component} from 'react'
import { toast } from 'react-toastify';
import Select from 'react-select'

class DoctorList extends Component {

    componentWillMount()
    {
        this.getDoctorList();
    }
  

    constructor(props) {
        super(props)
    
        this.state = {
            selectedDoctor:"",
            newDoctor: null,
            name:null,
            address:null,
            age:null,
            specialization:null,
            workexperience:null,
            doctorList:null,
            showDoctorInfo:false

        }
    }

    getDoctorList(){
        this.callDoctorListApi()
        .then(res => {
            if(res.status === "success"){
           const jsonData = res.data;
           console.log("doctoer list: ",res.data)
           const doctors=[]
           jsonData.forEach(function(doctorData){
            console.log(doctorData)
            var doctor= {value:doctorData, label:doctorData}
            doctors.push(doctor)
        });
           
           this.setState({
              doctorList:doctors
            })
            toast.success("Successfully retrieved doctor list")
        }
        else{
            toast.error("Retrieving Doctor list failed")
        }

        })
        .catch(err => {console.log("getDoctorList : ",err)
                       toast.error("Error getting doctor list") })
    }

    getDoctorInfo(){
        this.callDoctorInfoApi()
        .then(res => {
            if(res.status === "success"){
           const jsonData = JSON.parse(res.data);
           //console.log(jsonData.name)
           this.setState({
              name:jsonData.name,
              address:jsonData.address,
              age:jsonData.age,
              specialization:jsonData.specialization,
              workexperience:jsonData.workexperience,
              showDoctorInfo:true 
            })
            toast.success("Successfully retrieved doctor info")
        }
        else{
            toast.error("Retrieving doctor info failed")
        }
        })
        .catch(err => {console.log("getDoctorInfo : ",err)
                       toast.error("Error getting doctor info")})
       
    }
    addPermission(){
        console.log("Selected doctor: ", this.state.newDoctor)
        this.callAddPermissionApi()
        .then(res => {
           
            if(res.status === "success"){
                toast.success("Successfully added permission")
                const doctor = {value : this.state.newDoctor, label :this.state.newDoctor}
                this.setState({
                    doctorList: [...this.state.doctorList, doctor]
                  })

            }
            else{
                toast.error("Adding permission failed")
            }
           
            
        })
        .catch(err => {console.log("addPermission : ",err)
                       toast.error("Error adding permission")})

    }
    deletePermission(){
        const doctorSelected=this.state.selectedDoctor
        this.callDeletePermissionApi()
        .then(res => {
           
            if(res.status === "success"){
                

                
                let newDoctors = this.state.doctorList;
                console.log("newDoctors: ",newDoctors) //copy the array
                let index=0;
                let doctorIndex=-1
                newDoctors.forEach(function(doctorData){
                    console.log("doctorData: ",doctorData)
                 
                    if(doctorData.value === doctorSelected){
                        
                        doctorIndex=index
                    }
                    index ++;
               
                })

                if (doctorIndex > -1) {
                    newDoctors.splice(doctorIndex, 1);
                  }
                this.setState({doctorList:newDoctors})
                toast.success("Successfully deleted permission")
               
            }
            else{
                toast.error("Deleting permission failed")
            }
           
            
        })
        .catch(err => {console.log("deletePermission : ",err)
                       toast.error("Error deleting permission")})

    }

    callDoctorListApi = async () =>{
        
            const response = await fetch("http://localhost:5000/getDoctorList/"+this.props.userId)
            console.log(response)
            const body = await response.json();
      
            if(response.status !== 200) throw Error(body.data)
            console.log(body)
            return body;
      
          

    }

    callDoctorInfoApi = async () => {
        const response = await fetch("http://localhost:5000/getDoctorInfo/"+this.state.selectedDoctor)
            console.log(response)
            const body = await response.json();
      
            if(response.status !== 200) throw Error(body.data)
            console.log(body)
            return body;

    }

    callAddPermissionApi = async () =>{
        const response = await fetch("http://localhost:5000/addPermission/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                patientId: this.props.userId,
                doctorId : this.state.newDoctor
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

    callDeletePermissionApi = async () => {
        const response = await fetch("http://localhost:5000/deletePermission/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                patientId: this.props.userId,
                doctorId : this.state.selectedDoctor
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
 
    handleNewDoctorChange(e)
    {
       this.setState({newDoctor : e.target.value})
    }

    handleDoctorChange(option){
        console.log("selected doctor: ", option.value)
        this.setState({selectedDoctor : option.value})
    }

    render(){
        const {selectedDoctor} = this.state.selectedDoctor
        return(
            <div>
            <div  className="row">
                <div className="form-group col-lg-3">
                <input type="text" id="newDoctor" value={this.state.newDoctor} onChange={this.handleNewDoctorChange.bind(this)} class="form-control" placeholder="Add Doctor" required="" autofocus="" />
                </div>
                <div className="form-group col-lg-3">
                <button class="btn btn-primary btn-block" type="button" id="btn-signup" onClick={this.addPermission.bind(this)}><i class="fas fa-user-plus"></i> Add Permission</button>
                </div>
            </div>
            <div  className="row">
                <div className="form-group col-lg-3">
                   <Select placeholder="Select Doctor..." value={selectedDoctor} onChange={this.handleDoctorChange.bind(this)} options={this.state.doctorList}/>
                </div>
                <div className="form-group col-lg-3">
                <button class="btn btn-primary btn-block" type="button" id="btn-signup" onClick={this.getDoctorInfo.bind(this)}><i class="fas fa-user-plus"></i> Get Doctor Info</button>
                </div>
                <div className="form-group col-lg-3">
                <button class="btn btn-primary btn-block" type="button" id="btn-signup" onClick={this.deletePermission.bind(this)}><i class="fas fa-user-plus"></i> Delete Permission</button>
                </div>
            </div>
            { this.state.showDoctorInfo ?
            <div className="row">
                    <div className="form-group col-lg-6">
                
                 
                      <p>&nbsp;</p>
                      <div className="row">

                          <div className=" form-group col-lg-6">
                              <label>Full name</label>
                              <input type="text" className="form-control" name="first_name" id="first_name" placeholder="Full name" disabled value={this.state.name}/>
                          </div>



                          <div className=" form-group col-lg-6">
                            <label >Address</label>
                              <input type="text" className="form-control" name="address" id="address" placeholder="Address" disabled  value={this.state.address}/>
                          </div>

                      </div>

                      <div className="row">

                          <div className="form-group col-lg-6">
                              <label >Age</label>
                              <input type="text" className="form-control" name="age" id="age" placeholder="Age" disabled value={this.state.age}/>
                          </div>

                          <div className="form-group col-lg-6">
                             <label >Specialization</label>
                              <input type="text" className="form-control" name="specialization" id="specialization" placeholder="Specialization" disabled value={this.state.specialization}/>
                          </div>
                      </div>
                      <div className="row">

                      <div className=" form-group col-lg-8">
                            <label >Work Experience</label>
                        <textarea id="workExperience"  type="text" cols={40} rows={5} value={this.state.workexperience} disabled className="form-control"   placeholder="Work Experience" required />
                      </div>


                         
                      </div>

                                 	
                  </div>
                  </div>:''
                  }
                  
            
            </div>
        )
    }
}

export default DoctorList