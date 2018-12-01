import React from "react";
import Column from "./column";
import PropTypes from "prop-types";
import s from "./../css/package.scss";
import s2 from "./../css/pagedtable.scss";
import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterInput from "./filterinput";
import Table from "./table";

export default class PagedTable extends Table {
  constructor(props) {
    super(props);
    this.state.page = 1;
    this.state.pageSize = props.pageSize || 50;
  }
  render() {
    this.datax = this.state.subdata2 || this.state.subdata1 || this.state.data;
    this.selectable = this.props.selectable === true && this.datax.length > 0;
    var style = Object.assign({ width: this.state.tablewidth + 2, marginLeft: "auto", marginRight: "auto" }, this.props.style);
    this.pages = Math.ceil(this.datax.length / this.state.pageSize);
    console.log(this.pages);
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
              {this.renderData(this.datax)}
              {this.datax.length === 0 && this.renderNoInfo()}
            </tbody>
          </table>
        </div>
        <div className={s2.pagebuttons}>
          <button onClick={this.firstPage}>
            <FontAwesomeIcon icon="fast-backward" />
          </button>
          <button onClick={this.prevPage}>
            <FontAwesomeIcon icon="backward" />
          </button>
          {this.page}/{this.pages}
          <button onClick={this.nextPage}>
            <FontAwesomeIcon icon="forward" />
          </button>
          <button onClick={this.lastPage}>
            <FontAwesomeIcon icon="fast-forward" />
          </button>
        </div>
      </div>
    );
  }
  get pageSize() {
    return this.state.pageSize;
  }
  set pageSize(pageSize) {
    this.setState({ pageSize });
  }
  get page() {
    return this.state.page;
  }
  set page(page) {
    if (page < 1 || page > this.pages) return;
    this.setState({ page });
  }
  renderData(data) {
    const subdata = [];
    var i_index = 1 * (this.state.page - 1) * this.state.pageSize;
    var f_index = Math.min(this.state.page * this.state.pageSize, data.length - 1);
    for (let i = i_index; i <= f_index; i++) {
      subdata.push(data[i]);
    }
    return subdata.map((o, i) => this.renderRow({ index: o.stb_oid, key: i, style: {} }));
  }
  prevPage = () => this.page--;
  nextPage = () => this.page++;
  firstPage = () => (this.page = 1);
  lastPage = () => (this.page = this.pages);
}

PagedTable.propTypes = {
  pageSize: PropTypes.number
};
