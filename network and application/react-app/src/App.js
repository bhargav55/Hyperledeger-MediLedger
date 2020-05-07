import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link,withRouter } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Register from './components/Register'
import HomePage from './components/HomePage'
import PatientProfile from './components/PatientProfile';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
        userId:null,
        
    }
}

  setUserId(value)
  {
    this.setState({ userId : value})
  }
  render(){
  return (
    <Router>
    <div className='App' >
     
       
       <ToastContainer autoClose={5000}/>
      
      
    </div>
    <Switch>
          
  <Route exact path='/' component = {Register} render={(props) => <Register {...props}  />}/> 
            <Route exact path='/HomePage' component = {HomePage} render={(props) => <HomePage {...props}  />}/> 

            <Route exact path='/PatientProfile' component ={PatientProfile} />
        </Switch>
    </Router>
  );
}
}

export default App;
