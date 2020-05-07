import React, {Component} from 'react'
import { toast } from 'react-toastify';

class DoctorProfile extends Component {

  
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
            specialization : null,
            workexperience: null
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
    handleSpecializationChange(e){
        this.setState({specialization : e.target.value})
    }
    handleWorkExperienceChange(e){
        this.setState({workexperience : e.target.value})
    }
  

    getProfileData()
    {
      
        this.callDoctorInfoApi()
            .then(res => {
                if(res.status==="success"){
               const jsonData = JSON.parse(res.data);
               console.log(jsonData.name)
               this.setState({
                   name : jsonData.name,
                   address : jsonData.address,
                   age : jsonData.age,
                   specialization : jsonData.specialization,
                   workexperience : jsonData.workexperience
                })
                toast.success("Successfully retrieved doctor info")
            }
            else{
                toast.error("Retrieving doctor info failed")

            }
            })
            .catch(err => {console.log("getProfileData : ",err)
                           toast.error("Error retrieving doctor info")})
      
    }

    callDoctorInfoApi = async () => {  
      const response = await fetch("http://localhost:5000/getDoctorProfile/"+this.props.userId)
      console.log(response)
      const body = await response.json();

      if(response.status !== 200) throw Error(body.data)
      console.log(body)
      return body;

    } 

    updateDoctorInfo(e){
        e.preventDefault();
       
        this.callUpdateDoctorInfoApi()
            .then(res => {this.setState({response : res.message})
            if(res.status === "success"){
                
            }   
            else{
    
            } })
            .catch(err => toast.error("Erro updating doctor info"))
        
       


    }

    callUpdateDoctorInfoApi = async() => {

       const response = await fetch("http://localhost:5000/updateDoctorInfo/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                doctorId : this.props.userId,
                name : this.state.name,
                address : this.state.address,
                age : this.state.age,
                specialization : this.state.specialization,
                workexperience : this.state.workexperience
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
                
                 <form className="form" onSubmit={this.updateDoctorInfo.bind(this)} method="post" id="registrationForm1">
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
                             <label >Specialization</label>
                              <input type="text" className="form-control" name="specialization" id="specialization" placeholder="Specialization" onChange={this.handleSpecializationChange.bind(this)} value={this.state.specialization}/>
                          </div>
                      </div>
                      <div className="row">

                      <div className=" form-group col-lg-8">
                            <label >Work Experience</label>
                        <textarea id="workExperience"  type="text" cols={40} rows={5} value={this.state.workexperience} onChange={this.handleWorkExperienceChange.bind(this)} className="form-control"   placeholder="Work Experience" required />
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

export default DoctorProfile