const fs = require("node:fs");
const path = require("node:path");

function exists(filePath) {
  return typeof filePath === "string" && filePath.length > 0 && fs.existsSync(filePath);
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeXml(value).replaceAll('"', "&quot;");
}

function mimeFromPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";

  return "application/octet-stream";
}

function fileToDataUri(filePath) {
  const buffer = fs.readFileSync(filePath);
  return `data:${mimeFromPath(filePath)};base64,${buffer.toString("base64")}`;
}

function textValue(card, key, fallback) {
  return card.text?.[key]?.value ?? fallback;
}

function textColor(card, key, fallback) {
  return card.text?.[key]?.color ?? fallback;
}

function attrText(value) {
  return escapeAttr(value);
}

function createBackground(card, width, height) {
  const background = card.background || {};

  if (exists(background.imagePath)) {
    return `
  <image
    href="${attrText(fileToDataUri(background.imagePath))}"
    x="0"
    y="0"
    width="${width}"
    height="${height}"
    preserveAspectRatio="xMidYMid slice"
  />
  <rect x="0" y="0" width="${width}" height="${height}" fill="#020617" opacity="0.72"/>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#premiumDepth)" opacity="0.75"/>`;
  }

  return `<rect x="0" y="0" width="${width}" height="${height}" fill="url(#premiumBg)"/>`;
}

function createAvatar(card) {
  if (!exists(card.avatar?.path)) {
    return `
    <circle cx="174" cy="322" r="82" fill="#1f2937"/>
    <circle cx="174" cy="302" r="30" fill="#b8c0cc"/>
    <path d="M122 382 c12 -42 92 -42 104 0 Z" fill="#b8c0cc"/>`;
  }

  return `
    <image
      href="${attrText(fileToDataUri(card.avatar.path))}"
      x="92"
      y="240"
      width="164"
      height="164"
      preserveAspectRatio="none"
    />`;
}

function createLogo(card) {
  if (exists(card.logo?.path)) {
    return `
  <image
    href="${attrText(fileToDataUri(card.logo.path))}"
    x="80"
    y="56"
    width="108"
    height="72"
    preserveAspectRatio="xMidYMid meet"
  />`;
  }

  return `
  <g filter="url(#textShadow)">
    <text x="82" y="82" font-size="18" font-weight="900" fill="#ffffff" letter-spacing="2">TMX</text>
    <text x="82" y="105" font-size="13" font-weight="700" fill="#94a3b8" letter-spacing="1.5">CARDS</text>
  </g>`;
}

