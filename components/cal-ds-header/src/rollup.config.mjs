//@ts-check
import css from "rollup-plugin-import-css";
import htmlString from "rollup-plugin-html-string";

export default {
  input: "src/bundle.mjs",
  output: {
    file: "dist/index.js",
    format: "esm"
  },
  plugins: [
    css({ minify: true, modules: false }),
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
