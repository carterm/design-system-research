//@ts-check
const defaultConfig = require("@11ty/eleventy/src/defaultConfig");
const fs = require("node:fs");

module.exports = function (
  /** @type {import("@11ty/eleventy").UserConfig} **/ eleventyConfig
) {
  eleventyConfig.addPassthroughCopy({
    "sample_site/images": "images",
    "sample_site/js": "js",
    "sample_site/siteRoot": "/"
    //"src/js": "js",
    //"src/css": "css"
  });

  eleventyConfig.addShortcode(
    "same_page_script",
    /**
     * @example
     * {% same_page_script page %}
     */
    (/** @type {{ inputPath: string; }} */ page) => {
      const filepath = page.inputPath + ".js";
      //console.log(filepath);
      if (fs.existsSync(filepath)) {
        return `<script>\n${fs.readFileSync(filepath, "utf8")}</script>\n`;
      }
    }
  );

  //Start with default config, easier to configure 11ty later
  const config = defaultConfig(eleventyConfig);

  // allow nunjucks templating in .html files
  config.htmlTemplateEngine = "njk";
  config.markdownTemplateEngine = "njk";
  config.templateFormats = ["html", "njk", "11ty.js", "md"];

  config.dir = {
    // site content pages
    input: "sample_site/pages",
    // site structure pages (path is realtive to input directory)
    data: "../_data",
    includes: "../_includes",
    // site final outpuut directory
    output: "_site"
  };

  return config;
};
