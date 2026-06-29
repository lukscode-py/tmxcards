const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "music",
  template: "orbit_mono_player",
  width: 960,
  height: 340,
  background: {
    imagePath: null,
    startColor: "#050505",
    endColor: "#121212",
    overlayColor: "#000000",
    overlayOpacity: 0
  },
  card: {
    x: 48,
    y: 30,
    width: 864,
    height: 280,
    radius: 30,
    startColor: "#0E0E0E",
    endColor: "#181818",
    borderColor: "#FFFFFF",
    borderOpacity: 0.06,
    borderWidth: 1.5,
    outlineColor: "#FFFFFF",
    outlineOpacity: 0.03,
    outlineWidth: 1
  },
  cover: {
    enabled: true,
    path: null,
    opacity: 1,
    cx: 190,
    cy: 170,
    radius: 84,
    size: 168,
    outerRadius: 98,
    decorRadius: 108,
    backgroundRadius: 88,
    backgroundColor: "#0A0A0A",
    borderColor: "#FFFFFF",
    borderOpacity: 0.08,
    borderWidth: 2,
    innerBorderColor: "#FFFFFF",
    innerBorderOpacity: 0.12,
    innerBorderWidth: 2,
    outerRingColor: "#FFFFFF",
    outerRingOpacity: 0.10,
    outerRingWidth: 2,
    decorColor: "#FFFFFF",
    decorOpacity: 0.18,
    decorBackOpacity: 0.08,
    decorWidth: 5,
    centerDotRadius: 10,
    centerDotColor: "#FFFFFF",
    centerDotOpacity: 0.90,
    centerDotInnerRadius: 4,
    centerDotInnerColor: "#111111",
    placeholderText: "Capa",
    placeholderColor: "#FFFFFF",
    placeholderOpacity: 0.58,
    placeholderSize: 22
  },
  textColors: {
    primary: "#FFFFFF",
    secondary: "#FFFFFF"
  },
  text: {
    tag: {
      value: "MUSIC CARD"
    },
    title: {
      value: "Nome da música"
    },
    subtitle: {
      value: "artista ou sub text",
      opacity: 0.42
    },
    timeStart: {
      value: "0:00"
    },
    timeEnd: {
      value: "~:~"
    },
    bottomText: {
      value: "MIDNIGHT SESSION"
    }
  },
  tag: {
    text: "MUSIC CARD",
    x: 338,
    y: 66,
    width: 112,
    height: 30,
    radius: 15,
    textX: 394,
    textY: 85,
    bgColor: "#FFFFFF",
    bgOpacity: 0.06,
    borderColor: "#FFFFFF",
    borderOpacity: 0.06,
    color: "#FFFFFF",
    opacity: 0.78,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2
  },
  progress: {
    x: 338,
    y: 224,
    width: 500,
    height: 8,
    radius: 999,
    value: 38.8,
    fillWidth: null,
    indicatorX: null,
    indicatorY: 4,
    indicatorRadius: 8,
    startColor: "#FFFFFF",
    endColor: "#A3A3A3",
    trackColor: "#FFFFFF",
    trackOpacity: 0.10,
    opacity: 0.98,
    indicatorColor: "#FFFFFF"
  },
  bottomBlock: {
    enabled: true,
    text: "MIDNIGHT SESSION",
    x: 338,
    y: 274,
    width: 180,
    height: 28,
    radius: 14,
    textX: 428,
    textY: 292,
    bgColor: "#FFFFFF",
    bgOpacity: 0.04,
    borderColor: "#FFFFFF",
    borderOpacity: 0.04,
    color: "#FFFFFF",
    opacity: 0.60,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1
  },
  shadow: {
    dx: 0,
    dy: 14,
    blur: 18,
    color: "#000000",
    opacity: 0.34
  },
  fonts: {
    base: "Inter, Roboto, Arial, sans-serif"
  },
  output: {
    format: "svg",
    returnType: "file"
  }
};

function createOrbitMonoPlayer(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createOrbitMonoPlayer
};
