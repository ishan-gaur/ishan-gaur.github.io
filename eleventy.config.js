import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import mdfigcaption from "markdown-it-image-figures";
import mdFootnote from "markdown-it-footnote";
import mdAttrs from "markdown-it-attrs";

export default function (eleventyConfig) {
  // Output directory: _site

  // Plugins
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // Markdown library
  const mdLib = markdownIt(options).use(mdfigcaption, figoptions).use(mdFootnote).use(mdAttrs);
  eleventyConfig.setLibrary("md", mdLib);

  // Sidenote shortcode: {% sidenote "content" %}
  let sidenoteCount = 0;
  eleventyConfig.addShortcode("sidenote", function(content) {
    const id = `sn-${++sidenoteCount}`;
    return `<label for="${id}" class="margin-toggle sidenote-number"></label><input type="checkbox" id="${id}" class="margin-toggle"/><span class="sidenote">${content}</span>`;
  });

  // Marginnote shortcode: {% marginnote "content" %}
  let marginnoteCount = 0;
  eleventyConfig.addShortcode("marginnote", function(content) {
    const id = `mn-${++marginnoteCount}`;
    return `<label for="${id}" class="margin-toggle"></label><input type="checkbox" id="${id}" class="margin-toggle"/><span class="marginnote">${content}</span>`;
  });

  // Copying non-template content to _site
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("misc");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("drafts/using-proteinguide/esm-sampling-crop.mp4");

  // Define a paired shortcode called 'colorBold'
  eleventyConfig.addPairedShortcode("colorBold", function(content, color) {
    return `<span style="color:${color}; font-weight:bold">${content}</span>`;
  });

  eleventyConfig.addPairedShortcode("color", function(content, color) {
    return `<span style="color:${color}">${content}</span>`;
  });

}

let options = { html: true };
let figoptions = {
  figcaption: true,
};
