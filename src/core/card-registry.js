const { createWelcomePremium01 } = require("../templates/welcome-premium-01");
const { createWelcomeLight01 } = require("../templates/welcome-light-01");
const { createWelcomeMidnightFocus } = require("../templates/welcome-midnight-focus");

const { createGoodbyePremium01 } = require("../templates/goodbye-premium-01");
const { createGoodbyeLight01 } = require("../templates/goodbye-light-01");
const { createGoodbyeMidnightFocus } = require("../templates/goodbye-midnight-focus");

const { createDarkMinimalWelcome } = require("../templates/dark-minimal-welcome");
const { createDarkMinimalFarewell } = require("../templates/dark-minimal-farewell");

const { createDarkMinimalXpRank } = require("../templates/dark-minimal-xp-rank");
const { createUniversalRankCard } = require("../templates/universal-rank-card");

const { createMusicMidnightMonoPlayer } = require("../templates/music-midnight-mono-player");
const { createOrbitMonoPlayer } = require("../templates/orbit-mono-player");

const { createCrimsonAuthorityBan } = require("../templates/crimson-authority-ban");
const { createRankShiftNotice } = require("../templates/rank-shift-notice");

const CARD_REGISTRY = [
  {
    id: "welcome/dark",
    name: "Dark Welcome",
    category: "welcome",
    template: "dark_minimal_welcome",
    factory: createDarkMinimalWelcome,
    adapter: "dark-member",
    required: ["name"],
    aliases: ["dark_minimal_welcome", "dark-welcome", "welcome-dark"]
  },
  {
    id: "welcome/premium",
    name: "Premium Welcome",
    category: "welcome",
    template: "welcome-premium-01",
    factory: createWelcomePremium01,
    adapter: "classic-welcome",
    required: ["name"],
    aliases: ["welcome-premium-01", "premium-welcome", "welcome-premium"]
  },
  {
    id: "welcome/light",
    name: "Light Welcome",
    category: "welcome",
    template: "welcome-light-01",
    factory: createWelcomeLight01,
    adapter: "classic-welcome",
    required: ["name"],
    aliases: ["welcome-light-01", "light-welcome", "welcome-light"]
  },
  {
    id: "welcome/midnight",
    name: "Midnight Welcome",
    category: "welcome",
    template: "welcome-midnight-focus",
    factory: createWelcomeMidnightFocus,
    adapter: "midnight-member",
    required: ["name"],
    aliases: ["welcome-midnight-focus", "midnight-welcome", "welcome-midnight"]
  },

  {
    id: "goodbye/dark",
    name: "Dark Goodbye",
    category: "goodbye",
    template: "dark_minimal_farewell",
    factory: createDarkMinimalFarewell,
    adapter: "dark-member",
    required: ["name"],
    aliases: ["dark_minimal_farewell", "dark-goodbye", "goodbye-dark", "farewell/dark"]
  },
  {
    id: "goodbye/premium",
    name: "Premium Goodbye",
    category: "goodbye",
    template: "welcome-premium-01",
    factory: createGoodbyePremium01,
    adapter: "classic-welcome",
    required: ["name"],
    aliases: ["goodbye-premium-01", "premium-goodbye", "goodbye-premium"]
  },
  {
    id: "goodbye/light",
    name: "Light Goodbye",
    category: "goodbye",
    template: "welcome-light-01",
    factory: createGoodbyeLight01,
    adapter: "classic-welcome",
    required: ["name"],
    aliases: ["goodbye-light-01", "light-goodbye", "goodbye-light"]
  },
  {
    id: "goodbye/midnight",
    name: "Midnight Goodbye",
    category: "goodbye",
    template: "welcome-midnight-focus",
    factory: createGoodbyeMidnightFocus,
    adapter: "midnight-member",
    required: ["name"],
    aliases: ["goodbye-midnight-focus", "midnight-goodbye", "goodbye-midnight"]
  },

  {
    id: "rank/personal",
    name: "Personal Rank",
    category: "rank",
    template: "dark_minimal_xp_rank",
    factory: createDarkMinimalXpRank,
    adapter: "xp-rank",
    required: ["name"],
    aliases: ["dark_minimal_xp_rank", "personal-rank", "rank-xp", "xp-rank"]
  },
  {
    id: "rank/list",
    name: "Rank List",
    category: "rank",
    template: "universal_rank_card",
    factory: createUniversalRankCard,
    adapter: "rank-list",
    required: ["items"],
    aliases: ["universal_rank_card", "rank-list", "leaderboard"]
  },

  {
    id: "music/player",
    name: "Music Player",
    category: "music",
    template: "music-midnight-mono-player",
    factory: createMusicMidnightMonoPlayer,
    adapter: "music",
    required: ["title"],
    aliases: ["music-midnight-mono-player", "music-player", "player/music"]
  },
  {
    id: "music/orbit",
    name: "Orbit Music",
    category: "music",
    template: "orbit_mono_player",
    factory: createOrbitMonoPlayer,
    adapter: "music",
    required: ["title"],
    aliases: ["orbit_mono_player", "orbit-music", "music-orbit"]
  },

  {
    id: "moderation/ban",
    name: "Ban Notice",
    category: "moderation",
    template: "crimson_authority_ban",
    factory: createCrimsonAuthorityBan,
    adapter: "moderation",
    required: ["name"],
    aliases: ["crimson_authority_ban", "ban-notice", "ban"]
  },
  {
    id: "moderation/rank-change",
    name: "Rank Change Notice",
    category: "moderation",
    template: "rank_shift_notice",
    factory: createRankShiftNotice,
    adapter: "moderation",
    required: ["name"],
    aliases: ["rank_shift_notice", "rank-change", "role-change", "promotion"]
  }
];

module.exports = {
  CARD_REGISTRY
};
