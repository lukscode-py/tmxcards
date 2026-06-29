const merge = require("../utils/merge");

const DEFAULT_DYNAMIC_CARD = {
  template: "dynamic_custom_card",
  category: "custom",
  kind: "custom",
  width: 900,
  height: 360,
  radius: 34,

  background: {
    startColor: "#050505",
    endColor: "#18181B",
    overlayColor: "#000000",
    overlayOpacity: 0.28,
    opacity: 1,
    pattern: "grid"
  },

  panel: {
    enabled: true,
    x: 28,
    y: 28,
    width: null,
    height: null,
    radius: 28,
    color: "#FFFFFF",
    opacity: 0.08,
    borderColor: "#FFFFFF",
    borderOpacity: 0.14
  },

  theme: {
    accentColor: "#A855F7",
    accentEndColor: "#EC4899",
    primaryColor: "#FFFFFF",
    secondaryColor: "#D4D4D8",
    mutedColor: "#A1A1AA",
    borderColor: "#FFFFFF",
    fontFamily: "Inter, Arial, sans-serif"
  },

  avatar: {
    enabled: true,
    imagePath: null,
    path: null,
    x: 48,
    y: 92,
    size: 116,
    radius: 58,
    placeholderText: "U",
    opacity: 1
  },

  text: {
    title: null,
    subtitle: null,
    name: null,
    group: null,
    main: null,
    footer: null
  },

  badges: [],
  stats: [],
  elements: [],

  progress: {
    enabled: false,
    value: 0,
    max: 100,
    x: 210,
    y: 278,
    width: 560,
    height: 14,
    radius: 999,
    backgroundColor: "#FFFFFF",
    backgroundOpacity: 0.14,
    startColor: null,
    endColor: null,
    label: null
  },

  output: {
    format: "png",
    returnType: "buffer"
  }
};

function createDynamicCard(id, config = {}) {
  const dynamicId = String(id || config.id || config.cardId || "custom/dynamic").trim() || "custom/dynamic";
  const card = merge(DEFAULT_DYNAMIC_CARD, config);

  return merge(card, {
    id: dynamicId,
    cardId: dynamicId,
    customId: dynamicId,
    template: "dynamic_custom_card",
    category: config.category || "custom",
    kind: "custom",
    isDynamic: true
  });
}

module.exports = {
  createDynamicCard
};
