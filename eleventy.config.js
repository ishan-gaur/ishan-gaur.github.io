import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
// import markdownIt from "markdown-it";
// import mdfigcaption from "markdown-it-image-figures";

export default function (eleventyConfig) {
  // Output directory: _site

  // Plugins
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // Copying non-template content to _site
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("misc");
  eleventyConfig.addPassthroughCopy("assets");
}

let options = {};
let figoptions = {
  figcaption: true,
};

// const mdLib = markdownIt(options).use(mdfigcaption, figoptions);

// module.exports = function (config) {
//   config.setLibrary("md", mdLib);
// };
