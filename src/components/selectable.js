import PropTypes from "prop-types";

function Selectable(props, e) {
  console.log("jajaja omega destroyer");
  var tr = e.target;
  var td = null;
  while (tr != this.body) {
    if (tr.nodeName === "TD") td = tr;
    if (tr.nodeName === "TR") break;
    tr = tr.parentElement;
  }
  const oid = Number(tr.dataset.oid);
  this.setState(
    prevState => {
      if (props.mode === "multiple" && e.ctrlKey) {
        prevState.data[oid].stb_selected = !prevState.data[oid].stb_selected;
      } else {
        prevState.data.forEach(o => (o.stb_selected = false));
        prevState.data[oid].stb_selected = true;
      }
      return prevState;
    },
    () => {
      if (this.props.onChange) {
        console.warn("Table.onChange method is deprecated and will be deleted on near future, please set onChange on Selectable");
        this.onChange(this.selectedItem, oid, td.cellIndex, tr);
      }
      if (props.onChange) {
        const items = this.state.data.filter(o => o.stb_selected);
        props.onChange({ items, item: items[0] || null });
      }
    }
  );
}

Selectable.propTypes = {
  mode: PropTypes.oneOf(["single", "multiple"]),
  onChange: PropTypes.func
};
Selectable.defaultProps = {
  mode: "single"
};

export default Selectable;
