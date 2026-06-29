const { imageSource } = require("./image-source");

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return escapeXml(value).replaceAll('"', "&quot;");
}

function textValue(card, key, fallback) {
  return card.text?.[key]?.value ?? fallback;
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function backgroundSvg(card) {
  const href = imageSource(card.background);

  if (!href) {
    return `  <!-- FUNDO PRINCIPAL -->
  <rect width="1024" height="420" fill="url(#bgGradient)"/>`;
  }

  const overlayOpacity = Math.max(0, Math.min(1, numberValue(card.background?.overlayOpacity, 0)));

  return `  <!-- FUNDO PRINCIPAL -->
  <image
    href="${escapeAttr(href)}"
    x="0"
    y="0"
    width="1024"
    height="420"
    preserveAspectRatio="xMidYMid slice"
  />${overlayOpacity > 0 ? `
  <rect width="1024" height="420" fill="#000000" opacity="${overlayOpacity}"/>` : ""}`;
}

function avatarImageSvg(card) {
  const href = imageSource(card.avatar);

  if (card.avatar?.enabled === false || !href) {
    return `    <!-- PLACEHOLDER DO PERFIL -->
    <circle cx="512" cy="145" r="92" fill="#18181B" clip-path="url(#avatarClip)"/>
    <text
      x="512"
      y="154"
      text-anchor="middle"
      font-family="Inter, Roboto, Arial, sans-serif"
      font-size="24"
      font-weight="700"
      fill="#FFFFFF"
      opacity="0.72"
    >Perfil</text>`;
  }

  const opacity = Math.max(0, Math.min(1, numberValue(card.avatar?.opacity, 1)));

  return `    <!-- EDITAR FOTO DE PERFIL AQUI -->
    <image
      id="profileImage"
      href="${escapeAttr(href)}"
      x="420"
      y="53"
      width="184"
      height="184"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#avatarClip)"
      opacity="${opacity}"
    />`;
}

function createWelcomeMidnightFocusSvg(card = {}) {
  const title = textValue(card, "title", "BEM-VINDO(A)");
  const name = textValue(card, "name", "Nome");
  const group = textValue(card, "group", "Nome do grupo");

  const avatarBorderStart = card.avatar?.borderStartColor
    || card.avatar?.border?.startColor
    || card.avatar?.borderColor
    || "#FFFFFF";

  const avatarBorderEnd = card.avatar?.borderEndColor
    || card.avatar?.border?.endColor
    || card.avatar?.borderColor
    || "#A1A1AA";

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1024"
  height="420"
  viewBox="0 0 1024 420"
  role="img"
  aria-label="Card SVG de boas-vindas"
  style="width:100%;height:auto;display:block;"
  data-template="welcome-midnight-focus"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bgGradient" x1="0" y1="0" x2="1024" y2="420" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#05070D"/>
      <stop offset="55%" stop-color="#0B0F1A"/>
      <stop offset="100%" stop-color="#020306"/>
    </linearGradient>

    <!-- EDITAR COR DA FOTO/BORDA AQUI -->
    <linearGradient id="avatarBorder" x1="390" y1="40" x2="634" y2="284" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(avatarBorderStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(avatarBorderEnd)}"/>
    </linearGradient>

    <!-- RECORTE DA FOTO DE PERFIL -->
    <clipPath id="avatarClip">
      <circle cx="512" cy="145" r="92"/>
    </clipPath>

    <!-- SOMBRA SUAVE -->
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.45"/>
    </filter>

    <!-- BRILHO DO TEXTO -->
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.65"/>
    </filter>
  </defs>

${backgroundSvg(card)}

  <!-- DETALHES DO FUNDO, PODE REMOVER SE QUISER FUNDO LISO -->
  <g opacity="0.22" fill="none" stroke="#FFFFFF" stroke-width="1.2">
    <path d="M40 40 L86 92 L70 118 L124 172 L102 210" opacity="0.18"/>
    <path d="M190 0 L225 76 L208 110 L252 174 L235 238" opacity="0.14"/>
    <path d="M390 0 L430 82 L412 128 L462 212 L438 292" opacity="0.13"/>
    <path d="M610 0 L575 74 L594 118 L548 198 L566 276" opacity="0.13"/>
    <path d="M788 10 L744 86 L766 132 L710 224 L736 330" opacity="0.15"/>
    <path d="M936 0 L898 76 L918 124 L862 212 L884 300" opacity="0.14"/>
  </g>

  <!-- ESCURECIMENTO INFERIOR -->
  <linearGradient id="bottomFade" x1="0" y1="210" x2="0" y2="420" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.70"/>
  </linearGradient>
  <rect width="1024" height="420" fill="url(#bottomFade)"/>

  <!-- FOTO DE PERFIL CENTRAL -->
  <g filter="url(#softShadow)">
    <circle cx="512" cy="145" r="104" fill="url(#avatarBorder)" opacity="0.95"/>
    <circle cx="512" cy="145" r="96" fill="#111111"/>

${avatarImageSvg(card)}

    <!-- BORDA DA FOTO -->
    <circle cx="512" cy="145" r="92" fill="none" stroke="#FFFFFF" stroke-opacity="0.20" stroke-width="2"/>
  </g>

  <!-- TEXTOS CENTRALIZADOS -->
  <g
    font-family="Impact, Haettenschweiler, 'Arial Narrow Bold', Arial, sans-serif"
    text-anchor="middle"
    filter="url(#textShadow)"
  >
    <!-- EDITAR BEM-VINDO AQUI -->
    <text
      id="welcomeText"
      x="512"
      y="300"
      font-size="42"
      font-weight="900"
      fill="#FFFFFF"
      letter-spacing="2"
    >${escapeXml(title)}</text>

    <!-- EDITAR NOME AQUI -->
    <text
      id="userName"
      x="512"
      y="344"
      font-family="Inter, Roboto, Arial, sans-serif"
      font-size="30"
      font-weight="500"
      fill="#FFFFFF"
      letter-spacing="0.5"
    >${escapeXml(name)}</text>

    <!-- EDITAR NOME DO GRUPO AQUI -->
    <text
      id="groupName"
      x="512"
      y="378"
      font-family="Inter, Roboto, Arial, sans-serif"
      font-size="20"
      font-weight="500"
      fill="#FFFFFF"
      opacity="0.72"
    >${escapeXml(group)}</text>
  </g>
</svg>`;
}

module.exports = {
  createWelcomeMidnightFocusSvg
};
