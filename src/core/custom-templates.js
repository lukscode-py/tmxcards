const { imageSource } = require("./image-source");
const { createUniversalRankCardSvg } = require("./custom-universal-rank-card");
const { createDarkMinimalWelcomeSvg, createDarkMinimalFarewellSvg } = require("./custom-dark-minimal-member-card");
const { createDarkMinimalXpRankSvg } = require("./custom-dark-minimal-xp-rank");
const { createOrbitMonoPlayerSvg } = require("./custom-orbit-mono-player");
const { createCrimsonAuthorityBanSvg } = require("./custom-crimson-authority-ban");
const { createRankShiftNoticeSvg } = require("./custom-rank-shift-notice");
const { createMusicMidnightMonoPlayerSvg } = require("./custom-music-midnight-mono-player");
const { createWelcomeMidnightFocusSvg } = require("./custom-welcome-midnight-focus");
const { createDynamicCustomCardSvg } = require("./custom-dynamic-card");

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeXml(value).replaceAll('"', "&quot;");
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function textValue(card, key, fallback) {
  return card.text?.[key]?.value ?? fallback;
}

function progressWidth(card) {
  const raw = Number(card.progress?.value ?? 40);
  const normalized = raw > 1 ? raw / 100 : raw;
  return Math.round(220 * clamp(normalized, 0, 1));
}

function avatarHref(card) {
  if (card.avatar?.enabled === false) return "";
  return imageSource(card.avatar);
}

function avatarImageSvg(card) {
  const href = avatarHref(card);
  if (!href) return "";

  const opacityRaw = Number(card.avatar?.opacity ?? 1);
  const opacity = Math.max(0, Math.min(1, Number.isFinite(opacityRaw) ? opacityRaw : 1));

  return `    <!-- EDITAR FOTO AQUI -->
    <image
      href="${escapeAttr(href)}"
      x="110"
      y="140"
      width="120"
      height="120"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#avatarClip)"
      opacity="${opacity}"
    />`;
}

function avatarPlaceholderSvg(card, color, opacity) {
  const href = avatarHref(card);

  if (href) {
    return `    <circle cx="170" cy="200" r="60" fill="none" stroke="${color}" stroke-opacity="0.10" stroke-width="1.5"/>`;
  }

  return `    <!-- PLACEHOLDER DO PERFIL -->
    <circle cx="170" cy="200" r="60" fill="none" stroke="${color}" stroke-opacity="0.10" stroke-width="1.5"/>
    <text
      x="170"
      y="206"
      text-anchor="middle"
      font-family="Inter, Roboto, Arial, sans-serif"
      font-size="20"
      font-weight="600"
      fill="${color}"
      opacity="${opacity}"
    >Perfil</text>`;
}

function backgroundSvg(card, linePatternStroke) {
  const href = imageSource(card.background);

  if (!href) {
    return `  <!-- EDITAR FUNDO AQUI -->
  <rect width="800" height="400" fill="url(#bgGradient)"/>
  <rect width="800" height="400" fill="url(#linePattern)"/>`;
  }

  return `  <!-- FUNDO PERSONALIZADO -->
  <image
    href="${escapeAttr(href)}"
    x="0"
    y="0"
    width="800"
    height="400"
    preserveAspectRatio="xMidYMid slice"
  />
  <rect width="800" height="400" fill="url(#linePattern)"/>`;
}

