//@ts-check

const targetFileName = "./_site/html-data/ca-eureka.html-data.json";
const srcPath = "./src/js/web-components";

const fs = require("fs");
const path = require("path");

/**
 * Default root for html-data.json
 * @typedef {Object} html_data
 * @property {number} version
 * @property {*[]} tags
 */

/** @type {html_data} */
const combo = {
  version: 1.1,
  tags: []
};

const replacements = fs
  .readdirSync(srcPath, {
    recursive: true,
    withFileTypes: true
  })
  .filter(d => d.name.startsWith(".html-data.") && d.name.endsWith(".md"));

// process all the html-data files
fs.readdirSync(srcPath, {
  recursive: true,
  withFileTypes: true
})
  .filter(d => d.name.endsWith(".html-data.json"))
  .map(f => {
    let jsonText = fs.readFileSync(f.path + "/" + f.name, {
      encoding: "utf-8"
    });

    replacements
      .filter(r => r.path === f.path)
      .forEach(r => {
        const mdText = JSON.stringify(
          fs.readFileSync(r.path + "/" + r.name, {
            encoding: "utf-8"
          })
        );

        jsonText = jsonText.replace(`"${r.name}"`, mdText);
      });

    return /** @type {html_data} */ (JSON.parse(jsonText));
  })
  .forEach(f => combo.tags.push(...f.tags));

const dir = path.dirname(targetFileName);
!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(targetFileName, JSON.stringify(combo, null, 2));
