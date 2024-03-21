//@ts-check
import css from "rollup-plugin-import-css";
import htmlString from "rollup-plugin-html-string";

export default {
  input: "src/js/web-components/cal-ds-nav/src/index.js",
  output: {
    file: "src/js/web-components/cal-ds-nav/dist/index.js",
    format: "esm"
  },
  plugins: [
    css(),
    htmlString({
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        minifyJS: true
      }
    })
  ]
};
