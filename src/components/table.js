import React from "react";
//import CloseableInput from "./../closeableinput";
import Column from "./column";
import PropTypes from "prop-types";
import s from "./../css/package.scss";
import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterInput from "./filterinput";

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      columns: null,
      showFilters: false
    };
    //Variables
    this.datax = [];
    this.filters = [];
    this.lastClick = 0;
    //Referencias
    this.header = null;
    this.body = null;
    //Variables públicas
    this.onClick = props.onClick;
    this.onChange = props.onChange;
    this.highlight = props.highlight;
    //Formatos para números
    this.numberformats = {
      mount: new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      money: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
      titles: new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
      rate: new Intl.NumberFormat("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 })
    };
  }
  render() {
    this.datax = this.state.subdata2 || this.state.subdata1 || this.state.data;
    this.selectable = this.props.selectable === true && this.datax.length > 0;
    var style = Object.assign({ width: this.state.tablewidth + 2, marginLeft: "auto", marginRight: "auto" }, this.props.style);
    return (
      <div className={cx(s.sittable, this.props.small && s.small, this.props.flexible && s.flexible)} style={style}>
        <table>
          <thead ref={h => (this.header = h)}>
            <tr>
              {this.state.columns.map((col, i) => (
                <th style={{ minWidth: col.width, maxWidth: col.width }} data-col={i} key={i}>
                  {col.sortable && <FontAwesomeIcon icon={"sort" + (this.sortColumn === i ? (this.sortAsc ? "-up" : "-down") : "")} onClick={this.sort} />}
                  {col.sortable && " "}
                  {col.filtering ? (
                    <FilterInput placeholder={col.header} options={this.state.data.map(o => o[col.dataField])} onChange={f => this.addFilter(i, f)} onClose={() => this.removeFilter(i)} />
                  ) : (
                    col.header
                  )}
                  {col.filterable && !col.filtering ? " " : null}
                  {col.filterable && !col.filtering ? <FontAwesomeIcon icon="filter" onClick={this.showFilter} /> : null}
                  {col.resizable ? <span className={s.grip} /> : null}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div ref={o => (this.divbody = o)} className={s.divbody}>
          <div ref={o => (this.divwidth = o)} className={s.wide} />
          <table ref={o => (this.tablebody = o)} width={this.state.tablewidth}>
            <tbody ref={b => (this.body = b)}>
              {this.renderData()}
              {this.datax.length === 0 && this.renderNoInfo()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var thrzelem;
    var thrzoffs;
    this.header.onmousedown = e => {
      if (e.target.nodeName === "SPAN" && e.target.className === s.grip) {
        thrzelem = e.target.parentElement;
        thrzoffs = thrzelem.offsetWidth - event.pageX;
      }
    };
    document.addEventListener("mousemove", e => {
      if (thrzelem) {
        var width = thrzoffs + e.pageX;
        thrzelem.style.minWidth = width + "px";
        thrzelem.style.maxWidth = width + "px";
      }
    });
    document.addEventListener("mouseup", e => {
      if (thrzelem) {
        var width = thrzelem.offsetWidth;
        this.resizeCol(Number(thrzelem.dataset.col), width);
        thrzelem = undefined;
      }
    });
    this.divbody.onscroll = e => {
      this.header.scrollLeft = this.divbody.scrollLeft;
      console.log(this.header.scrollLeft);
    };
    this.body.onclick = this.selectionHandler;
  }
  componentDidUpdate() {
    const data = this.state.subdata2 || this.state.subdata1 || this.state.data;
    if (data.length === 0) return;
    const tr1 = this.header.firstChild;
    const tr2 = this.body.firstChild;
    const scrollWidth = this.divbody.offsetWidth - this.divwidth.offsetWidth;
    this.tablebody.width = this.state.tablewidth - scrollWidth;
    const headtds = Array.from(tr1.children);
    const bodytds = Array.from(tr2.children);
    bodytds.forEach((o, i) => {
      var width = o.offsetWidth;
      if (i + 1 === bodytds.length) width += scrollWidth;
      headtds[i].style.minWidth = width + "px";
      headtds[i].style.maxWidth = width + "px";
    });
  }
  get data() {
    return this.state.data;
  }
  set data(data) {
    data.forEach((o, i) => {
      o.stb_oid = i;
      o.stb_selected = false;
    });
    this.setState({ data, subdata1: null, subdata2: null });
  }
  get selectedItem() {
    const sdata = this.state.data.filter(o => o.stb_selected);
    return sdata[0] || null;
  }
  set selectedItem(item) {
    this.state.data.forEach(o => (o.stb_selected = o === item));
    this.forceUpdate();
  }
  get selectedIndex() {
    const obj = this.selectedItem;
    return obj === null ? -1 : obj.stb_oid;
  }
  set selectedIndex(i) {
    this.state.data.forEach(o => (o.stb_selected = o.stb_oid === i));
    this.forceUpdate();
  }
  renderTd(column, object, i) {
    var val = column.dataFunc(object);
    if (val === undefined) val = null;
    if (column.numberFormat && this.numberformats[column.numberFormat]) {
      if (val === null || val === "") val = "";
      else val = this.numberformats[column.numberFormat].format(val);
    }
    return (
      <td key={i} width={column.width} style={{ textAlign: column.align }}>
        {val}
      </td>
    );
  }
  renderTr(object, i) {
    const classes_array = [];
    if (this.highlight(object)) classes_array.push("highlighted");
    const classes_str = classes_array.join(" ");
    return (
      <tr data-row={i} key={i} data-oid={object.stb_oid} className={cx(object.stb_selected && s.selected)} style={{}}>
        {this.state.columns.map((column, i) => this.renderTd(column, object, i))}
      </tr>
    );
  }
  doubleClick = miliseconds => {
    var threshold = miliseconds || 450;
    var t0 = new Date().getTime();
    if (t0 - this.lastClick <= threshold) return true;
    this.lastClick = t0;
    return false;
  };
  showFilter = e => {
    while (e.target.tagName !== "TH") e.target = e.target.parentNode;
    var col = Number(e.target.dataset.col);
    this.state.columns[col].filtering = true;
    this.forceUpdate();
  };
  addFilter(i, f) {
    this.filters[i] = f;
    this.filter();
  }
  removeFilter(i) {
    this.state.columns[Number(i)].filtering = false;
    delete this.filters[i];
    this.filter();
  }
  filter() {
    var keys = Object.keys(this.filters);
    if (keys.length === 0) {
      this.setState({ subdata1: null, subdata2: null });
    } else {
      const subdata = [];
      for (let obj of this.state.data) {
        var push = true;
        for (let key of keys) {
          push = push && this.filters[key](this.state.columns[Number(key)].dataFunc(obj));
          if (!push) break;
        }
        if (push) subdata.push(obj);
      }
      this.setState({ subdata1: subdata });
    }
  }
  renderData() {
    return this.datax.map((d, i) => this.renderTr(d, i));
  }
  resizeCol(i, width) {
    this.state.columns[i].width = width;
    this.forceUpdate();
  }
  selectionHandler = e => {
    if (this.selectable === false) return;
    var tr = e.target;
    var td = null;
    while (tr != this.body) {
      if (tr.nodeName === "TD") td = tr;
      if (tr.nodeName === "TR") break;
      tr = tr.parentElement;
    }
    const oid = Number(tr.dataset.oid);
    if (this.selectedIndex !== oid) {
      this.state.data.forEach((o, i) => (o.stb_selected = i === oid));
      this.forceUpdate();
      this.selectedIndex = oid;
      this.onChange(this.selectedItem, oid, td.cellIndex, tr);
    }
    this.onClick(this.selectedItem, oid, td.cellIndex, tr);
  };
  sort = e => {
    while (e.target.tagName !== "TH") e.target = e.target.parentNode;
    var col = Number(e.target.dataset.col);
    var data_origin = this.state.subdata1 || this.state.data;
    var data_ordered = [];
    for (var i = 0; i < data_origin.length; i++) {
      data_ordered[i] = data_origin[i];
    }
    if (this.sortColumn === undefined || this.sortColumn !== col) {
      this.sortAsc = true;
      this.sortColumn = col;
    } else if (this.sortColumn === col && this.sortAsc) {
      this.sortAsc = false;
    } else {
      this.sortColumn = undefined;
      this.setState({ subdata2: data_origin });
      return;
    }
    col = this.state.columns[col].dataField;
    //Burbuja
    for (var i = data_ordered.length - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if ((this.sortAsc && data_ordered[j][col] < data_ordered[j - 1][col]) || (!this.sortAsc && data_ordered[j][col] > data_ordered[j - 1][col])) {
          var tmp = data_ordered[j];
          data_ordered[j] = data_ordered[j - 1];
          data_ordered[j - 1] = tmp;
        }
      }
    }
    this.setState({ subdata2: data_ordered });
  };
  renderNoInfo = () => {
    return (
      <tr>
        <td width={this.state.tablewidth} style={{ textAlign: "center" }}>
          Sin información para mostrar
        </td>
      </tr>
    );
  };
  tabularData() {
    var tmp = "";
    const data = this.state.subdata2 || this.state.subdata1 || this.state.data;
    for (var i = 0; i < data.length; i++) {
      if (i > 0) tmp += "\n";
      var obj = data[i];
      for (var j = 0; j < this.state.columns.length; j++) {
        if (j > 0) tmp += "\t";
        var val = obj[this.state.columns[j].dataField];
        tmp += val === undefined || val === null ? "" : val;
      }
    }
    return tmp;
  }
  static getDerivedStateFromProps(props, state) {
    var tablewidth = 0;
    const newstate = {};
    const columns = [];
    React.Children.forEach(props.children, child => {
      if (child.type === Column) columns.push(Column(child.props));
    });
    if (state.columns === null || state.columns.length !== columns.length) {
      columns.forEach(col => (tablewidth += col.width));
      newstate.tablewidth = tablewidth;
      newstate.columns = columns;
    } else {
      state.columns.forEach(col => (tablewidth += col.width));
      if (tablewidth !== state.tablewidth) newstate.tablewidth = tablewidth;
    }
    if (props.data !== undefined && props.data !== state.data) {
      props.data.forEach((o, i) => {
        o.stb_oid = i;
        o.stb_selected = false;
      });
      newstate.data = props.data;
      newstate.subdata1 = null;
      newstate.subdata2 = null;
    }
    return newstate;
  }
}

Table.propTypes = {
  selectable: PropTypes.bool,
  flexible: PropTypes.bool,
  data: PropTypes.array,
  highlight: PropTypes.func
};
Table.defaultProps = {
  selectable: false,
  flexible: false,
  onClick: () => undefined,
  onChange: () => undefined,
  highlight: () => false
};
