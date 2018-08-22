//import React from "react";
import PropTypes from "prop-types";

export default function Column(props) {
  const { children, ...xprops } = props;
  if (xprops.numberFormat) {
    xprops.align = "right";
    xprops.filterType = "number";
  }
  if (xprops.dataFunc === undefined) xprops.dataFunc = o => o[xprops.dataField];
  if (xprops.styler === undefined) xprops.styler = o => ({ textAlign: xprops.align });
  return xprops;
}

Column.propTypes = {
  header: PropTypes.string.isRequired,
  width: PropTypes.number,
  dataField: PropTypes.string,
  dataFunc: PropTypes.func,
  numberFormat: PropTypes.string,
  filterable: PropTypes.bool,
  sortable: PropTypes.bool,
  resizable: PropTypes.bool,
  styler: PropTypes.func
};
Column.defaultProps = {
  width: 120,
  dataField: "value",
  align: "left",
  filterable: false,
  sortable: true,
  resizable: true
};
