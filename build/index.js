(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('prop-types'), require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'prop-types', 'react'], factory) :
	(factory((global.SitControls = {}),global.PropTypes,global.React));
}(this, (function (exports,PropTypes,React) { 'use strict';

PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;
React = React && React.hasOwnProperty('default') ? React['default'] : React;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

//import React from "react";

function Column(props) {
  var children = props.children,
      xprops = objectWithoutProperties(props, ["children"]);

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

var Table = function (_React$Component) {
  inherits(Table, _React$Component);

  function Table(props) {
    classCallCheck(this, Table);

    var _this = possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).call(this, props));

    _this.doubleClick = function (miliseconds) {
      var threshold = miliseconds || 450;
      var t0 = new Date().getTime();
      if (t0 - _this.lastClick <= threshold) return true;
      _this.lastClick = t0;
      return false;
    };

    _this.selectionHandler = function (e) {
      if (_this.selectable === false) return;
      var tr = e.target;
      var td = null;
      while (tr != _this.body) {
        if (tr.nodeName === "TD") td = tr;
        if (tr.nodeName === "TR") break;
        tr = tr.parentElement;
      }
      var oid = Number(tr.dataset.oid);
      if (_this.selectedIndex !== oid) {
        _this.state.data.forEach(function (o, i) {
          return o.stb_selected = i === oid;
        });
        _this.forceUpdate();
        _this.selectedIndex = oid;
        _this.onChange(_this.selectedItem, oid, td.cellIndex, tr);
      }
      _this.onClick(_this.selectedItem, oid, td.cellIndex, tr);
    };

    _this.state = {
      data: [],
      columns: null,
      showFilters: false
    };
    //Variables
    _this.datax = [];
    _this.filters = [];
    _this.lastClick = 0;
    //Referencias
    _this.header = null;
    _this.body = null;
    //Variables públicas
    _this.onClick = props.onClick;
    _this.onChange = props.onChange;
    _this.highlight = props.highlight;
    //Formatos para números
    _this.numberformats = {
      mount: new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      money: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
      titles: new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
      rate: new Intl.NumberFormat("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 })
    };
    return _this;
  }

  createClass(Table, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      this.datax = this.state.subdata2 || this.state.subdata1 || this.state.data;
      this.selectable = this.props.selectable === true && this.datax.length > 0;
      var classes = ["sittable"];
      if (this.props.flexible === true) classes.push("flexible");
      if (this.props.small === true) classes.push("small");
      var style = Object.assign({ width: this.state.tablewidth + 2, marginLeft: "auto", marginRight: "auto" }, this.props.style);
      return React.createElement(
        "div",
        { className: classes.join(" "), style: style },
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            { ref: function ref(h) {
                return _this2.header = h;
              } },
            React.createElement(
              "tr",
              null,
              this.state.columns.map(function (col, i) {
                return React.createElement(
                  "th",
                  { style: { minWidth: col.width, maxWidth: col.width }, "data-col": i, key: i },
                  col.sortable ? React.createElement("a", { className: "icon-sort" }) : null,
                  col.filtering ? React.createElement(CloseableInput, {
                    placeholder: col.header,
                    onChange: function onChange(e) {
                      return _this2.filterBy(col.dataField, e.target.value);
                    },
                    onClose: function onClose() {
                      _this2.state.columns[i].filtering = false;
                      _this2.filterBy(col.dataField, "");
                    }
                  }) : col.header,
                  col.filterable && !col.filtering ? React.createElement("a", { className: "icon-filter", "data-col": i }) : null,
                  col.resizable ? React.createElement("span", { className: "grip" }) : null
                );
              })
            )
          )
        ),
        React.createElement(
          "div",
          { ref: function ref(o) {
              return _this2.divbody = o;
            } },
          React.createElement("div", { ref: function ref(o) {
              return _this2.divwidth = o;
            }, className: "wide" }),
          this.datax.length === 0 && this.props.loading !== true && React.createElement(
            "div",
            { className: "info" },
            "Sin informaci\xF3n para mostrar"
          ),
          this.props.loading === true && React.createElement(
            "div",
            { className: "info" },
            React.createElement(
              "span",
              null,
              React.createElement("span", { className: "icon-spin5 animate-spin" }),
              "Espere"
            )
          ),
          React.createElement(
            "table",
            { ref: function ref(o) {
                return _this2.tablebody = o;
              }, width: this.state.tablewidth },
            React.createElement(
              "tbody",
              { ref: function ref(b) {
                  return _this2.body = b;
                } },
              this.renderData()
            )
          )
        )
      );
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      var thrzelem;
      var thrzoffs;
      this.header.onmousedown = function (e) {
        if (e.target.nodeName === "A" && e.target.className.indexOf("icon-sort") === 0) {
          var col = e.target.parentElement.dataset.col;
          _this3.sortBy(_this3.state.columns[Number(col)].dataField, e.target);
        } else if (e.target.nodeName === "A" && e.target.className === "icon-filter") {
          var col = e.target.parentElement.dataset.col;
          _this3.state.columns[col].filtering = true;
          _this3.forceUpdate();
        } else if (e.target.nodeName === "SPAN" && e.target.className === "grip") {
          thrzelem = e.target.parentElement;
          thrzoffs = thrzelem.offsetWidth - event.pageX;
        }
      };
      document.addEventListener("mousemove", function (e) {
        if (thrzelem) {
          var width = thrzoffs + e.pageX;
          thrzelem.style.minWidth = width + "px";
          thrzelem.style.maxWidth = width + "px";
        }
      });
      document.addEventListener("mouseup", function (e) {
        if (thrzelem) {
          var width = thrzelem.offsetWidth;
          _this3.resizeCol(Number(thrzelem.dataset.col), width);
          thrzelem = undefined;
        }
      });
      this.divbody.onscroll = function (e) {
        _this3.header.scrollLeft = _this3.divbody.scrollLeft;
      };
      this.body.onclick = this.selectionHandler;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.data.length === 0) return;
      var tr1 = this.header.firstChild;
      var tr2 = this.body.firstChild;
      var scrollWidth = this.divbody.offsetWidth - this.divwidth.offsetWidth;
      this.tablebody.width = this.state.tablewidth - scrollWidth;
      var headtds = Array.from(tr1.children);
      var bodytds = Array.from(tr2.children);
      bodytds.forEach(function (o, i) {
        var width = o.offsetWidth;
        if (i + 1 === bodytds.length) width += scrollWidth;
        headtds[i].style.minWidth = width + "px";
        headtds[i].style.maxWidth = width + "px";
      });
    }
  }, {
    key: "renderTd",
    value: function renderTd(column, object, i) {
      var val = object[column.dataField] !== undefined ? object[column.dataField] : null;
      if (column.dataFunc) {
        val = column.dataFunc(val, object);
      }
      if (column.numberFormat && this.numberformats[column.numberFormat]) {
        if (val === undefined || val === null || val === "") val = "";else val = this.numberformats[column.numberFormat].format(val);
      }
      return React.createElement(
        "td",
        { key: i, width: column.width, style: { textAlign: column.align } },
        val
      );
    }
  }, {
    key: "renderTr",
    value: function renderTr(object, i) {
      var _this4 = this;

      var classes_array = [];
      if (object.stb_selected) classes_array.push("selected");
      if (this.highlight(object)) classes_array.push("highlighted");
      var classes_str = classes_array.join(" ");
      return React.createElement(
        "tr",
        { "data-row": i, key: i, "data-oid": object.stb_oid, className: classes_str, style: {} },
        this.state.columns.map(function (column, i) {
          return _this4.renderTd(column, object, i);
        })
      );
    }
  }, {
    key: "filter",
    value: function filter() {
      var keys = Object.keys(this.filters);
      if (keys.length > 0) {
        var subdata = [];
        for (var i = 0; i < this.state.data.length; i++) {
          var push = true;
          for (var j = 0; j < keys.length; j++) {
            push = push && (this.filters[keys[j]].mode === "contains" && ("" + this.state.data[i][keys[j]]).toLowerCase().indexOf(this.filters[keys[j]].data) > -1 || this.filters[keys[j]].mode === "equals" && this.state.data[i][keys[j]].toLowerCase() == this.filters[keys[j]].data);
          }
          if (push) subdata.push(this.state.data[i]);
        }
        this.setState({ subdata1: subdata });
      } else {
        this.setState({ subdata1: null, subdata2: null });
      }
    }
  }, {
    key: "filterBy",
    value: function filterBy(column, text_to_search, mode) {
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
  }, {
    key: "renderData",
    value: function renderData() {
      var _this5 = this;

      return this.datax.map(function (d, i) {
        return _this5.renderTr(d, i);
      });
    }
  }, {
    key: "resizeCol",
    value: function resizeCol(i, width) {
      this.state.columns[i].width = width;
      this.forceUpdate();
    }
  }, {
    key: "sortBy",
    value: function sortBy(col, anchor) {
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
          if (this.sortMode === "ASC" && data_ordered[j][col] < data_ordered[j - 1][col] || this.sortMode === "DESC" && data_ordered[j][col] > data_ordered[j - 1][col]) {
            var tmp = data_ordered[j];
            data_ordered[j] = data_ordered[j - 1];
            data_ordered[j - 1] = tmp;
          }
        }
      }
      this.lastSort = anchor;
      this.setState({ subdata2: data_ordered });
    }
  }, {
    key: "tabularData",
    value: function tabularData() {
      var tmp = "";
      var data = this.state.subdata2 || this.state.subdata1 || this.state.data;
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
  }, {
    key: "data",
    get: function get$$1() {},
    set: function set$$1(data) {
      data.forEach(function (o, i) {
        o.stb_oid = i;
        o.stb_selected = false;
      });
      this.setState({ data: data, subdata1: null, subdata2: null });
    }
  }, {
    key: "selectedItem",
    get: function get$$1() {
      var sdata = this.state.data.filter(function (o) {
        return o.stb_selected;
      });
      return sdata[0] || null;
    },
    set: function set$$1(item) {
      this.state.data.forEach(function (o) {
        return o.stb_selected = o === item;
      });
      this.forceUpdate();
    }
  }, {
    key: "selectedIndex",
    get: function get$$1() {
      var obj = this.selectedItem;
      return obj === null ? -1 : obj.stb_oid;
    },
    set: function set$$1(i) {
      this.state.data.forEach(function (o) {
        return o.stb_selected = o.stb_oid === i;
      });
      this.forceUpdate();
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var tablewidth = 0;
      var newstate = {};
      var columns = [];
      React.Children.forEach(props.children, function (child) {
        if (child.type === Column) columns.push(Column(child.props));
      });
      if (state.columns === null || state.columns.length !== columns.length) {
        columns.forEach(function (col) {
          return tablewidth += col.width;
        });
        newstate.tablewidth = tablewidth;
        newstate.columns = columns;
      } else {
        state.columns.forEach(function (col) {
          return tablewidth += col.width;
        });
        if (tablewidth !== state.tablewidth) newstate.tablewidth = tablewidth;
      }
      if (props.data !== undefined && props.data !== state.data) {
        props.data.forEach(function (o, i) {
          o.stb_oid = i;
          o.stb_selected = false;
        });
        newstate.data = props.data;
        newstate.subdata1 = null;
        newstate.subdata2 = null;
      }
      return newstate;
    }
  }]);
  return Table;
}(React.Component);


