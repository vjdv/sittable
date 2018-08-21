import React from "react";
import s from "./../css/filterinput.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

var counter = 0;

export default class FilterInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: [], selected: [], show: true };
    props.options.forEach(o => {
      if (this.state.options.indexOf(o) == -1) this.state.options.push(o);
    });
    this.filterType = props.filterType;
    this.onChange = props.onChange;
    this.onClose = props.onClose;
    if (this.state.options.length <= 10) this.filterType = "checkboxx";
    this.list_id = "sitfilterlist" + ++counter;
  }
  render() {
    if (this.filterType === "checkbox") {
      return (
        <div className={s.filterinput}>
          {this.props.placeholder}
          <FontAwesomeIcon className={s.button} icon={"angle" + (this.state.show ? "-down" : "-up")} onClick={() => this.setState({ show: !this.state.show })} />
          <FontAwesomeIcon className={s.button} icon="times" onClick={() => this.onClose()} />
          <div style={{ display: this.state.show ? "block" : "none" }}>
            {this.state.options.map((o, i) => {
              const index = this.state.selected.indexOf(o);
              const checked = index !== -1;
              return (
                <div key={o} onClick={() => this.changeOptions(o, index)}>
                  <FontAwesomeIcon icon={[checked ? "fas" : "far", checked ? "check-circle" : "circle"]} color="#3b5bdb" />
                  &nbsp;
                  {o}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return (
      <div className={s.filterinput}>
        <input list={this.list_id} placeholder={this.props.placeholder} onChange={this.onChangedInput} autoFocus />
        <datalist id={this.list_id}>
          {this.state.options.map(o => (
            <option key={o} value={o} />
          ))}
        </datalist>
        <FontAwesomeIcon icon="times" onClick={() => this.onClose()} />
      </div>
    );
  }
  onChangedInput = e => {
    var val = e.target.value;
    const strfunc = o => val === "" || ("" + o).toLowerCase().indexOf(val.toLowerCase()) !== -1;
    const intfunc = o => val === "" || (o !== "" && o >= Number(val));
    this.onChange(strfunc);
  };
  changeOptions = (o, i) => {
    if (i === -1) this.state.selected.push(o);
    else this.state.selected.splice(i, 1);
    this.forceUpdate(this.onChange(o => this.state.selected.length === 0 || this.state.selected.indexOf(o) !== -1));
  };
}

FilterInput.defaultProps = {
  options: []
};
