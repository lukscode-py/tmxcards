const merge = require("../utils/merge");
const { createWelcomeMidnightFocus } = require("./welcome-midnight-focus");

const GOODBYE_DEFAULTS = {
  kind: "goodbye",
  id: "goodbye-midnight-focus",
  text: {
    title: {
      value: "ADEUS"
    },
    name: {
      value: "Nome"
    },
    group: {
      value: "Nome do grupo"
    }
  }
};

function createGoodbyeMidnightFocus(config = {}) {
  return merge(createWelcomeMidnightFocus(GOODBYE_DEFAULTS), config);
}

module.exports = {
  createGoodbyeMidnightFocus
};
