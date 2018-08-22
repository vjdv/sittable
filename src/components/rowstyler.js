import PropTypes from "prop-types";

function RowStyler(props) {
  const { func, test, ...xprops } = props;
  if (func) return func;
  if (test === undefined) console.warn("test is required when func is not provided");
  return o => {
    if (test(o)) return xprops;
  };
}

RowStyler.propTypes = {
  func: PropTypes.func,
  test: PropTypes.func
};

export default RowStyler;
