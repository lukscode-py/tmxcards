const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "moderation",
  category: "moderation",
  template: "crimson_authority_ban",
  width: 960,
  height: 360,
  background: {
    imagePath: null,
    startColor: "#050505",
    endColor: "#140808",
    overlayColor: "#000000",
    overlayOpacity: 0,
    gridOpacity: 1
  },
  panel: {
    x: 40,
    y: 35,
    width: 880,
    height: 290,
    radius: 32,
    startColor: "#101010",
    endColor: "#1A0B0B",
    borderColor: "#FFFFFF",
    borderOpacity: 0.08,
    borderWidth: 1.5
  },
  sideBand: {
    width: 12,
    radius: 6,
    opacity: 1
  },
  alert: {
    color: "#EF4444",
    startColor: "#FF4D4D",
    endColor: "#7F1D1D"
  },
  avatar: {
    enabled: true,
    path: null,
    cx: 178,
    cy: 172,
    outerRadius: 98,
    middleRadius: 84,
    innerRadius: 76,
    size: 152,
    x: 102,
    y: 96,
    opacity: 1,
    outerFill: "#0A0A0A",
    outerStroke: "#EF4444",
    outerStrokeOpacity: 0.55,
    outerStrokeWidth: 3,
    innerFill: "#121212",
    innerStroke: "#FFFFFF",
    innerStrokeOpacity: 0.08,
    innerStrokeWidth: 2,
    overlayColor: "#000000",
    overlayOpacity: 0.18,
    ringColor: "#FFFFFF",
    ringOpacity: 0.14,
    ringWidth: 2,
    placeholderText: "Perfil",
    placeholderColor: "#FFFFFF",
    placeholderOpacity: 0.68
  },
  icon: {
    enabled: true,
    circleRadius: 45,
    circleFill: "#000000",
    circleOpacity: 0.48,
    stroke: "#EF4444",
    strokeWidth: 5,
    x1: 148,
    y1: 202,
    x2: 208,
    y2: 142,
    lineWidth: 7
  },
  text: {
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFFFFF",
    title: {
      value: "Usuário banido",
      color: "#FFFFFF",
      size: 42
    },
    userName: {
      value: "Nome",
      color: "#FFFFFF",
      size: 25,
      opacity: 0.88
    },
    groupName: {
      value: "Nome do grupo",
      color: "#FFFFFF",
      size: 18,
      opacity: 0.56
    }
  },
  status: {
    value: "BANIMENTO",
    x: 342,
    y: 66,
    width: 152,
    height: 34,
    radius: 17,
    bgColor: "#EF4444",
    bgOpacity: 0.12,
    borderColor: "#EF4444",
    borderOpacity: 0.38,
    color: "#FFFFFF",
    size: 13
  },
  reason: {
    value: "Motivo: sub text",
    x: 342,
    y: 242,
    textX: 362,
    textY: 269,
    width: 430,
    height: 42,
    radius: 14,
    size: 16,
    bgColor: "#FFFFFF",
    bgOpacity: 0.045,
    borderColor: "#FFFFFF",
    borderOpacity: 0.055,
    color: "#FFFFFF",
    opacity: 0.68
  },
  moderator: {
    value: "Admin",
    color: "#FFFFFF",
    size: 17,
    opacity: 0.86
  },
  date: {
    value: "00/00/0000",
    color: "#FFFFFF",
    size: 13,
    opacity: 0.62
  },
  time: {
    value: "00:00",
    color: "#FFFFFF",
    size: 13,
    opacity: 0.42
  },
  sidePanel: {
    x: 790,
    y: 70,
    width: 92,
    height: 218,
    radius: 24,
    fill: "#070707",
    stroke: "#FFFFFF",
    strokeOpacity: 0.07
  },
  watermark: {
    enabled: true,
    value: "BAN",
    x: 672,
    y: 185,
    color: "#FFFFFF",
    opacity: 0.035,
    size: 108,
    rotate: -10,
    letterSpacing: 5
  },
  progress: {
    x: 342,
    y: 302,
    width: 330,
    fillWidth: 118,
    height: 4,
    radius: 999,
    baseColor: "#FFFFFF",
    baseOpacity: 0.10,
    fillColor: "#EF4444",
    fillOpacity: 0.95
  },
  shadow: {
    dx: 0,
    dy: 16,
    blur: 20,
    color: "#000000",
    opacity: 0.42
  },
  fonts: {
    base: "Inter, Roboto, Arial, sans-serif",
    heavy: "Impact, Haettenschweiler, 'Arial Narrow Bold', Arial, sans-serif"
  },
  output: {
    format: "svg",
    returnType: "file"
  }
};

function createCrimsonAuthorityBan(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createCrimsonAuthorityBan
};
