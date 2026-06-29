const merge = require("../utils/merge");
const { createWelcomePremium01 } = require("./welcome-premium-01");

const GOODBYE_DEFAULTS = {
  kind: "goodbye",
  id: "goodbye-premium-01",
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

function createGoodbyePremium01(config = {}) {
  return merge(createWelcomePremium01(GOODBYE_DEFAULTS), config);
}

module.exports = {
  createGoodbyePremium01
};
