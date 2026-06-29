const merge = require("../utils/merge");

const BASE_TEMPLATE = {
  kind: "rank",
  category: "rank",
  template: "universal_rank_card",
  width: 1000,
  padding: 40,
  title: "Top Rank",
  subtitle: "Lista personalizável",
  type: "MÉTRICA",
  info: "Atualizado: 00/00/0000",
  theme: {
    bgStart: "#050505",
    bgEnd: "#111111",
    cardStart: "#101010",
    cardEnd: "#181818",
    accentStart: "#FFFFFF",
    accentEnd: "#9CA3AF",
    top1Start: "#FACC15",
    top1End: "#A16207",
    top2Start: "#E5E7EB",
    top2End: "#6B7280",
    top3Start: "#FB923C",
    top3End: "#9A3412",
    text: "#FFFFFF",
    muted: "#FFFFFF",
    border: "#FFFFFF",
    rowRadius: 16,
    cardRadius: 30,
    font: "Inter, Roboto, Arial, sans-serif"
  },
  options: {
    compact: false,
    showImages: true,
    showProgress: true,
    showDescription: true,
    showSub: true,
    showValue: true,
    showStats: true,
    showExtraTables: true
  },
  stats: [],
  items: [],
  extraTables: [],
  output: {
    format: "svg",
    returnType: "file"
  }
};

function createUniversalRankCard(config = {}) {
  return merge(BASE_TEMPLATE, config);
}

module.exports = {
  createUniversalRankCard
};