function createWelcomePremium01Svg(card = {}) {
  const width = Number(card.width) || 1280;
  const height = Number(card.height) || 720;
  const title = textValue(card, "title", "Bem-vindo, Kanna");
  const subtitle = textValue(card, "subtitle", "Você agora faz parte de TESTE KANNA ✨");
  const pill = textValue(card, "pill", "BEM-VINDO");
  const badgeLeft = textValue(card, "badgeLeft", "TESTE KANNA ✨");
  const badgeRight = textValue(card, "badgeRight", "Membro #8");
  const message = textValue(card, "message", "Seja bem vindo Kanna");
  const footer = textValue(card, "footer", "Kanna Bot • 28/06/2026");

  const titleColor = textColor(card, "title", "#f8fafc");
  const subtitleColor = textColor(card, "subtitle", "#cbd5e1");
  const messageColor = textColor(card, "message", "#e5e7eb");
  const mutedColor = textColor(card, "footer", "#94a3b8");

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 1280 720"
  role="img"
  aria-label="Card premium de boas-vindas"
  data-renderer="welcome-premium-01"
  data-theme="${attrText(card.theme || "premium-hero-dark")}"
>
  <defs>
    <linearGradient id="premiumBg" x1="0" y1="0" x2="1280" y2="720" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#05070d"/>
      <stop offset="48%" stop-color="#0b1020"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>

    <radialGradient id="premiumGlowBlue" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(880 120) rotate(90) scale(360 420)">
      <stop offset="0%" stop-color="#273bff" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#273bff" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="premiumGlowGreen" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(310 710) rotate(90) scale(280 360)">
      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#16a34a" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="premiumDepth" x1="0" y1="0" x2="1280" y2="720" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.92"/>
      <stop offset="50%" stop-color="#020617" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0.82"/>
    </linearGradient>

    <linearGradient id="avatarRing" x1="80" y1="220" x2="270" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="52%" stop-color="#1f2937"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <linearGradient id="lineAccent" x1="300" y1="424" x2="720" y2="424" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="40%" stop-color="#6366f1" stop-opacity="0.48"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </linearGradient>

    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000000" flood-opacity="0.42"/>
    </filter>

    <filter id="avatarShadow" x="-35%" y="-35%" width="170%" height="170%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.48"/>
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#6366f1" flood-opacity="0.22"/>
    </filter>

    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000000" flood-opacity="0.55"/>
    </filter>

    <pattern id="premiumDots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.15" fill="#ffffff" opacity="0.07"/>
    </pattern>
  </defs>

  ${createBackground(card, 1280, 720)}
  <rect x="0" y="0" width="1280" height="720" fill="url(#premiumDots)" opacity="0.35"/>
  <rect x="0" y="0" width="1280" height="720" fill="url(#premiumGlowBlue)"/>
  <rect x="0" y="0" width="1280" height="720" fill="url(#premiumGlowGreen)"/>

  <g opacity="0.95">
    <circle cx="1120" cy="92" r="150" fill="#4f46e5" opacity="0.10"/>
    <circle cx="1090" cy="632" r="130" fill="#22d3ee" opacity="0.06"/>
    <circle cx="220" cy="650" r="180" fill="#16a34a" opacity="0.08"/>
    <rect x="994" y="140" width="74" height="74" rx="20" fill="#ffffff" opacity="0.045" transform="rotate(14 1031 177)"/>
    <rect x="108" y="100" width="54" height="54" rx="16" fill="#ffffff" opacity="0.05" transform="rotate(-18 135 127)"/>
    <path d="M1015 220 l36 -22 l36 22 v42 l-36 22 l-36 -22 Z" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.08"/>
    <path d="M1085 468 c28 -42 80 -42 108 0 c-28 42 -80 42 -108 0Z" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.10"/>
    <circle cx="1139" cy="468" r="12" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.12"/>
  </g>

  <rect x="48" y="40" width="1184" height="640" rx="38" fill="#ffffff" opacity="0.025" filter="url(#cardShadow)"/>
  <rect x="49" y="41" width="1182" height="638" rx="38" fill="none" stroke="#ffffff" stroke-opacity="0.06"/>

  ${createLogo(card)}

  <g>
    <rect x="80" y="138" width="200" height="46" rx="23" fill="#ffffff" opacity="0.055" stroke="#ffffff" stroke-opacity="0.08"/>
    <text x="98" y="168" font-family="Inter, Roboto, Arial, sans-serif" font-size="23" font-weight="900" fill="#e5e7eb" letter-spacing="6">${escapeXml(pill)}</text>
  </g>

  <g filter="url(#avatarShadow)">
    <circle cx="174" cy="322" r="102" fill="#020617" opacity="0.92"/>
    <circle cx="174" cy="322" r="96" fill="url(#avatarRing)" opacity="0.90"/>
    <circle cx="174" cy="322" r="84" fill="#111827"/>
    ${createAvatar(card)}
    <circle cx="174" cy="322" r="84" fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="2"/>
  </g>

  <g font-family="Inter, Roboto, Arial, sans-serif" filter="url(#textShadow)">
    <text x="308" y="282" font-size="72" font-weight="900" fill="${attrText(titleColor)}" letter-spacing="-1.6">${escapeXml(title)}</text>
    <text x="310" y="344" font-size="32" font-weight="500" fill="${attrText(subtitleColor)}" letter-spacing="3">${escapeXml(subtitle)}</text>
  </g>

  <g font-family="Inter, Roboto, Arial, sans-serif">
    <rect x="304" y="382" width="226" height="50" rx="25" fill="#ffffff" opacity="0.055" stroke="#ffffff" stroke-opacity="0.08"/>
    <text x="326" y="414" font-size="22" font-weight="800" fill="#e5e7eb" letter-spacing="1">${escapeXml(badgeLeft)}</text>

    <rect x="542" y="382" width="180" height="50" rx="25" fill="#ffffff" opacity="0.055" stroke="#ffffff" stroke-opacity="0.08"/>
    <text x="564" y="414" font-size="22" font-weight="800" fill="#e5e7eb" letter-spacing="0.5">${escapeXml(badgeRight)}</text>
  </g>

  <rect x="304" y="458" width="420" height="4" rx="2" fill="url(#lineAccent)" opacity="0.85"/>

  <g font-family="Inter, Roboto, Arial, sans-serif">
    <text x="80" y="512" font-size="34" font-weight="500" fill="${attrText(messageColor)}" letter-spacing="1.2">${escapeXml(message)}</text>
    <text x="80" y="578" font-size="22" font-weight="800" fill="${attrText(mutedColor)}" letter-spacing="1.4">${escapeXml(footer)}</text>
  </g>
</svg>`;
}

function createPremiumSvg(card = {}) {
  if (card.renderer === "welcome-premium-01") {
    return createWelcomePremium01Svg(card);
  }

  return null;
}

module.exports = {
  createPremiumSvg
};
