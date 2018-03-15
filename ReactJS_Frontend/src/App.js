import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {createBrowserHistory} from 'history';
import './App.css';
import CreateTables from './CreateTables';
import UpdateTables from './UpdateTables';

const browserHistory = createBrowserHistory();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  Home(){
    return (
      <div>
      <div className="welcomeMessage">
      </div>
        <h2>Welcome to Dynamic Risk Models/Tables</h2>
      </div>
    )
  }

  render() {
    return (
      <Router history={browserHistory}>
      <div className="MainPage">
      <div className="PageHeader">
      <h2>BriteCore Project</h2>
      </div>
      <div className="MenuPage">
      <ul id="Nav_menu">
        <li>
          <Link to="/" className="Nav_link" activeStyle={{ color: 'teal' }}>Home</Link>
        </li>
        <li>
          <Link to="/CreateRiskType" className="Nav_link" activeStyle={{ color: 'teal' }}>Create</Link>
        </li>
        <li>
          <Link to="/AddRisk" className="Nav_link" activeStyle={{ color: 'teal' }}>Update</Link>
        </li>
      </ul>
      </div>
      <div className="SubMenuPage">
      </div>
      <Route exact path="/" component={this.Home} />
      <Route path="/CreateRiskType" component={CreateTables}/>
      <Route path="/AddRisk" component={UpdateTables}/>
      </div>
      </Router>
    )
  }
}

export default App;