Table.propTypes = {
  selectable: PropTypes.bool,
  flexible: PropTypes.bool,
  data: PropTypes.array,
  highlight: PropTypes.func
};
Table.defaultProps = {
  selectable: false,
  flexible: false,
  onClick: function onClick() {
    return undefined;
  },
  onChange: function onChange() {
    return undefined;
  },
  highlight: function highlight() {
    return false;
  }
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".package_sittable__1lHHt {\n  max-width: 100%;\n  display: flex;\n  flex-flow: column;\n  overflow: hidden; }\n  .package_sittable__1lHHt table {\n    border-collapse: collapse;\n    display: block;\n    position: relative;\n    background-color: rgba(0, 0, 0, 0.05); }\n  .package_sittable__1lHHt thead {\n    display: block;\n    min-height: 22px;\n    overflow: hidden;\n    box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.15); }\n    .package_sittable__1lHHt thead tr {\n      background-color: #1c2b36; }\n      .package_sittable__1lHHt thead tr th {\n        font-size: 0.8rem;\n        position: relative;\n        font-weight: bold;\n        color: #fff;\n        user-select: none;\n        text-align: center;\n        border: 1px solid #ccc; }\n        .package_sittable__1lHHt thead tr th a {\n          color: inherit;\n          text-decoration: none; }\n          .package_sittable__1lHHt thead tr th a:hover {\n            background-color: rgba(0, 0, 0, 0.1);\n            border-radius: 4px; }\n          .package_sittable__1lHHt thead tr th a.package_active__mgXBC {\n            background-color: rgba(0, 0, 0, 0.5); }\n        .package_sittable__1lHHt thead tr th .package_grip__3vk4p {\n          position: absolute;\n          top: 0;\n          right: 0;\n          bottom: 0;\n          width: 4px;\n          cursor: col-resize; }\n          .package_sittable__1lHHt thead tr th .package_grip__3vk4p:hover {\n            background-color: rgba(0, 0, 0, 0.1); }\n  .package_sittable__1lHHt > div {\n    overflow: auto;\n    flex: 1;\n    min-height: 100px;\n    position: relative;\n    border: 1px solid #ccc;\n    border-top: none; }\n    .package_sittable__1lHHt > div .package_wide__ri8e4 {\n      width: 100%;\n      height: 0; }\n    .package_sittable__1lHHt > div tbody {\n      font-size: 0.9rem;\n      line-height: 15px;\n      background-color: #fff; }\n      .package_sittable__1lHHt > div tbody tr {\n        border-bottom: 1px solid #ccc; }\n        .package_sittable__1lHHt > div tbody tr:nth-child(odd) {\n          background-color: #fafafa; }\n        .package_sittable__1lHHt > div tbody tr:nth-child(even) {\n          background-color: #fff; }\n        .package_sittable__1lHHt > div tbody tr:hover {\n          background-color: #e0e0e0; }\n        .package_sittable__1lHHt > div tbody tr.package_highlighted__1YUtH {\n          background-color: #fff5e7; }\n        .package_sittable__1lHHt > div tbody tr.package_selected__3oqFx {\n          background-color: #aaa; }\n        .package_sittable__1lHHt > div tbody tr:last-child {\n          border-bottom: none; }\n        .package_sittable__1lHHt > div tbody tr td {\n          transition: min-width 300ms linear, max-width 300ms linear;\n          border-right: 1px solid #ccc; }\n          .package_sittable__1lHHt > div tbody tr td:last-child {\n            border-right: none; }\n    .package_sittable__1lHHt > div .package_info__3UY8x {\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n      padding: 30px 10px;\n      background-color: rgba(255, 255, 255, 0.3);\n      font-size: 1.1rem;\n      display: flex;\n      flex-flow: column;\n      justify-content: center;\n      z-index: 1; }\n      .package_sittable__1lHHt > div .package_info__3UY8x > * {\n        padding: 10px; }\n  .package_sittable__1lHHt th,\n  .package_sittable__1lHHt td {\n    padding: 5px;\n    white-space: pre-line;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n  .package_sittable__1lHHt.package_small__3j1R3 th {\n    font-size: 0.7rem;\n    padding: 0; }\n  .package_sittable__1lHHt.package_small__3j1R3 td {\n    font-size: 0.8rem;\n    padding: 4px 3px; }\n";
styleInject(css);

exports.Table = Table;
exports.Column = Column;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
