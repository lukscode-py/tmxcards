const merge = require("../../utils/merge");
const { assertVariantExists } = require("../../utils/validate");
const presets = require("../../presets/welcome");

function createWelcomeCard(options = {}) {
  const variant = options.variant || "welcome-01";
  const preset = assertVariantExists(presets, variant, "welcome");
  return merge(preset, options);
}

module.exports = {
  createWelcomeCard
};
