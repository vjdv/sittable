import React from "react";
//import CloseableInput from "./../closeableinput";
import Column from "./column";
import PropTypes from "prop-types";
import s from "./../css/package.scss";
import cx from "classnames";

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
      <div className={cx(s.sittable, this.props.small && "small", this.props.flexible && "flexible")} style={style}>
        <table>
          <thead ref={h => (this.header = h)}>
            <tr>
              {this.state.columns.map((col, i) => (
                <th style={{ minWidth: col.width, maxWidth: col.width }} data-col={i} key={i}>
                  {col.sortable ? <a className="icon-sort" /> : null}
                  {col.filtering ? (
                    <CloseableInput
                      placeholder={col.header}
                      onChange={e => this.filterBy(col.dataField, e.target.value)}
                      onClose={() => {
                        this.state.columns[i].filtering = false;
                        this.filterBy(col.dataField, "");
                      }}
                    />
                  ) : (
                    col.header
                  )}
                  {col.filterable && !col.filtering ? <a className="icon-filter" data-col={i} /> : null}
                  {col.resizable ? <span className="grip" /> : null}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div ref={o => (this.divbody = o)}>
          <div ref={o => (this.divwidth = o)} className={s.wide} />
          {this.datax.length === 0 && this.props.loading !== true && <div className="info">Sin información para mostrar</div>}
          {this.props.loading === true && (
            <div className="info">
              <span>
                <span className="icon-spin5 animate-spin" />
                Espere
              </span>
            </div>
          )}
          <table ref={o => (this.tablebody = o)} width={this.state.tablewidth}>
            <tbody ref={b => (this.body = b)}>{this.renderData()}</tbody>
          </table>
        </div>
      </div>
    );
  }
  componentDidMount() {
    var thrzelem;
    var thrzoffs;
    this.header.onmousedown = e => {
      if (e.target.nodeName === "A" && e.target.className.indexOf("icon-sort") === 0) {
        var col = e.target.parentElement.dataset.col;
        this.sortBy(this.state.columns[Number(col)].dataField, e.target);
      } else if (e.target.nodeName === "A" && e.target.className === "icon-filter") {
        var col = e.target.parentElement.dataset.col;
        this.state.columns[col].filtering = true;
        this.forceUpdate();
      } else if (e.target.nodeName === "SPAN" && e.target.className === "grip") {
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
    };
    this.body.onclick = this.selectionHandler;
  }
  componentDidUpdate() {
    if (this.state.data.length === 0) return;
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
  get data() {}
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
    var val = object[column.dataField] !== undefined ? object[column.dataField] : null;
    if (column.dataFunc) {
      val = column.dataFunc(val, object);
    }
    if (column.numberFormat && this.numberformats[column.numberFormat]) {
      if (val === undefined || val === null || val === "") val = "";
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
    if (object.stb_selected) classes_array.push("selected");
    if (this.highlight(object)) classes_array.push("highlighted");
    const classes_str = classes_array.join(" ");
    return (
      <tr data-row={i} key={i} data-oid={object.stb_oid} className={classes_str} style={{}}>
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
  filter() {
    var keys = Object.keys(this.filters);
    if (keys.length > 0) {
      const subdata = [];
      for (var i = 0; i < this.state.data.length; i++) {
        var push = true;
        for (var j = 0; j < keys.length; j++) {
          push =
            push &&
            ((this.filters[keys[j]].mode === "contains" && ("" + this.state.data[i][keys[j]]).toLowerCase().indexOf(this.filters[keys[j]].data) > -1) ||
              (this.filters[keys[j]].mode === "equals" && this.state.data[i][keys[j]].toLowerCase() == this.filters[keys[j]].data));
        }
        if (push) subdata.push(this.state.data[i]);
      }
      this.setState({ subdata1: subdata });
    } else {
      this.setState({ subdata1: null, subdata2: null });
    }
  }
  filterBy(column, text_to_search, mode) {
    text_to_search = text_to_search.toLowerCase().trim();
    if (this.lastSort !== undefined) {
      this.lastSort.className = "icon-sort";
      this.lastSort = undefined;
      this.sortMode = undefined;
      this.sortColumn = undefined;
    }
    if (text_to_search === "") {
      delete this.filters[column];
    } else {
      if (this.filters[column]) {
        this.filters[column].data = text_to_search;
      } else {
        this.filters[column] = {
          mode: mode || "contains",
          data: text_to_search
        };
      }
    }
    this.filter();
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
  sortBy(col, anchor) {
    var data_origin = this.state.subdata1 || this.state.data;
    var data_ordered = [];
    for (var i = 0; i < data_origin.length; i++) {
      data_ordered[i] = data_origin[i];
    }
    if (this.lastSort !== undefined && this.lastSort !== anchor) {
      this.lastSort.className = "icon-sort";
    }
    if (this.sortColumn === undefined || this.sortColumn !== col) {
      this.sortMode = "ASC";
      this.sortColumn = col;
      anchor.className = "icon-sort-up";
    } else if (this.sortColumn === col && this.sortMode === "ASC") {
      this.sortMode = "DESC";
      anchor.className = "icon-sort-down";
    } else {
      this.sortMode = undefined;
      this.sortColumn = undefined;
      anchor.className = "icon-sort";
      this.setState({ subdata2: data_origin });
      return;
    }
    //Burbuja
    for (var i = data_ordered.length - 1; i >= 0; i--) {
      for (var j = 1; j <= i; j++) {
        if ((this.sortMode === "ASC" && data_ordered[j][col] < data_ordered[j - 1][col]) || (this.sortMode === "DESC" && data_ordered[j][col] > data_ordered[j - 1][col])) {
          var tmp = data_ordered[j];
          data_ordered[j] = data_ordered[j - 1];
          data_ordered[j - 1] = tmp;
        }
      }
    }
    this.lastSort = anchor;
    this.setState({ subdata2: data_ordered });
  }
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
