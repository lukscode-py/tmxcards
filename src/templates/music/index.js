const merge = require("../../utils/merge");
const { assertVariantExists } = require("../../utils/validate");
const presets = require("../../presets/music");

function createMusicCard(options = {}) {
  const variant = options.variant || "music-01";
  const preset = assertVariantExists(presets, variant, "music");
  return merge(preset, options);
}

module.exports = {
  createMusicCard
};
