//import React from "react";
import PropTypes from "prop-types";

export default function Column(props) {
  const { children, ...xprops } = props;
  if (xprops.numberFormat) xprops.align = "right";
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
  resizable: PropTypes.bool
};
Column.defaultProps = {
  width: 120,
  dataField: "value",
  align: "left",
  filterable: false,
  sortable: true,
  resizable: true
};
