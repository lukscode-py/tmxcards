const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "goodbye",
  category: "goodbye",
  template: "dark_minimal_farewell",
  width: 470,
  height: 120,
  radius: 0,
  background: {
    imagePath: null,
    startColor: "#070707",
    endColor: "#141414",
    opacity: 0.42,
    blur: 3.5
  },
  overlay: {
    startColor: "#000000",
    endColor: "#000000",
    startOpacity: 0.38,
    endOpacity: 0.64
  },
  accent: {
    startColor: "#FFFFFF",
    endColor: "#CFCFCF"
  },
  squares: {
    enabled: true,
    stroke: "#FFFFFF",
    mainOpacity: 0.12,
    secondaryOpacity: 0.06
  },
  avatar: {
    enabled: true,
    path: null,
    cx: 67,
    cy: 60,
    radius: 38,
    outerRadius: 41,
    size: 76,
    x: 29,
    y: 22,
    opacity: 1,
    placeholderText: "Perfil"
  },
  icon: {
    type: "x",
    cx: 149,
    cy: 39,
    radius: 10,
    stroke: "#111111",
    strokeWidth: 2
  },
  text: {
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFFFFF",
    name: {
      value: "Nome"
    },
    main: {
      value: "Saiu do grupo"
    },
    group: {
      value: "Nome do grupo"
    }
  },
  border: {
    color: "#FFFFFF",
    opacity: 0.14,
    width: 1.2,
    highlightColor: "#FFFFFF",
    highlightOpacity: 0.06,
    highlightWidth: 1
  },
  shadow: {
    dx: 0,
    dy: 8,
    blur: 10,
    color: "#000000",
    opacity: 0.32
  },
  glass: {
    color: "#FFFFFF",
    opacity: 0.025
  },
  fonts: {
    base: "Inter, Roboto, Arial, sans-serif"
  },
  output: {
    format: "svg",
    returnType: "file"
  }
};

function createDarkMinimalFarewell(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createDarkMinimalFarewell
};
