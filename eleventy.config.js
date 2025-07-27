import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default function (eleventyConfig) {
	// Output directory: _site

	// Plugins
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	// Copying non-template content to _site
	eleventyConfig.addPassthroughCopy("img");
};
