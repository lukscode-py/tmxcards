const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "welcome",
  template: "welcome-midnight-focus",
  width: 1024,
  height: 420,
  background: {
    imagePath: null,
    overlayOpacity: 0
  },
  avatar: {
    enabled: true,
    path: null,
    opacity: 1,
    borderColor: null,
    borderStartColor: "#FFFFFF",
    borderEndColor: "#A1A1AA"
  },
  text: {
    title: {
      value: "BEM-VINDO(A)"
    },
    name: {
      value: "Nome"
    },
    group: {
      value: "Nome do grupo"
    }
  },
  output: {
    format: "svg",
    returnType: "file"
  }
};

function createWelcomeMidnightFocus(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createWelcomeMidnightFocus
};
