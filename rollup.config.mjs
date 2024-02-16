//@ts-check
import terser from "@rollup/plugin-terser";
import css from "rollup-plugin-import-css";
import htmlString from "rollup-plugin-html-string";

export default function () {
  //Place a var at the top of generated source
  const banner = ""; //`var EurekaVersion="${publishPackageJsonVersion}";`;
  //const plugins = [];
  const format = "esm";

  // Minify in normal build only
  //const plugins = process.env["ROLLUP_WATCH"] === "true" ? [] : [terser({ module: true })];

  /** @type {terser.Options} */
  const terserOptions = {
    module: true,
    mangle: {
      properties: {
        reserved: [
          "observedAttributes",
          "connectedCallback",
          "addStyle",
          "attributeChangedCallback",
          "HTMLTemplateString"
        ]
      }
    }
  };

  // @ts-ignore
  const plugins = [terser(terserOptions)];

  return {
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
    ],
    input: "src/js/bundle.js",
    output: [
      {
        file: "_site/js/eureka.core.js",
        format,
        banner
      },
      {
        file: "_site/js/eureka.core.min.js",
        format,
        plugins,
        banner
      }
    ],
    onwarn: function (
      /** @type {{ code: string; message: string; }} */ warning
    ) {
      // should intercept warnings but doesn't in some rollup versions
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }

      // console.warn everything else
      console.warn(warning.message);
    }
  };
}
