import React from "react";
import s from "./../css/filterinput.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class FilterInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options: [], selected: [] };
    props.options.forEach(o => {
      if (this.state.options.indexOf(o) == -1) this.state.options.push(o);
    });
    this.filterType = props.filterType;
    this.onChange = props.onChange;
    this.onClose = props.onClose;
    if (this.state.options.length <= 10) this.filterType = "checkbox";
  }
  render() {
    if (this.filterType === "checkbox") {
      return (
        <div className={s.filterinput}>
          {this.props.placeholder}
          <FontAwesomeIcon icon="angle-down" />
          <FontAwesomeIcon icon="times-circle" />
          <div>
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
        {this.props.placeholder}:
        <div>
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
  changeOptions = (o, i) => {
    if (i === -1) this.state.selected.push(o);
    else this.state.selected.splice(i, 1);
    this.forceUpdate(this.onChange(o => this.state.selected.length === 0 || this.state.selected.indexOf(o) !== -1));
  };
}

FilterInput.defaultProps = {
  options: []
};
