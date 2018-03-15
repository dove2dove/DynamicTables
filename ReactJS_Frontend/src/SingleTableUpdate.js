import React, { Component } from 'react';

var widgetType ='';
var numberstep = 0;
var enumList = '';
//var enumdict = '';
class SingleTableUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SingleModel: this.props.SingleModelRecord,
    }
  }

  handleFieldChange = (idx) => (evt) => {
    const ModelFlds = this.state.SingleModel.Fields.map((fld, ndx) => {
      if (idx !== ndx) return fld;
      return {...fld, fvalue: evt.target.value};
    });
    this.setState({SingleModel: {...this.state.SingleModel, Fields: ModelFlds}});
  }

  isNumberWidget = (ftype) => {
    if (ftype === 'CharField'){
      widgetType = 'text';
      numberstep = 0;
      return false;
    }else if (ftype === 'DateField'){
      widgetType = 'date';
      numberstep = 0;
      return false;
    }else if (ftype === 'DecimalField'){
      //type=number step=0.01
      widgetType = 'number';
      numberstep = 0.01;
      return true;
    }else if (ftype === 'FloatField'){
      widgetType = 'text';
      numberstep = 0;
      return false;
    }else if (ftype === 'IntegerField'){
      //type=number step=1
      widgetType = 'number';
      numberstep = 1;
      return true;
    }
  }
  handleEnums = (voptions, ndx) => {
    var opts = voptions.trim();
    enumList = '';
    //enumdict = '';
    //  console.log('OptionField:', opts);
    if (opts.toLowerCase().includes('choices=')){
      var optarray = opts.split(",");
      var optValue = '';
      for (var optidx in optarray){
        if (optarray[optidx].toLowerCase().startsWith('choices')){
          optValue = optarray[optidx];
          break;
        }
      }
      if (optValue !== ''){
        var choicevalues = optValue.split("=")[1];
        var choicearray = choicevalues.split(";");
        for (var arridx in choicearray){
          //var eachval = choicearray[arridx].replace(/\(/g, '').replace(/\)/g, '').replace(/,/, ':');
          var eachval = choicearray[arridx];
          if (eachval.trim().length > 0){
            //enumdict = enumdict.concat(eachval+',');
            enumList = enumList.concat(eachval.split('|')[1]+',');
          }
        }
        if (enumList.split(",").length >0){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  getEnumList = (vlist, ndx) => {
    var newList = enumList.trim();
    if (newList.length > 0){
      if (newList.charAt(newList.length-1) === ",") {
        newList = newList.slice(0, -1);
      }
      var enumarr = newList.split(',');
      return (
        <datalist id={vlist.concat(ndx)}>
        {enumarr.map((item, indx)=><option key={indx}>{item.trim()}</option>)}
        </datalist>
      )
    }
    return '';
  }

  loadFormPage() {
    var vlist = "TypeList";
    var handlefieldsonBlur = this.props.handleParentFieldChange;
    return (
      <div>
      <table className="RiskModelTable">
      <tbody>
      {this.state.SingleModel.Fields.map((field, idx) => (
        <tr key={idx}>
        <td id="fieldlab"><label>{field.name}: </label></td>
        <td id="fieldValue">
        {this.isNumberWidget(field.type) ?
          this.handleEnums(field.options, idx) ?
          <input type={widgetType} step={numberstep} list={vlist.concat(this.props.RecIndex).concat(idx)} id="datafld" value={field.fvalue} onChange={this.handleFieldChange(idx)} onBlur={() => handlefieldsonBlur(this.props.RecIndex, this.state.SingleModel)}/>:
          <input type={widgetType} step={numberstep} id="datafld" value={field.fvalue} onChange={this.handleFieldChange(idx)} onBlur={() => handlefieldsonBlur(this.props.RecIndex, this.state.SingleModel)}/>:
          this.handleEnums(field.options, idx) ? <input type={widgetType} list={vlist.concat(idx)} id="datafld" value={field.fvalue} onChange={this.handleFieldChange(idx)} onBlur={() => handlefieldsonBlur(this.props.RecIndex, this.state.SingleModel)}/>:
          <input type={widgetType} id="datafld" value={field.fvalue} onChange={this.handleFieldChange(idx)} onBlur={() => handlefieldsonBlur(this.props.RecIndex, this.state.SingleModel)}/>}
          {this.handleEnums(field.options, idx) ? this.getEnumList(vlist, idx): ''}
          </td>
          </tr>
        ))}
        </tbody>
        </table>
        </div>
      );
    }

    render() {
      return (
        <div>
        <div className="modelSeperator">
        </div>
        <fieldset>
        <legend> {this.state.SingleModel.RiskType} </legend>
        {this.loadFormPage()}
        </fieldset>
        </div>
      );
    }
  }

  SingleTableUpdate.propTypes = {};
  SingleTableUpdate.defaultProps = {
    SingleModelRecord: {},
    RecIndex: 0,
  };

  export default SingleTableUpdate;
