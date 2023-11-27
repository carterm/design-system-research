//@ts-check

const fs = require("fs");
const path = require("path");

/**
 * Options for ca-eureka components
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
  .readdirSync("./src/js/web-components", {
    recursive: true,
    withFileTypes: true
  })
  .filter(d => d.name.startsWith("html-data.") && d.name.endsWith(".md"));

const files = fs
  .readdirSync("./src/js/web-components", {
    recursive: true,
    withFileTypes: true
  })
  .filter(d => d.name === "html-data.json")
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
        ).slice(1, -1);

        jsonText = jsonText.replace(r.name, mdText);
      });

    return /** @type {html_data} */ (JSON.parse(jsonText));
  });

files.forEach(f => combo.tags.push(...f.tags));

const targetDir = "./_site/html-data/";

if (!fs.existsSync("./_site")) fs.mkdirSync("./_site");
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

fs.writeFileSync(
  `${targetDir}ca-eureka.html-data.json`,
  JSON.stringify(combo, null, 2)
);
