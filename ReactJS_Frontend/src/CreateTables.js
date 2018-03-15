import React, { Component } from 'react';
import './CreateTables.css';

class CreateTables extends Component {
  constructor(props) {
    super(props);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.state = {
      RiskType: '',
      ModelFields: [{ name: '', type: '', options: '' }],
      loadFormBody: false,
      responseOk: false,
      responseMsg: '',
    }
  }
  handleRiskTypeChange = (e) => {
    this.setState({
      RiskType: e.target.value,
      loadFormBody: true,
    });
  }
  handleAddField = () => {
    this.setState({ModelFields: this.state.ModelFields.concat([{ name: '', type: '', options: '' }])});
  }
  handleRemovefield = (idx) => () => {
    this.setState({ModelFields: this.state.ModelFields.filter((fld, ndx) => idx !== ndx)});
  }
  handleFieldNameChange = (idx) => (evt) => {
    const ModelFlds = this.state.ModelFields.map((fld, ndx) => {
      if (idx !== ndx) return fld;
      return {...fld, name: evt.target.value};
    });
    this.setState({ModelFields: ModelFlds});
  }
  handleFieldTypeChange = (idx) => (evt) => {
    const ModelFlds = this.state.ModelFields.map((fld, ndx) => {
      if (idx !== ndx) return fld;
      return {...fld, type: evt.target.value};
    });
    this.setState({ModelFields: ModelFlds});
  }
  handleFieldOptionsChange = (idx) => (evt) => {
    const ModelFlds = this.state.ModelFields.map((fld, ndx) => {
      if (idx !== ndx) return fld;
      return {...fld, options: evt.target.value};
    });
    this.setState({ModelFields: ModelFlds});
  }
  handleCreateSubmit (evt) {
    evt.preventDefault();
    if (this.validateFormValues(this.state.RiskType, this.state.ModelFields)){
      //const url = 'http://127.0.0.1:8092/tableCreate/';
      const url = 'https://vdwoodie.pythonanywhere.com/tableCreate/';
      const Req = {"RiskType":this.state.RiskType,"Fields": this.state.ModelFields};
      //console.log('ClientRequest:', Req)
      fetch(url, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(Req)
      }).then(res => res.json())
      .then(response => this.setState({responseMsg: response}))
      .catch(error => console.error('Error:', error))
    }
  }
  validateFormValues(type, fields){
    var yesno = true;
    var pos = 0;
    if (!this.validateAlpha(type)) {
      alert(`Issues with the Risk Type Value`);
      this.refs.risktype.focus();
      return false;
    }else{
      fields.map((fld, ndx) => {
        if (((!this.validateAlphaNumeric(fld.name)) || (!this.validateAlpha(fld.type))) && (yesno)){
          yesno = false;
          pos = ndx;
        }
      });
      if (!yesno){
        alert(`There are Issues with the Risk Type Fields`);
        this[`nameref${pos}`].focus();
      }
    }
    return yesno;
  }
  validateAlpha(varble){
    var varstr = varble.trim();
    if ((varstr.length > 0) && (this.isAlpha(varstr))){
      return true;
    }else{
      return false;
    }
  }
  validateAlphaNumeric(varble){
    var varstr = varble.trim();
    if ((varstr.length > 0) && (this.isAlphaNumeric(varstr))) {
      if (this.isAlpha(varstr.charAt(0))){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  isAlphaNumeric = (ch) => {
    return ch.match(/^[a-z0-9]+$/i) !== null;
  }

  isAlpha = (ch) => {
    return ch.match(/^[a-z]+$/i) !== null;
  }
  loadForm(){
    return (
      <div>
      <table className="RiskModelTable">
      <thead>
      <tr>
      <th id="idcol">No.</th>
      <th id="namecol">Field Name</th>
      <th id="typecol">Field Type</th>
      <th id="optionscol">Type Options</th>
      </tr>
      </thead>
      <tbody>
      {this.state.ModelFields.map((field, idx) => (
        <tr key={idx}>
        <td id="idfld">{idx+1}</td>
        <td id="namefld"><input type="text" ref={input => {this[`nameref${idx}`] = input;}} id="name" value={field.name} onChange={this.handleFieldNameChange(idx)}/></td>
        <td id="typefld"><input type="text" id="type" list="TypeList" value={field.type} onChange={this.handleFieldTypeChange(idx)}/>
        <datalist id="TypeList">
        <option>CharField</option>
        <option>DateField</option>
        <option>DecimalField</option>
        <option>FloatField</option>
        <option>IntegerField</option>
        <option>TextField</option>
        </datalist>
        </td>
        <td id="optionsfld"><input type="text" id="options" value={field.options} onChange={this.handleFieldOptionsChange(idx)}/></td>
        {idx > 0 ? <td id="Removefld"><button type="button" onClick={this.handleRemovefield(idx)} className="removeField">-</button></td>: <td> </td>}
        </tr>
      ))}
      </tbody>
      </table>
      <button type="button" onClick={this.handleAddField} className="addFieldBtn">Add Field</button>
      <button className="submitfrmBtn">Submit</button>
      </div>
    )
  }
  render() {
    var tableView='';
    if (this.state.loadFormBody){
      if (this.state.responseMsg.trim().length === 0){
        tableView = this.loadForm();
      }else{
        this.setState({responseMsg: ''});
        this.setState({ModelFields: [{ name: '', type: '', options: '' }]});
        this.setState({loadFormBody: false});
      }
    }
    return (
      <div className="inputForm">
      <form id="CreateForm" onSubmit={this.handleCreateSubmit}>
      <fieldset>
      <legend>Create Risk Type:</legend>
      <label>Risk Type: </label>
      <input type="text" id="riskType" placeholder="Enter Risk Type" ref="risktype" value={this.state.RiskType} onChange={this.handleRiskTypeChange}/>
      <h4> </h4>
      {tableView}
      </fieldset>
      </form>
      </div>
    )
  }
}
CreateTables.propTypes = {};
CreateTables.defaultProps = {
};
export default CreateTables;
