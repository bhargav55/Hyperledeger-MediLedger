import React, {Component} from 'react'
import './../Register.css';
import Select from 'react-select'
import { Route , withRouter} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';

const options =[
    { value: 'patient', label: 'Patient'},
    { value: 'doctor', label: 'Doctor' }
]

class Register extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            email:"",
             showSignin:true,
            checked:false,
            loginSelectedRole:"",
            registerSelectedRole:"",
            userId:null,
            loginpwd:null,
            registerUserId:null,
            registerpwd:null,
            address:null,
            age:null,
            dateofbirth:null,
            height:null,
            weight:null,
            specialization:null,
            workexperience:null,
            response:null

        }
    }

    //  toggleResetPswd(e){
    //     e.preventDefault();
    //     $('#logreg-forms .form-signin').toggle() // display:block or none
    //     $('#logreg-forms .form-reset').toggle() // display:block or none
    // }
    
     toggleSignUp(e){
        e.preventDefault();
        this.setState((prevState) => ({
            showSignin: !prevState.showSignin
          }));
    }
    handleLoginRoleChange(option){
        //e.preventDefault()
        console.log("selected login role: ", option.value)
        this.setState({loginSelectedRole : option.value})

    }

    handleRegisterRoleChange(option){
        console.log("selected register role: ", option.value)
        this.setState({registerSelectedRole : option.value})
    }
    handleUserIdChange(e){
        this.setState({userId : e.target.value})
    }
    handleUserNameChange(e){
        this.setState({name : e.target.value})
    }
    handleRegisterUserIdChange(e){
        this.setState({registerUserId : e.target.value})
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
    handleSpecializationChange(e){
        this.setState({specialization : e.target.value})
    }
    handleWorkExperienceChange(e){
        this.setState({workexperience : e.target.value})
    }

    registerUser(e){
        e.preventDefault();
        if(this.state.registerSelectedRole!==null){
        if(this.state.registerSelectedRole === 'patient'){
            this.callRegisterPatientApi()
                .then(res => {
                    if(res.result === "ok"){
                        toast.success("Successfully registered patient")
                        this.callCreatePatientRecordApi()
                            .then(res1 => {
                                if(res1.status==="success"){
                                    
                                    this.props.history.push({
                                        pathname:"/HomePage",
                                        state : { userId : this.state.userId,
                                                  role: this.state.registerSelectedRole  
                                                 }})
                                       toast.success("Successfully created patient record")
                                }
                                else{
                                    toast.error("Creating patient record failed")
                                }
                            })
                            .catch(err => {console.log("Create Patient Record: ",err)
                                          toast.error("Creating patient record failed")})
                    }
                    else{
                        toast.error("Registering patient failed")
                    }
                })
                .catch(err => {console.log(err)
                             toast.error("Registering patient failed")})
        }
        else{
            this.callRegisterDoctorApi()
                .then(res => {
                    if(res.result === "ok"){
                        toast.success("Successfully registered doctor")
                        this.callCreateDoctorRecordApi()
                            .then(res1 => {
                                if(res.status==="success"){
                                    this.props.history.push({
                                        pathname:"/HomePage",
                                        state : { userId : this.state.userId,
                                                 role: this.state.registerSelectedRole     
                                                }})
                                    toast.success("successfully created doctor record")
                                }
                                else{
                                    toast.error("Creating doctor record failed")
                                }
                            })
                            .catch(err => {console.log("Create Doctor Record: ",err)
                                          toast.error("Creating doctor record failed")})
                    }
                    else{
                        toast.error("Registering doctor failed")
                    }
                })
                .catch(err => {console.log(err)
                             toast.error("Registering doctor failed")})
                
        }
    }

    }

    loginUser(e){
        e.preventDefault();
        this.callLoginApi()
            .then(res => {this.setState({response : res.message})
            if(res.message.includes("exists")){

                //this.props.sendUserId(this.state.userId)
                this.props.history.push({
                     pathname:"/HomePage",
                    state : { userId : this.state.userId,
                              role: this.state.loginSelectedRole
                            }})

               
            }   
            else{
                toast.error("Please register for first time login")
            } })
            .catch(err => {console.log("login user: ",err);
                toast.error("Error logging user")})

    } 

    callRegisterPatientApi = async () => {
        const response = await fetch("http://localhost:5000/registerPatient/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({patientId: this.state.userId})
            // body:{
               
            //     "patientId" : this.state.registerUserId
               
            // }
        });
        console.log(response)
        const body = await response.json();

        if(response.status !== 200) throw Error(body.message)
        console.log(body)
        return body;
    }

    callRegisterDoctorApi = async () => {
        const response = await fetch("http://localhost:5000/registerDoctor/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({patientId: this.state.userId})
            // body:{
               
            //     "doctorId" : this.state.registerUserId,
               
            // }
        });
        console.log(response)
        const body = await response.json();

        if(response.status !== 200) throw Error(body.message)
        console.log(body)
        return body;
    }

    callCreatePatientRecordApi = async () => {
        const response = await fetch("http://localhost:5000/createPatientRecord/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify({
                name : this.state.name,
                patientId : this.state.userId,
                address : this.state.address,
                age : this.state.age,
                dateofbirth : this.state.dateofbirth,
                height : this.state.height,
                weight : this.state.weight
            })
            // body:{
            //     "name" : this.state.name,
            //     "patientId" : this.state.registerUserId,
            //     "address" : this.state.address,
            //     "age" : this.state.age,
            //     "dateofbirth" : this.state.dateofbirth,
            //     "height" : this.state.height,
            //     "weight" : this.state.weight
            // }
        });
        console.log(response)
        const body = await response.json();

        if(response.status !== 200) throw Error(body.message)
        console.log(body)
        return body;
    }

    callCreateDoctorRecordApi = async () => {
        const response = await fetch("http://localhost:5000/createDoctorRecord/",{
            method: "post",
            headers:{"Content-Type" : "application/json"},

            body:JSON.stringify({
                name : this.state.name,
                patientId : this.state.userId,
                address : this.state.address,
                age : this.state.age,
                specialization : this.state.specialization,
                workexperience : this.state.workexperience
            })
            // body:{
            //     "name" : this.state.name,
            //     "doctorId" : this.state.registerUserId,
            //     "address" : this.state.address,
            //     "age" : this.state.age,
            //     "specialization" : this.state.specialization,
            //     "workexperience" : this.state.workexperience
            // }
        });
        console.log(response)
        const body = await response.json();

        if(response.status !== 200) throw Error(body.message)
        console.log(body)
        return body;
    }

    callLoginApi = async () => {
        const response = await fetch("http://localhost:5000/login/"+this.state.userId)
        console.log(response)
        const body = await response.json();

        if(response.status !== 200) throw Error(body.message)
        console.log(body)
        return body;
    }
    
    // $(()=>{
    //     // Login Register Form
    //     $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    //     $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    //     $('#logreg-forms #btn-signup').click(toggleSignUp);
    //     $('#logreg-forms #cancel_signup').click(toggleSignUp);
    // })

    render(){
        const {loginSelectedRole} = this.state.loginSelectedRole
        const {registerSelectedRole} = this.state.registerSelectedRole
        return (
        <div id="logreg-forms">
            {
            this.state.showSignin ?
            <form class="form-signin" onSubmit={this.loginUser.bind(this)}>
                <h1 class="h3 mb-3 font-weight-normal" style={{textAlign:"center"}}> Sign in</h1>
               
                
                <input type="text" id="inputUserId" value={this.state.userId} onChange={this.handleUserIdChange.bind(this)} class="form-control" placeholder="User ID" required="" autofocus="" />
                <input type="password" id="inputPassword" value={this.state.loginpwd} class="form-control" placeholder="Password" required="" />
                <Select placeholder="Login as..." value={loginSelectedRole} onChange={this.handleLoginRoleChange.bind(this)} options={options}/>
                
                <button class="btn btn-success btn-block" type="submit"><i class="fas fa-sign-in-alt"></i> Sign in</button>
                
                <hr />
               
                <button class="btn btn-primary btn-block" type="button" id="btn-signup" onClick={this.toggleSignUp.bind(this)}><i class="fas fa-user-plus"></i> Register New Account</button>
            </form>
    
                :

                
                <form  class="form-signup" onSubmit={this.registerUser.bind(this)}>
                   
                    
                   <h1 class="h3 mb-3 font-weight-normal" style={{textAlign:"center"}}> Register</h1>
    
                    <input type="text" id="user-name" class="form-control" placeholder="Full name" onChange={this.handleUserNameChange.bind(this)} required="" autofocus="" />
                    <input type="text" id="user-id" onChange={this.handleUserIdChange.bind(this)} class="form-control" placeholder="User ID" required autofocus="" />
                    <input type="password" id="user-pass" class="form-control" placeholder="Password" required autofocus="" />
                    {/* <input type="password" id="user-repeatpass" class="form-control" placeholder="Repeat Password" required autofocus="" /> */}
                    <Select placeholder="Register as..." value={registerSelectedRole} onChange={this.handleRegisterRoleChange.bind(this)} options={options}/>
                    <input type="text" id="address" onChange={this.handleAddressChange.bind(this)} class="form-control" placeholder="Address" required autofocus="" />
                     
                     <div class="row">
                         
                         
                        <input type="text" id="dateofbirth" onChange={this.handleDateOfBirthChange.bind(this)}  class="form-control col-lg-6" placeholder="Date Of Birth" required autofocus="" />
                        
                    
                        <input type="text" id="age" onChange={this.handleAgeChange.bind(this)}  class="form-control col-lg-5" placeholder="Age" required autofocus="" />
                  
                    </div>

                    { (this.state.registerSelectedRole==="patient") ?

                      <div class="row">
                         
                         <input type="text" id="height" onChange={this.handleHeightChange.bind(this)}   class="form-control " placeholder="Height" required autofocus="" />
                    
                     
                         <input type="text" id="weight" onChange={this.handleWeightChange.bind(this)}  class="form-control " placeholder="Weight" required autofocus="" />
                   
                         </div>
                     :
                     <div class="row">
                         
                     <input type="text" id="specialization" onChange={this.handleSpecializationChange.bind(this)}   class="form-control" placeholder="specialization" required autofocus="" />
                    
                 
                     <input type="text" id="workexperience" onChange={this.handleWorkExperienceChange.bind(this)}  class="form-control" placeholder="workexperience" required autofocus="" />
               
                     </div>   }  
                    
                   
    
                    <button class="btn btn-primary btn-block" type="submit"><i class="fas fa-user-plus"></i> Register</button>
                    <a href="#" id="cancel_signup" onClick={this.toggleSignUp.bind(this)}><i class="fa fa-angle-left"></i> Back</a>
                </form>
                }
                <br />
            
                
        </div>

           

        )
    }
}

export default withRouter(Register)