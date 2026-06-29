const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "rank",
  category: "rank",
  template: "dark_minimal_xp_rank",
  width: 470,
  height: 120,
  radius: 0,
  background: {
    imagePath: null,
    startColor: "#070707",
    endColor: "#141414",
    opacity: 0,
    blur: 3.5
  },
  overlay: {
    startColor: "#000000",
    endColor: "#000000",
    startOpacity: 0.32,
    endOpacity: 0.64
  },
  xp: {
    current: 340,
    total: 1000,
    progress: null,
    startColor: "#FFFFFF",
    endColor: "#BDBDBD"
  },
  bar: {
    x: 134,
    y: 80,
    width: 292,
    height: 10,
    radius: 999,
    bgColor: "#FFFFFF",
    bgOpacity: 0.10,
    opacity: 0.96,
    progressWidth: null
  },
  marker: {
    cx: null,
    cy: 85,
    radius: 6,
    color: "#FFFFFF",
    opacity: 1
  },
  squares: {
    enabled: true,
    stroke: "#FFFFFF",
    strokeWidth: 0.8,
    opacity: 0.10
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
    placeholderText: "Perfil",
    placeholderColor: "#FFFFFF",
    placeholderOpacity: 0.62
  },
  level: {
    value: 12,
    x: 352,
    y: 20,
    width: 78,
    height: 28,
    radius: 14,
    textX: 391,
    textY: 39,
    bgColor: "#FFFFFF",
    bgOpacity: 0.08,
    borderColor: "#FFFFFF",
    borderOpacity: 0.10,
    color: "#FFFFFF",
    size: 13
  },
  text: {
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFFFFF",
    name: {
      value: "Nome do usuário"
    },
    xp: {
      value: null
    },
    level: {
      value: null
    },
    nextLevel: {
      value: null
    }
  },
  border: {
    color: "#FFFFFF",
    opacity: 0.14,
    width: 1.2
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

function createDarkMinimalXpRank(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createDarkMinimalXpRank
};
