import React, { Component } from 'react';

import { Route , withRouter} from 'react-router-dom'
import  { Redirect } from 'react-router-dom'
import { useHistory } from "react-router-dom";

class Topbar extends Component {

    constructor(props) {
        super(props)

      
    }

    goToLogoutPage()
    {
        this.props.history.push('./')
    }

    render(){
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        {/* <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          DeHire
        </a> */}
        <button className="btn btn-default" style={{color:"white"}} >Medi Ledger</button>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <button className="btn btn-default" style={{color:"white"}} onClick={this.goToLogoutPage.bind(this)}>Logout</button>
            

           
          </li>
        </ul>
      </nav>

        )
    }
}

export default withRouter(Topbar)