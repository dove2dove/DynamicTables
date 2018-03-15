import React, { Component } from 'react';

class FieldInput extends Component {
  constructor(props) {
    super(props);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.state = {
    }
  }
  render() {
    return (
      {this.isNumberWidget(field.type) ? <input type={widgetType} step={numberstep} id="datafld" value={field.fvalue} onChange={this.handleFieldChange(idx)} /> : <input type={widgetType} id="datafld" value={field.fvalue} onChange={this.handleFieldChange(idx)} />}
    )
  }
}
FieldInput.propTypes = {};
FieldInput.defaultProps = {
};

export default FieldInput;
