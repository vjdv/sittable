import path from "path";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "rollup-plugin-replace";
import postcss from "rollup-plugin-postcss";

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "prop-types": "PropTypes"
};

export default {
  input: "./src/index.js",
  output: [
    {
      file: "./build/index.js",
      format: "umd",
      name: "SitControls",
      sourcemap: true,
      globals
    },
    {
      file: "./build/index.module.js",
      format: "es",
      sourcemap: true,
      globals
    }
  ],
  plugins: [
    postcss({
      modules: true
    }),
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"]
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    resolve(),
    commonjs()
  ],
  external: ["react", "react-dom", "prop-types", "react-fontawesome"]
};
