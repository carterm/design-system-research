//@ts-check
import terser from "@rollup/plugin-terser";
import css from "rollup-plugin-import-css";

export default function () {
  //Place a var at the top of generated source
  const banner = ""; //`var EurekaVersion="${publishPackageJsonVersion}";`;
  //const plugins = [];
  const format = "esm";

  // Minify in normal build only
  //const plugins = process.env["ROLLUP_WATCH"] === "true" ? [] : [terser({ module: true })];
  const plugins = [terser({ module: true })];

  return {
    plugins: [css({ minify: true })],
    input: "src/js/index.js",
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
    onwarn: function (warning) {
      // should intercept warnings but doesn't in some rollup versions
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }

      // console.warn everything else
      console.warn(warning.message);
    }
  };
}
