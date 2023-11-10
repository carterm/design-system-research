//@ts-check
const defaultConfig = require("@11ty/eleventy/src/defaultConfig");
const path = require("path");

module.exports = function (
  /** @type {import("@11ty/eleventy").UserConfig} **/ eleventyConfig
) {
  eleventyConfig.addPassthroughCopy({
    "sample_site/images": "images",
    "sample_site/siteRoot": "/",
    //"src/js": "js",
    "src/css": "css"
  });

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

  //Adding a transform to make the output work as non-server static files
  eleventyConfig.addTransform(
    "staticPaths",
    /**
     * @param {string} content
     * @param {string} outputPath
     */
    async function (content, outputPath) {
      const basePath = config.dir.output;

      const relativePath = path
        .relative(path.dirname(outputPath), path.dirname(basePath))
        .slice(0, -2); //removing last 2 dots

      return content
        .replace(/href="(.*\/)"/g, 'href="$1index.html"') // fixing any root path links
        .replace(/=\"\//g, `="${relativePath}`); //Replace all ... ="/  ... with new path
    }
  );

  return config;
};
