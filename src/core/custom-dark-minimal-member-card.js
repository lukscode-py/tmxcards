const { imageHref } = require("./image-source");

function escapeXml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeAttr(value = "") {
  return escapeXml(value);
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function textValue(card, key, fallback) {
  const value = card.text?.[key];
  if (value && typeof value === "object" && "value" in value) return value.value;
  return value ?? fallback;
}

function renderStatusIcon(card, mode, accentStroke) {
  const icon = card.icon || {};
  const cx = numberValue(icon.cx, 149);
  const cy = numberValue(icon.cy, 39);
  const radius = numberValue(icon.radius, 10);
  const bg = icon.bg || icon.bgColor || "url(#accent)";
  const opacity = clamp(numberValue(icon.opacity, 0.95), 0, 1);
  const stroke = icon.stroke || accentStroke || "#111111";
  const strokeWidth = numberValue(icon.strokeWidth, 2);
  const type = icon.type || (mode === "farewell" ? "x" : "plus");

  let inner = "";

  if (icon.customPath) {
    inner = `<path d="${escapeAttr(icon.customPath)}" stroke="${escapeAttr(stroke)}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`;
  } else if (icon.text) {
    inner = `<text
        x="${cx}"
        y="${cy + numberValue(icon.textYOffset, 5)}"
        text-anchor="middle"
        font-size="${numberValue(icon.textSize, 14)}"
        font-weight="900"
        fill="${escapeAttr(stroke)}"
      >${escapeXml(icon.text)}</text>`;
  } else if (type === "x" || type === "close" || type === "farewell") {
    inner = `<path
        d="M${cx - 4} ${cy - 4} L${cx + 4} ${cy + 4} M${cx + 4} ${cy - 4} L${cx - 4} ${cy + 4}"
        stroke="${escapeAttr(stroke)}"
        stroke-width="${strokeWidth}"
        stroke-linecap="round"
      />`;
  } else {
    inner = `<path
        d="M${cx} ${cy - 4} V${cy + 4} M${cx - 4} ${cy} H${cx + 4}"
        stroke="${escapeAttr(stroke)}"
        stroke-width="${strokeWidth}"
        stroke-linecap="round"
      />`;
  }

  return `    <!-- ÍCONE -->
    <g id="statusIcon">
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${escapeAttr(bg)}" opacity="${opacity}"/>
      ${inner}
    </g>`;
}

function renderBackgroundImage(card, width, height) {
  const href = imageHref(card.background || {});
  if (!href) return "";

  const bg = card.background || {};
  return `    <!-- IMAGEM DE FUNDO OPCIONAL -->
    <image
      id="backgroundImage"
      href="${escapeAttr(href)}"
      x="${numberValue(bg.x, -8)}"
      y="${numberValue(bg.y, -8)}"
      width="${numberValue(bg.width, width + 16)}"
      height="${numberValue(bg.height, height + 16)}"
      preserveAspectRatio="${escapeAttr(bg.preserveAspectRatio || "xMidYMid slice")}"
      opacity="${clamp(numberValue(bg.opacity, 0.42), 0, 1)}"
      filter="${bg.blur === false ? "" : "url(#bgBlur)"}"
    />`;
}

function renderAvatar(card) {
  const avatar = card.avatar || {};
  const href = imageHref(avatar);

  const cx = numberValue(avatar.cx, 67);
  const cy = numberValue(avatar.cy, 60);
  const radius = numberValue(avatar.radius, 38);
  const outerRadius = numberValue(avatar.outerRadius, 41);
  const size = numberValue(avatar.size, 76);
  const x = numberValue(avatar.x, cx - size / 2);
  const y = numberValue(avatar.y, cy - size / 2);

  const placeholder = avatar.placeholderText || "Perfil";
  const placeholderColor = avatar.placeholderColor || "#FFFFFF";
  const placeholderOpacity = clamp(numberValue(avatar.placeholderOpacity, 0.62), 0, 1);

  return `  <!-- AVATAR -->
  <g id="avatarGroup">
    <circle
      cx="${cx}"
      cy="${cy}"
      r="${outerRadius}"
      fill="${escapeAttr(avatar.outerFill || "#0B0B0B")}"
      stroke="${escapeAttr(avatar.outerStroke || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(avatar.outerStrokeOpacity, 0.14), 0, 1)}"
      stroke-width="${numberValue(avatar.outerStrokeWidth, 1.4)}"
    />

    ${
      href
        ? `<!-- EDITAR FOTO DE PERFIL AQUI -->
    <image
      id="avatarImage"
      href="${escapeAttr(href)}"
      x="${x}"
      y="${y}"
      width="${size}"
      height="${size}"
      preserveAspectRatio="${escapeAttr(avatar.preserveAspectRatio || "xMidYMid slice")}"
      clip-path="url(#avatarClip)"
      opacity="${clamp(numberValue(avatar.opacity, 1), 0, 1)}"
    />`
        : `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${escapeAttr(avatar.fallbackFill || "#151515")}"/>
    <text
      x="${cx}"
      y="${cy + 6}"
      text-anchor="middle"
      font-family="${escapeAttr(avatar.fontFamily || "Inter, Roboto, Arial, sans-serif")}"
      font-size="${numberValue(avatar.placeholderSize, 14)}"
      font-weight="800"
      fill="${escapeAttr(placeholderColor)}"
      opacity="${placeholderOpacity}"
    >${escapeXml(placeholder)}</text>`
    }

    <circle
      cx="${cx}"
      cy="${cy}"
      r="${radius}"
      fill="none"
      stroke="${escapeAttr(avatar.innerStroke || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(avatar.innerStrokeOpacity, 0.08), 0, 1)}"
      stroke-width="${numberValue(avatar.innerStrokeWidth, 1.4)}"
    />
  </g>`;
}

function renderSquares(card) {
  const squares = card.squares || {};
  const mainOpacity = clamp(numberValue(squares.mainOpacity, 0.12), 0, 1);
  const secondaryOpacity = clamp(numberValue(squares.secondaryOpacity, 0.06), 0, 1);
  const stroke = squares.stroke || "#FFFFFF";
  const enabled = squares.enabled !== false;

  if (!enabled) return "";

  return `    <!-- QUADRADOS PEQUENOS DE FUNDO -->
    <g
      id="backgroundSquaresMain"
      fill="none"
      stroke="${escapeAttr(stroke)}"
      stroke-width="${numberValue(squares.mainStrokeWidth, 0.8)}"
      stroke-opacity="${mainOpacity}"
      shape-rendering="geometricPrecision"
    >
      <rect x="294" y="14" width="14" height="14" rx="1"/>
      <rect x="318" y="24" width="14" height="14" rx="1"/>
      <rect x="342" y="14" width="14" height="14" rx="1"/>
      <rect x="366" y="24" width="14" height="14" rx="1"/>
      <rect x="390" y="14" width="14" height="14" rx="1"/>
      <rect x="414" y="24" width="14" height="14" rx="1"/>

      <rect x="306" y="42" width="14" height="14" rx="1"/>
      <rect x="330" y="52" width="14" height="14" rx="1"/>
      <rect x="354" y="42" width="14" height="14" rx="1"/>
      <rect x="378" y="52" width="14" height="14" rx="1"/>
      <rect x="402" y="42" width="14" height="14" rx="1"/>
      <rect x="426" y="52" width="14" height="14" rx="1"/>

      <rect x="294" y="72" width="14" height="14" rx="1"/>
      <rect x="318" y="82" width="14" height="14" rx="1"/>
      <rect x="342" y="72" width="14" height="14" rx="1"/>
      <rect x="366" y="82" width="14" height="14" rx="1"/>
      <rect x="390" y="72" width="14" height="14" rx="1"/>
      <rect x="414" y="82" width="14" height="14" rx="1"/>
    </g>

    <g
      id="backgroundSquaresSecondary"
      fill="none"
      stroke="${escapeAttr(stroke)}"
      stroke-width="${numberValue(squares.secondaryStrokeWidth, 0.7)}"
      stroke-opacity="${secondaryOpacity}"
      shape-rendering="geometricPrecision"
    >
      <rect x="242" y="18" width="10" height="10" rx="1"/>
      <rect x="258" y="34" width="10" height="10" rx="1"/>
      <rect x="236" y="88" width="10" height="10" rx="1"/>
      <rect x="256" y="74" width="10" height="10" rx="1"/>

      <rect x="438" y="12" width="10" height="10" rx="1"/>
      <rect x="448" y="32" width="10" height="10" rx="1"/>
      <rect x="438" y="88" width="10" height="10" rx="1"/>
      <rect x="448" y="68" width="10" height="10" rx="1"/>
    </g>`;
}

function createDarkMinimalMemberCardSvg(card = {}, mode = "welcome") {
  const width = numberValue(card.width, 470);
  const height = numberValue(card.height, 120);
  const radius = numberValue(card.radius, 0);

  const bg = card.background || {};
  const overlay = card.overlay || {};
  const border = card.border || {};
  const shadow = card.shadow || {};
  const glass = card.glass || {};
  const accent = card.accent || {};
  const text = card.text || {};

  const fallbackStart = bg.startColor || bg.fallbackStart || "#070707";
  const fallbackEnd = bg.endColor || bg.fallbackEnd || "#141414";
  const overlayStartOpacity = clamp(numberValue(overlay.startOpacity, mode === "farewell" ? 0.38 : 0.34), 0, 1);
  const overlayEndOpacity = clamp(numberValue(overlay.endOpacity, mode === "farewell" ? 0.64 : 0.62), 0, 1);
  const accentStart = accent.startColor || "#FFFFFF";
  const accentEnd = accent.endColor || (mode === "farewell" ? "#CFCFCF" : "#D4D4D4");

  const userName = textValue(card, "name", "Nome");
  const mainText = textValue(card, "main", mode === "farewell" ? "Saiu do grupo" : "Entrou no grupo");
  const groupName = textValue(card, "group", "Nome do grupo");

  const baseFont = card.fonts?.base || text.fontFamily || "Inter, Roboto, Arial, sans-serif";
  const templateId = mode === "farewell" ? "dark_minimal_farewell" : "dark_minimal_welcome";
  const aria = mode === "farewell" ? "Card de adeus" : "Card de bem-vindo";

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  role="img"
  aria-label="${aria}"
  style="width:100%;height:auto;display:block"
  data-template="${templateId}"
>
  <defs>
    <!-- EDITAR TAMANHO DO CARD AQUI -->

    <!-- FUNDO PADRÃO CASO NÃO DEFINA IMAGEM -->
    <linearGradient id="bgFallback" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(fallbackStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(fallbackEnd)}"/>
    </linearGradient>

    <!-- OVERLAY ESCURO -->
    <linearGradient id="bgOverlay" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(overlay.startColor || "#000000")}" stop-opacity="${overlayStartOpacity}"/>
      <stop offset="100%" stop-color="${escapeAttr(overlay.endColor || "#000000")}" stop-opacity="${overlayEndOpacity}"/>
    </linearGradient>

    <!-- COR DE DESTAQUE -->
    <linearGradient id="accent" x1="142" y1="27" x2="167" y2="52" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(accentStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(accentEnd)}"/>
    </linearGradient>

    <!-- SOMBRA -->
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow
        dx="${numberValue(shadow.dx, 0)}"
        dy="${numberValue(shadow.dy, 8)}"
        stdDeviation="${numberValue(shadow.blur, 10)}"
        flood-color="${escapeAttr(shadow.color || "#000000")}"
        flood-opacity="${clamp(numberValue(shadow.opacity, 0.32), 0, 1)}"
      />
    </filter>

    <!-- BLUR OPCIONAL DA IMAGEM DE FUNDO -->
    <filter id="bgBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="${numberValue(bg.blur, 3.5)}"/>
    </filter>

    <!-- RECORTE DO CARD -->
    <clipPath id="cardClip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}"/>
    </clipPath>

    <!-- RECORTE DO AVATAR -->
    <clipPath id="avatarClip">
      <circle cx="${numberValue(card.avatar?.cx, 67)}" cy="${numberValue(card.avatar?.cy, 60)}" r="${numberValue(card.avatar?.radius, 38)}"/>
    </clipPath>
  </defs>

  <!-- BASE -->
  <g filter="url(#cardShadow)">
    <rect
      id="cardBase"
      x="0"
      y="0"
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="url(#bgFallback)"
    />
  </g>

  <g clip-path="url(#cardClip)">
    <!-- FUNDO PADRÃO -->
    <rect
      id="fallbackBackground"
      x="0"
      y="0"
      width="${width}"
      height="${height}"
      rx="${radius}"
      fill="url(#bgFallback)"
    />

${renderSquares(card)}

${renderBackgroundImage(card, width, height)}

    <!-- OVERLAY ESCURO SOBRE A IMAGEM/FUNDO -->
    <rect
      id="backgroundOverlay"
      x="2"
      y="2"
      width="${width - 4}"
      height="${height - 4}"
      rx="${radius}"
      fill="url(#bgOverlay)"
    />

    <!-- TEXTURA SUTIL -->
    <rect
      id="glassLayer"
      x="2"
      y="2"
      width="${width - 4}"
      height="${height - 4}"
      rx="${radius}"
      fill="${escapeAttr(glass.color || "#FFFFFF")}"
      opacity="${clamp(numberValue(glass.opacity, 0.025), 0, 1)}"
    />
  </g>

  <!-- BORDA -->
  <rect
    id="cardBorder"
    x="0.5"
    y="0.5"
    width="${width - 1}"
    height="${height - 1}"
    rx="${radius}"
    fill="none"
    stroke="${escapeAttr(border.color || "#FFFFFF")}"
    stroke-opacity="${clamp(numberValue(border.opacity, 0.14), 0, 1)}"
    stroke-width="${numberValue(border.width, 1.2)}"
  />

  <!-- BRILHO SUPERIOR -->
  <path
    id="topHighlight"
    d="M18 14 H${width - 18}"
    stroke="${escapeAttr(border.highlightColor || "#FFFFFF")}"
    stroke-opacity="${clamp(numberValue(border.highlightOpacity, 0.06), 0, 1)}"
    stroke-width="${numberValue(border.highlightWidth, 1)}"
    stroke-linecap="round"
  />

${renderAvatar(card)}

  <!-- BLOCO DE TEXTO -->
  <g id="textGroup" font-family="${escapeAttr(baseFont)}">
${renderStatusIcon(card, mode, card.icon?.stroke || "#111111")}

    <!-- EDITAR NOME AQUI -->
    <text
      id="userName"
      x="${numberValue(text.name?.x, 165)}"
      y="${numberValue(text.name?.y, 46)}"
      font-size="${numberValue(text.name?.size, 24)}"
      font-weight="${numberValue(text.name?.weight, 900)}"
      fill="${escapeAttr(text.name?.color || text.primaryColor || "#FFFFFF")}"
      letter-spacing="${numberValue(text.name?.letterSpacing, -0.4)}"
    >${escapeXml(userName)}</text>

    <!-- EDITAR TEXTO PRINCIPAL AQUI -->
    <text
      id="${mode === "farewell" ? "farewellText" : "welcomeText"}"
      x="${numberValue(text.main?.x, 140)}"
      y="${numberValue(text.main?.y, 71)}"
      font-size="${numberValue(text.main?.size, 16)}"
      font-weight="${numberValue(text.main?.weight, 600)}"
      fill="${escapeAttr(text.main?.color || text.primaryColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(text.main?.opacity, 0.84), 0, 1)}"
    >${escapeXml(mainText)}</text>

    <!-- EDITAR NOME DO GRUPO AQUI -->
    <text
      id="groupName"
      x="${numberValue(text.group?.x, 140)}"
      y="${numberValue(text.group?.y, 92)}"
      font-size="${numberValue(text.group?.size, 13)}"
      font-weight="${numberValue(text.group?.weight, 600)}"
      fill="${escapeAttr(text.group?.color || text.secondaryColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(text.group?.opacity, 0.42), 0, 1)}"
    >${escapeXml(groupName)}</text>
  </g>
</svg>`;
}

function createDarkMinimalWelcomeSvg(card = {}) {
  return createDarkMinimalMemberCardSvg(card, "welcome");
}

function createDarkMinimalFarewellSvg(card = {}) {
  return createDarkMinimalMemberCardSvg(card, "farewell");
}

module.exports = {
  createDarkMinimalWelcomeSvg,
  createDarkMinimalFarewellSvg
};
