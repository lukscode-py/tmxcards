const merge = require("../../utils/merge");
const { assertVariantExists } = require("../../utils/validate");
const presets = require("../../presets/goodbye");

function createGoodbyeCard(options = {}) {
  const variant = options.variant || "goodbye-01";
  const preset = assertVariantExists(presets, variant, "goodbye");
  return merge(preset, options);
}

module.exports = {
  createGoodbyeCard
};
