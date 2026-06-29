const { resolveMagickCommand, getSupportedFormats } = require("./core/imagemagick");
const { createCardsFromCsv, parseCsvInput, renderCardsFromCsv } = require("./core/csv");
const { renderCard } = require("./core/generator");
const { createWelcomeCard } = require("./templates/welcome");
const { createGoodbyeCard } = require("./templates/goodbye");
const { createMusicCard } = require("./templates/music");
const welcomePresets = require("./presets/welcome");
const goodbyePresets = require("./presets/goodbye");
const musicPresets = require("./presets/music");

module.exports = {
  resolveMagickCommand,
  getSupportedFormats,
  parseCsvInput,
  createCardsFromCsv,
  renderCardsFromCsv,
  renderCard,
  createWelcomeCard,
  createGoodbyeCard,
  createMusicCard,
  presets: {
    welcome: welcomePresets,
    goodbye: goodbyePresets,
    music: musicPresets
  }
};
