import React, { Component } from 'react';
import SingleTableUpdate from './SingleTableUpdate';
import './UpdateTables.css';

var fetcherror = '';
class UpdateTables extends Component {
  constructor(props) {
    super(props);
    this.handleParentFieldChange = this.handleParentFieldChange.bind(this);
    this.state = {
      riskType: '',
      AllModelFields: [],
      waitpage: false,
      flddisable: false,
    }
  }

  getriskTypeData(){
    var url = '';
    if (this.state.riskType !== ''){
      if (this.state.riskType.toLowerCase() === 'all'){
        //url = 'http://127.0.0.1:8092/dymanicModel/RiskTypeList.json/';
        url = 'https://vdwoodie.pythonanywhere.com/dymanicModel/RiskTypeList.json/';
        fetch(url, {
          method: 'GET', // or 'PUT' 'POST'
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then(res => res.json())
        .then(response => this.setState({AllModelFields: response}))
        .then(response => console.log('Success:', response))
        .catch(function(error) {
          console.error('Error:', error);
          fetcherror = error.toString();
        });
      }else {
        //url = 'http://127.0.0.1:8092/dymanicModel/Single.json/?TableName='+this.state.riskType.trim();
        url = 'https://vdwoodie.pythonanywhere.com/dymanicModel/Single.json/?TableName='+this.state.riskType.trim();
        fetch(url, {
          method: 'GET', // or 'PUT' 'POST'
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then(response => response.json())
        .then(response => this.setState({AllModelFields: response}))
        .then(response => console.log('Success:', response))
        .catch(function(error) {
          console.error('Error:', error);
          fetcherror = error.toString();
        });
      }
    }
  }

  handleParentFieldChange (idx, modRecord) {
    const tempAllModelFields = Array.from(this.state.AllModelFields);
    tempAllModelFields[idx] = modRecord;
    this.setState({AllModelFields: tempAllModelFields});
  }

  handleRiskTypeChange = (e) => {
    this.setState({riskType: e.target.value});
  }

  handleRiskTypeonBlur = (e) => {
    this.getriskTypeData();
    this.setState({waitpage: true});
    this.setState({flddisable: true});
  }

  loadAllTableView() {
    return (
      <div>
      {this.state.AllModelFields.map((record, idx) => (
        <SingleTableUpdate key={idx} SingleModelRecord={record} RecIndex={idx} handleParentFieldChange={this.handleParentFieldChange}/>
      ))}
      <button className="submitfrmBtn">Submit</button>
      </div>
    );
  }

  render() {
    var formview='';
    if (this.state.AllModelFields && this.state.AllModelFields.length > 0){
      formview = this.loadAllTableView();
    }else{
      if (this.state.waitpage){
        formview = (
          <div>
              <div className="modelSeperator">
              </div>
              <div className="PageMessage">
                <p>Loading Page, wait... </p>
              </div>
          </div>
        )
      }else{
        formview = '';
      }
    }
    //onSubmit={this.handleCreateSubmit}
    return (
      <div className="inputForm">
      <form id="CreateForm" >
      <label id="RiskTyp">Risk Type: </label>
      {(this.state.flddisable) ? <input type="text" id="riskType" placeholder="Enter Risk Type or All" ref="risktype" value={this.state.RiskType} onChange={this.handleRiskTypeChange} onBlur={this.handleRiskTypeonBlur}  disabled/>:
      <input type="text" id="riskType" placeholder="Enter Risk Type or All" ref="risktype" value={this.state.RiskType} onChange={this.handleRiskTypeChange} onBlur={this.handleRiskTypeonBlur}/>}
      {formview}
      </form>
      </div>
    )
  }
}
UpdateTables.propTypes = {};
UpdateTables.defaultProps = {};

export default UpdateTables;