function createWelcomePremium01Svg(card = {}) {
  const badge = textValue(card, "badge", "WELCOME CARD");
  const greeting = textValue(card, "greeting", "Bem-vindo(a)!");
  const name = textValue(card, "name", "Nome");
  const group = textValue(card, "group", "Nome do grupo");
  const subtext = textValue(card, "subtext", "sub text");
  const barWidth = progressWidth(card);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="800"
  height="400"
  viewBox="0 0 800 400"
  role="img"
  aria-label="Card dark de boas-vindas"
  style="width:100%;height:auto;display:block;"
  data-template="welcome-premium-01"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bgGradient" x1="0" y1="0" x2="800" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="100%" stop-color="#101010"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="cardGradient" x1="44" y1="44" x2="756" y2="356" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#0B0B0B"/>
    </linearGradient>

    <!-- SOMBRA -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>

    <!-- RECORTE DO AVATAR -->
    <clipPath id="avatarClip">
      <circle cx="170" cy="200" r="60"/>
    </clipPath>

    <!-- PADRÃO SUTIL -->
    <pattern id="linePattern" width="14" height="14" patternUnits="userSpaceOnUse">
      <path d="M0 13.5H14" stroke="#FFFFFF" stroke-opacity="0.025" stroke-width="1"/>
    </pattern>
  </defs>

${backgroundSvg(card)}

  <!-- CARD PRINCIPAL -->
  <rect
    x="44"
    y="44"
    width="712"
    height="312"
    fill="url(#cardGradient)"
    stroke="#FFFFFF"
    stroke-opacity="0.08"
    stroke-width="1.5"
    filter="url(#shadow)"
  />

  <!-- DETALHES DECORATIVOS -->
  <path d="M74 86H152" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2" stroke-linecap="square"/>
  <path d="M74 86V164" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 86H648" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 86V164" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="2" stroke-linecap="square"/>
  <path d="M74 314H152" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2" stroke-linecap="square"/>
  <path d="M74 236V314" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 314H648" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 236V314" fill="none" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="2" stroke-linecap="square"/>

  <!-- AVATAR -->
  <g>
    <circle cx="170" cy="200" r="74" fill="#111111" stroke="#FFFFFF" stroke-opacity="0.10" stroke-width="1.5"/>
    <circle cx="170" cy="200" r="64" fill="#0B0B0B" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1"/>

${avatarImageSvg(card)}

${avatarPlaceholderSvg(card, "#FFFFFF", "0.65")}
  </g>

  <!-- DIVISÓRIA -->
  <rect x="276" y="104" width="1" height="192" fill="#FFFFFF" opacity="0.08"/>

  <!-- TAG SUPERIOR -->
  <g>
    <rect x="304" y="86" width="138" height="32" fill="#181818" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>
    <text x="373" y="106" text-anchor="middle" font-family="Inter, Roboto, Arial, sans-serif" font-size="13" font-weight="700" fill="#FFFFFF" opacity="0.78">${escapeXml(badge)}</text>
  </g>

  <!-- TEXTOS -->
  <g font-family="Inter, Roboto, Arial, sans-serif">
    <text x="304" y="156" font-size="24" font-weight="700" fill="#FFFFFF" opacity="0.94">${escapeXml(greeting)}</text>
    <text x="304" y="208" font-size="42" font-weight="800" fill="#FFFFFF" letter-spacing="-0.8">${escapeXml(name)}</text>
    <text x="304" y="246" font-size="22" font-weight="600" fill="#FFFFFF" opacity="0.72">${escapeXml(group)}</text>
    <text x="304" y="286" font-size="18" font-weight="500" fill="#FFFFFF" opacity="0.48">${escapeXml(subtext)}</text>
  </g>

  <!-- LINHA DE DESTAQUE -->
  <g>
    <rect x="304" y="306" width="220" height="4" fill="#FFFFFF" opacity="0.10"/>
    <rect x="304" y="306" width="${barWidth}" height="4" fill="#FFFFFF" opacity="0.90"/>
  </g>
</svg>`;
}

function createWelcomeLight01Svg(card = {}) {
  const badge = textValue(card, "badge", "WELCOME CARD");
  const greeting = textValue(card, "greeting", "Bem-vindo(a)!");
  const name = textValue(card, "name", "Nome");
  const group = textValue(card, "group", "Nome do grupo");
  const subtext = textValue(card, "subtext", "sub text");
  const barWidth = progressWidth(card);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="800"
  height="400"
  viewBox="0 0 800 400"
  role="img"
  aria-label="Card white de boas-vindas"
  style="width:100%;height:auto;display:block;"
  data-template="welcome-light-01"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bgGradient" x1="0" y1="0" x2="800" y2="400" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#F1F2F4"/>
      <stop offset="100%" stop-color="#E7E9EC"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="cardGradient" x1="44" y1="44" x2="756" y2="356" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F8F8F8"/>
    </linearGradient>

    <!-- SOMBRA -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>
    </filter>

    <!-- RECORTE DO AVATAR -->
    <clipPath id="avatarClip">
      <circle cx="170" cy="200" r="60"/>
    </clipPath>

    <!-- PADRÃO SUTIL -->
    <pattern id="linePattern" width="14" height="14" patternUnits="userSpaceOnUse">
      <path d="M0 13.5H14" stroke="#000000" stroke-opacity="0.024" stroke-width="1"/>
    </pattern>
  </defs>

${backgroundSvg(card)}

  <!-- CARD PRINCIPAL -->
  <rect x="44" y="44" width="712" height="312" fill="url(#cardGradient)" stroke="#D1D5DB" stroke-width="1.5" filter="url(#shadow)"/>

  <!-- DETALHES DECORATIVOS -->
  <path d="M74 86H152" fill="none" stroke="#111111" stroke-opacity="0.18" stroke-width="2" stroke-linecap="square"/>
  <path d="M74 86V164" fill="none" stroke="#111111" stroke-opacity="0.18" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 86H648" fill="none" stroke="#111111" stroke-opacity="0.18" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 86V164" fill="none" stroke="#111111" stroke-opacity="0.18" stroke-width="2" stroke-linecap="square"/>
  <path d="M74 314H152" fill="none" stroke="#111111" stroke-opacity="0.10" stroke-width="2" stroke-linecap="square"/>
  <path d="M74 236V314" fill="none" stroke="#111111" stroke-opacity="0.10" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 314H648" fill="none" stroke="#111111" stroke-opacity="0.10" stroke-width="2" stroke-linecap="square"/>
  <path d="M726 236V314" fill="none" stroke="#111111" stroke-opacity="0.10" stroke-width="2" stroke-linecap="square"/>

  <!-- AVATAR -->
  <g>
    <circle cx="170" cy="200" r="74" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="1.5"/>
    <circle cx="170" cy="200" r="64" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>

${avatarImageSvg(card)}

${avatarPlaceholderSvg(card, "#111111", "0.60")}
  </g>

  <!-- DIVISÓRIA -->
  <rect x="276" y="104" width="1" height="192" fill="#111111" opacity="0.08"/>

  <!-- TAG SUPERIOR -->
  <g>
    <rect x="304" y="86" width="138" height="32" fill="#F9FAFB" stroke="#D1D5DB" stroke-width="1"/>
    <text x="373" y="106" text-anchor="middle" font-family="Inter, Roboto, Arial, sans-serif" font-size="13" font-weight="700" fill="#111111" opacity="0.78">${escapeXml(badge)}</text>
  </g>

  <!-- TEXTOS -->
  <g font-family="Inter, Roboto, Arial, sans-serif">
    <text x="304" y="156" font-size="24" font-weight="700" fill="#111111" opacity="0.94">${escapeXml(greeting)}</text>
    <text x="304" y="208" font-size="42" font-weight="800" fill="#111111" letter-spacing="-0.8">${escapeXml(name)}</text>
    <text x="304" y="246" font-size="22" font-weight="600" fill="#111111" opacity="0.72">${escapeXml(group)}</text>
    <text x="304" y="286" font-size="18" font-weight="500" fill="#111111" opacity="0.48">${escapeXml(subtext)}</text>
  </g>

  <!-- LINHA DE DESTAQUE -->
  <g>
    <rect x="304" y="306" width="220" height="4" fill="#111111" opacity="0.10"/>
    <rect x="304" y="306" width="${barWidth}" height="4" fill="#111111" opacity="0.92"/>
  </g>
</svg>`;
}

function createCustomSvg(card = {}) {
  if (card.template === "welcome-premium-01") return createWelcomePremium01Svg(card);
  if (card.template === "welcome-light-01") return createWelcomeLight01Svg(card);
  if (card.template === "welcome-midnight-focus") return createWelcomeMidnightFocusSvg(card);
  if (card.template === "music-midnight-mono-player") return createMusicMidnightMonoPlayerSvg(card);
  if (card.template === "orbit_mono_player") return createOrbitMonoPlayerSvg(card);
  if (card.template === "crimson_authority_ban") return createCrimsonAuthorityBanSvg(card);
  if (card.template === "rank_shift_notice") return createRankShiftNoticeSvg(card);
  if (card.template === "universal_rank_card") return createUniversalRankCardSvg(card);
  if (card.template === "dark_minimal_welcome") return createDarkMinimalWelcomeSvg(card);
  if (card.template === "dark_minimal_farewell") return createDarkMinimalFarewellSvg(card);
  if (card.template === "dark_minimal_xp_rank") return createDarkMinimalXpRankSvg(card);
  if (card.template === "dynamic_custom_card") return createDynamicCustomCardSvg(card);
  return null;
}

module.exports = {
  createCustomSvg
};
