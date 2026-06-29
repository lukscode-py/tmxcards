const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "moderation",
  category: "moderation",
  template: "rank_shift_notice",
  width: 960,
  height: 360,
  mode: "promote",
  action: {
    mode: "promote",
    startColor: null,
    endColor: null,
    icon: null
  },
  background: {
    imagePath: null,
    startColor: "#050505",
    endColor: "#111111",
    overlayColor: "#000000",
    overlayOpacity: 0,
    gridOpacity: 1
  },
  card: {
    x: 40,
    y: 35,
    width: 880,
    height: 290,
    radius: 32,
    startColor: "#101010",
    endColor: "#181818",
    borderColor: "#FFFFFF",
    borderOpacity: 0.08,
    borderWidth: 1.5
  },
  sideBand: {
    width: 12,
    radius: 6,
    opacity: 1
  },
  avatar: {
    enabled: true,
    path: null,
    cx: 172,
    cy: 174,
    outerRadius: 96,
    middleRadius: 82,
    clipRadius: 74,
    size: 148,
    x: 98,
    y: 100,
    opacity: 1,
    outerFill: "#0A0A0A",
    outerStrokeOpacity: 0.75,
    outerStrokeWidth: 3,
    innerFill: "#121212",
    innerStroke: "#FFFFFF",
    innerStrokeOpacity: 0.08,
    innerStrokeWidth: 2,
    ringColor: "#FFFFFF",
    ringOpacity: 0.14,
    ringWidth: 2,
    placeholderText: "Perfil",
    placeholderColor: "#FFFFFF",
    placeholderOpacity: 0.68
  },
  actionIcon: {
    cx: 232,
    cy: 232,
    radius: 30,
    bgColor: "#080808",
    borderWidth: 3,
    color: "#FFFFFF",
    size: 34
  },
  text: {
    primaryColor: "#FFFFFF",
    secondaryColor: "#FFFFFF",
    title: {
      value: "Cargo atualizado",
      color: "#FFFFFF",
      size: 41
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
    },
    oldRole: {
      value: "Cargo antigo"
    },
    newRole: {
      value: "Cargo novo"
    }
  },
  status: {
    value: null,
    x: 340,
    y: 64,
    width: 156,
    height: 34,
    radius: 17,
    bgOpacity: 0.22,
    borderColor: "#FFFFFF",
    borderOpacity: 0.10,
    color: "#FFFFFF",
    size: 13
  },
  oldRoleBlock: {
    x: 340,
    y: 242,
    width: 176,
    height: 46,
    radius: 15,
    bgColor: "#FFFFFF",
    bgOpacity: 0.045,
    borderColor: "#FFFFFF",
    borderOpacity: 0.06,
    label: "ANTES",
    labelX: 360,
    labelY: 261,
    labelOpacity: 0.38
  },
  newRoleBlock: {
    x: 600,
    y: 242,
    width: 176,
    height: 46,
    radius: 15,
    bgOpacity: 0.18,
    borderColor: "#FFFFFF",
    borderOpacity: 0.08,
    label: "AGORA",
    labelX: 620,
    labelY: 261,
    labelOpacity: 0.48
  },
  oldRole: {
    value: "Cargo antigo",
    x: 360,
    y: 280,
    size: 16,
    color: "#FFFFFF",
    opacity: 0.78
  },
  newRole: {
    value: "Cargo novo",
    x: 620,
    y: 280,
    size: 16,
    color: "#FFFFFF",
    opacity: 0.92
  },
  arrow: {
    x1: 538,
    y1: 265,
    x2: 578,
    headX1: 568,
    headY1: 255,
    headX2: 578,
    headY2: 265,
    headX3: 568,
    headY3: 275,
    width: 3,
    color: "url(#actionColor)"
  },
  moderator: {
    value: "Admin",
    color: "#FFFFFF",
    size: 16,
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
    x: 802,
    y: 70,
    width: 82,
    height: 218,
    radius: 24,
    fill: "#070707",
    stroke: "#FFFFFF",
    strokeOpacity: 0.07
  },
  watermark: {
    enabled: true,
    value: null,
    x: 672,
    y: 190,
    color: "#FFFFFF",
    opacity: 0.030,
    size: 92,
    rotate: -9,
    letterSpacing: 5
  },
  progress: {
    x: 340,
    y: 304,
    width: 330,
    fillWidth: 128,
    height: 4,
    radius: 999,
    baseColor: "#FFFFFF",
    baseOpacity: 0.10,
    fillOpacity: 0.98
  },
  shadow: {
    dx: 0,
    dy: 16,
    blur: 20,
    color: "#000000",
    opacity: 0.38
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

function createRankShiftNotice(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createRankShiftNotice
};
