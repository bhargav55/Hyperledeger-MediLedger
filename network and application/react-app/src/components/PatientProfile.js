import React, {Component} from 'react'
import { toast } from 'react-toastify';

class PatientProfile extends Component {

  
    componentWillMount()
    {
      this.getProfileData();
    }

    constructor(props) {
        super(props)
    
        this.state = {
            name:null,
            address:null,
            age:null,
            dateofbirth:null,
            height:null,
            weight:null
        }
    }

    handleUserNameChange(e){
        this.setState({name : e.target.value})
    }
   
    handleAddressChange(e){
        this.setState({address : e.target.value})
    }
    handleAgeChange(e){
        this.setState({age : e.target.value})
    }
    handleDateOfBirthChange(e){
        this.setState({dateofbirth : e.target.value})
    }
    handleHeightChange(e){
        this.setState({height : e.target.value})
    }
    handleWeightChange(e){
        this.setState({weight : e.target.value})
    }

    getProfileData()
    {
      
        this.callGetMyMedicalInfoApi()
            .then(res => {
                if(res.status === "success"){
               const jsonData = JSON.parse(res.data);
               //console.log(jsonData.name)
               this.setState({
                   name : jsonData.name,
                   address : jsonData.address,
                   age : jsonData.age,
                   dateofbirth : jsonData.dateofbirth,
                   height : jsonData.height,
                   weight : jsonData.weight
                })
                toast.success("Successfully retrieved profile data")
            }
            else{
                toast.error("Retrieving profile data failed")
            }
            })
            .catch(err => {console.log("getProfileData : ",err)
                           toast.error("Error getting profile data") })
      
    }

    callGetMyMedicalInfoApi = async () => {
      const response = await fetch("http://localhost:5000/getMyMedicalInfo/"+this.props.userId)
      console.log(response)
      const body = await response.json();

      if(response.status !== 200) throw Error(body.data)
      console.log(body)
      return body;

    } 

    updatePatientInfo(e){
        e.preventDefault();
       
        this.callUpdatePatientInfoApi()
            .then(res => {this.setState({response : res.message})
            if(res.status === "success"){
                toast.success("updated patient Info")
            }   
            else{
                 toast.error("updating patient info failed")
            } })
            .catch(err =>{ toast.error("Error updating patient info")
                            console.log("Update Patient Info :",err)})
        
       


    }

    callUpdatePatientInfoApi = async() => {

       const response = await fetch("http://localhost:5000/updatePatientInfo/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                patientId : this.props.userId,
                name : this.state.name,
                address : this.state.address,
                age : this.state.age,
                dateofbirth : this.state.dateofbirth,
                height : this.state.height,
                weight : this.state.weight
            })
        });

        console.log(response)
        const body = await response.json();

        if(response.status !== 200) throw Error(body.message)
        console.log(body)
        return body;

    }

    render(){
        return(
            <div  className="container-fluid mt-5">
                <div className="row">
                    <div className="form-group col-lg-6">
                
                 <form className="form" onSubmit={this.updatePatientInfo.bind(this)} method="post" id="registrationForm1">
                      <p>&nbsp;</p>
                      <div className="row">

                          <div className=" form-group col-lg-6">
                              <label>Full name</label>
                              <input type="text" className="form-control" name="first_name" id="first_name" placeholder="Full name" onChange={this.handleUserNameChange.bind(this)}  value={this.state.name}/>
                          </div>



                          <div className=" form-group col-lg-6">
                            <label >Address</label>
                              <input type="text" className="form-control" name="address" id="address" placeholder="Address" onChange={this.handleAddressChange.bind(this)}  value={this.state.address}/>
                          </div>

                      </div>

                      <div className="row">

                          <div className="form-group col-lg-6">
                              <label >Age</label>
                              <input type="text" className="form-control" name="age" id="age" placeholder="Age" onChange={this.handleAgeChange.bind(this)} value={this.state.age}/>
                          </div>

                          <div className="form-group col-lg-6">
                             <label >Date of birth</label>
                              <input type="text" className="form-control" name="dateofbirth" id="dateofbirth" placeholder="Date of birth" onChange={this.handleDateOfBirthChange.bind(this)} value={this.state.dateofbirth}/>
                          </div>
                      </div>
                      <div className="row">

                          <div className="form-group col-lg-6">
                              <label >Height</label>
                              <input type="text" className="form-control" name="height" id="height" placeholder="Height" onChange={this.handleHeightChange.bind(this)} value={this.state.height}/>
                          </div>


                          <div className="form-group col-lg-6">
                              <label >Weight</label>
                              <input type="text" className="form-control" id="weight" placeholder="Weight" onChange={this.handleWeightChange.bind(this)} value={this.state.weight}/>
                          </div>
                      </div>

                      <div className="form-group">
                           <div className="col-lg-12">
                                
                              	<button className="btn btn-lg btn-success" type="submit"><i className="glyphicon glyphicon-ok-sign"></i> Save</button>
                               	{/* <button className="btn btn-lg" type="reset"><i className="glyphicon glyphicon-repeat"></i> Reset</button> */}
                            </div>
                      </div>
              	</form>
                  </div>
                  </div>
                  
            </div>
        )
    }

}

export default PatientProfile