const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "welcome",
  template: "welcome-light-01",
  width: 800,
  height: 400,
  background: {
    imagePath: null
  },
  avatar: {
    enabled: true,
    path: null,
    opacity: 1
  },
  text: {
    badge: { value: "WELCOME CARD" },
    greeting: { value: "Bem-vindo(a)!" },
    name: { value: "Nome" },
    group: { value: "Nome do grupo" },
    subtext: { value: "sub text" }
  },
  progress: {
    value: 40
  },
  output: {
    format: "png",
    returnType: "file"
  }
};

function createWelcomeLight01(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createWelcomeLight01
};
