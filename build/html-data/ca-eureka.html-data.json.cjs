//@ts-check

const targetFileName = "./_site/html-data/ca-eureka.html-data.json";
const srcPath = "./src/js/web-components/";

const fs = require("node:fs");
const path = require("path");

/**
 * Default root for html-data.json
 * @typedef {Object} html_data
 * @property {number} version
 * @property {{}[]} tags
 */

/**
 * Starting template for html-data.json
 * @type {html_data} */
const combo = {
  version: 1.1,
  tags: []
};

const allFiles = fs.readdirSync(srcPath, {
  recursive: true,
  withFileTypes: true
});

// process all the html-data input files and push them into combo
allFiles
  .filter(d => d.name.endsWith(".html-data.json"))
  .forEach(f => {
    let jsonText = fs.readFileSync(f.path + "/" + f.name, {
      encoding: "utf-8"
    });

    allFiles
      .filter(
        d =>
          d.path === f.path &&
          d.name.startsWith(".html-data.") &&
          d.name.endsWith(".md")
      )
      .forEach(r => {
        jsonText = jsonText.replace(
          `"${r.name}"`,
          JSON.stringify(
            fs.readFileSync(r.path + "/" + r.name, {
              encoding: "utf-8"
            })
          )
        );
      });

    combo.tags.push(.../** @type {html_data} */ (JSON.parse(jsonText)).tags);
  });

// Make the target path if it isn't already there
const dir = path.dirname(targetFileName);
!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(targetFileName, JSON.stringify(combo, null, 2));
