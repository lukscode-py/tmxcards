const merge = require("../utils/merge");
const { createWelcomeLight01 } = require("./welcome-light-01");

const GOODBYE_DEFAULTS = {
  kind: "goodbye",
  id: "goodbye-light-01",
  text: {
    badge: {
      value: "GOODBYE CARD"
    },
    greeting: {
      value: "Adeus!"
    },
    name: {
      value: "Nome"
    },
    group: {
      value: "Nome do grupo"
    },
    subtext: {
      value: "Esperamos você de volta em breve."
    }
  }
};

function createGoodbyeLight01(config = {}) {
  return merge(createWelcomeLight01(GOODBYE_DEFAULTS), config);
}

module.exports = {
  createGoodbyeLight01
};
