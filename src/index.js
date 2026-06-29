const { resolveMagickCommand, getSupportedFormats } = require("./core/imagemagick");
const { renderCard } = require("./core/generator");
const { createSvg } = require("./core/svg");

module.exports = {
  resolveMagickCommand,
  getSupportedFormats,
  createSvg,
  renderCard
};
