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
  if (value && typeof value === "object" && "value" in value) return value.value ?? fallback;
  return value ?? fallback;
}

function renderSquares(card) {
  const squares = card.squares || {};
  if (squares.enabled === false) return "";

  return `    <!-- QUADRADOS PEQUENOS DO FUNDO PADRÃO -->
    <g
      id="backgroundSquares"
      fill="none"
      stroke="${escapeAttr(squares.stroke || "#FFFFFF")}"
      stroke-width="${numberValue(squares.strokeWidth, 0.8)}"
      stroke-opacity="${clamp(numberValue(squares.opacity, 0.10), 0, 1)}"
      shape-rendering="geometricPrecision"
    >
      <rect x="300" y="14" width="14" height="14" rx="1"/>
      <rect x="324" y="24" width="14" height="14" rx="1"/>
      <rect x="348" y="14" width="14" height="14" rx="1"/>
      <rect x="372" y="24" width="14" height="14" rx="1"/>
      <rect x="396" y="14" width="14" height="14" rx="1"/>
      <rect x="420" y="24" width="14" height="14" rx="1"/>

      <rect x="312" y="46" width="14" height="14" rx="1"/>
      <rect x="336" y="56" width="14" height="14" rx="1"/>
      <rect x="360" y="46" width="14" height="14" rx="1"/>
      <rect x="384" y="56" width="14" height="14" rx="1"/>
      <rect x="408" y="46" width="14" height="14" rx="1"/>
      <rect x="432" y="56" width="14" height="14" rx="1"/>

      <rect x="300" y="80" width="14" height="14" rx="1"/>
      <rect x="324" y="90" width="14" height="14" rx="1"/>
      <rect x="348" y="80" width="14" height="14" rx="1"/>
      <rect x="372" y="90" width="14" height="14" rx="1"/>
      <rect x="396" y="80" width="14" height="14" rx="1"/>
      <rect x="420" y="90" width="14" height="14" rx="1"/>
    </g>`;
}

function renderBackgroundImage(card, width, height) {
  const bg = card.background || {};
  const href = imageHref(bg);

  if (!href) {
    return "";
  }

  return `    <!-- IMAGEM DE FUNDO OPCIONAL -->
    <image
      id="backgroundImage"
      href="${escapeAttr(href)}"
      x="${numberValue(bg.x, -8)}"
      y="${numberValue(bg.y, -8)}"
      width="${numberValue(bg.width, width + 16)}"
      height="${numberValue(bg.height, height + 16)}"
      preserveAspectRatio="${escapeAttr(bg.preserveAspectRatio || "xMidYMid slice")}"
      opacity="${clamp(numberValue(bg.opacity, 0.38), 0, 1)}"
      filter="${bg.blur === false ? "" : "url(#bgBlur)"}"
    />`;
}

function renderAvatar(card, baseFont) {
  const avatar = card.avatar || {};
  const href = imageHref(avatar);

  const cx = numberValue(avatar.cx, 67);
  const cy = numberValue(avatar.cy, 60);
  const radius = numberValue(avatar.radius, 38);
  const outerRadius = numberValue(avatar.outerRadius, 41);
  const size = numberValue(avatar.size, 76);
  const x = numberValue(avatar.x, 29);
  const y = numberValue(avatar.y, 22);

  return `  <!-- PERFIL -->
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
      font-family="${escapeAttr(avatar.fontFamily || baseFont)}"
      font-size="${numberValue(avatar.placeholderSize, 14)}"
      font-weight="800"
      fill="${escapeAttr(avatar.placeholderColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(avatar.placeholderOpacity, 0.62), 0, 1)}"
    >${escapeXml(avatar.placeholderText || "Perfil")}</text>`
    }

    <circle
      cx="${cx}"
      cy="${cy}"
      r="${radius}"
      fill="none"
      stroke="${escapeAttr(avatar.innerStroke || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(avatar.innerStrokeOpacity, 0.09), 0, 1)}"
      stroke-width="${numberValue(avatar.innerStrokeWidth, 1.4)}"
    />
  </g>`;
}

function createDarkMinimalXpRankSvg(card = {}) {
  const width = numberValue(card.width, 470);
  const height = numberValue(card.height, 120);
  const radius = numberValue(card.radius, 0);

  const bg = card.background || {};
  const overlay = card.overlay || {};
  const border = card.border || {};
  const shadow = card.shadow || {};
  const glass = card.glass || {};
  const xp = card.xp || {};
  const text = card.text || {};
  const level = card.level || {};
  const bar = card.bar || {};
  const marker = card.marker || {};
  const fonts = card.fonts || {};

  const baseFont = fonts.base || "Inter, Roboto, Arial, sans-serif";

  const currentXp = numberValue(xp.current, 340);
  const totalXp = Math.max(1, numberValue(xp.total, 1000));
  const missingXp = Math.max(0, totalXp - currentXp);

  const barX = numberValue(bar.x, 134);
  const barY = numberValue(bar.y, 80);
  const barWidth = numberValue(bar.width, 292);
  const barHeight = numberValue(bar.height, 10);
  const progressPercent = clamp(numberValue(xp.progress, (currentXp / totalXp) * 100), 0, 100);
  const progressWidth = clamp(numberValue(bar.progressWidth, Math.round((barWidth * progressPercent) / 100)), 0, barWidth);
  const markerCx = numberValue(marker.cx, barX + progressWidth);

  const userName = textValue(card, "name", "Nome do usuário");
  const xpText = textValue(card, "xp", `XP ${currentXp} / ${totalXp}`);
  const nextLevelText = textValue(card, "nextLevel", `Faltam ${missingXp} XP para o próximo level`);
  const levelText = textValue(card, "level", `LVL ${numberValue(level.value, 12)}`);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  role="img"
  aria-label="Card de level e XP"
  style="width:100%;height:auto;display:block"
  data-template="dark_minimal_xp_rank"
  data-category="rank"
>
  <defs>
    <!-- EDITAR TAMANHO DO CARD AQUI -->

    <!-- FUNDO PADRÃO CASO NÃO DEFINA IMAGEM -->
    <linearGradient id="bgFallback" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(bg.startColor || "#070707")}"/>
      <stop offset="100%" stop-color="${escapeAttr(bg.endColor || "#141414")}"/>
    </linearGradient>

    <!-- OVERLAY ESCURO SOBRE FUNDO/IMAGEM -->
    <linearGradient id="bgOverlay" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(overlay.startColor || "#000000")}" stop-opacity="${clamp(numberValue(overlay.startOpacity, 0.32), 0, 1)}"/>
      <stop offset="100%" stop-color="${escapeAttr(overlay.endColor || "#000000")}" stop-opacity="${clamp(numberValue(overlay.endOpacity, 0.64), 0, 1)}"/>
    </linearGradient>

    <!-- COR PRINCIPAL DO XP -->
    <linearGradient id="xpAccent" x1="140" y1="0" x2="380" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(xp.startColor || xp.color || "#FFFFFF")}"/>
      <stop offset="100%" stop-color="${escapeAttr(xp.endColor || xp.color || "#BDBDBD")}"/>
    </linearGradient>

    <!-- SOMBRA DO CARD -->
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

    <!-- RECORTE DO PERFIL -->
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

  <!-- FUNDO -->
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

    <!-- OVERLAY ESCURO -->
    <rect
      id="backgroundOverlay"
      x="2"
      y="2"
      width="${width - 4}"
      height="${height - 4}"
      rx="${radius}"
      fill="url(#bgOverlay)"
    />

    <!-- CAMADA GLASS SUTIL -->
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

  <!-- BORDA DO CARD -->
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

${renderAvatar(card, baseFont)}

  <!-- INFORMAÇÕES -->
  <g id="contentGroup" font-family="${escapeAttr(baseFont)}">
    <!-- EDITAR NOME DO USUÁRIO AQUI -->
    <text
      id="userName"
      x="${numberValue(text.name?.x, 134)}"
      y="${numberValue(text.name?.y, 38)}"
      font-size="${numberValue(text.name?.size, 23)}"
      font-weight="${numberValue(text.name?.weight, 900)}"
      fill="${escapeAttr(text.name?.color || text.primaryColor || "#FFFFFF")}"
      letter-spacing="${numberValue(text.name?.letterSpacing, -0.35)}"
    >${escapeXml(userName)}</text>

    <!-- EDITAR LEVEL AQUI -->
    <g id="levelBadge">
      <rect
        x="${numberValue(level.x, 352)}"
        y="${numberValue(level.y, 20)}"
        width="${numberValue(level.width, 78)}"
        height="${numberValue(level.height, 28)}"
        rx="${numberValue(level.radius, 14)}"
        fill="${escapeAttr(level.bgColor || "#FFFFFF")}"
        fill-opacity="${clamp(numberValue(level.bgOpacity, 0.08), 0, 1)}"
        stroke="${escapeAttr(level.borderColor || "#FFFFFF")}"
        stroke-opacity="${clamp(numberValue(level.borderOpacity, 0.10), 0, 1)}"
      />

      <text
        id="levelText"
        x="${numberValue(level.textX, 391)}"
        y="${numberValue(level.textY, 39)}"
        text-anchor="middle"
        font-size="${numberValue(level.size, 13)}"
        font-weight="900"
        fill="${escapeAttr(level.color || text.primaryColor || "#FFFFFF")}"
        letter-spacing="0.6"
      >${escapeXml(levelText)}</text>
    </g>

    <!-- EDITAR XP AQUI -->
    <text
      id="xpText"
      x="${numberValue(text.xp?.x, 134)}"
      y="${numberValue(text.xp?.y, 67)}"
      font-size="${numberValue(text.xp?.size, 15)}"
      font-weight="${numberValue(text.xp?.weight, 700)}"
      fill="${escapeAttr(text.xp?.color || text.primaryColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(text.xp?.opacity, 0.76), 0, 1)}"
    >${escapeXml(xpText)}</text>

    <!-- BARRA DE XP -->
    <g id="xpBar">
      <rect
        x="${barX}"
        y="${barY}"
        width="${barWidth}"
        height="${barHeight}"
        rx="${numberValue(bar.radius, 999)}"
        fill="${escapeAttr(bar.bgColor || "#FFFFFF")}"
        opacity="${clamp(numberValue(bar.bgOpacity, 0.10), 0, 1)}"
      />

      <rect
        id="xpProgress"
        x="${barX}"
        y="${barY}"
        width="${progressWidth}"
        height="${barHeight}"
        rx="${numberValue(bar.radius, 999)}"
        fill="url(#xpAccent)"
        opacity="${clamp(numberValue(bar.opacity, 0.96), 0, 1)}"
      />

      <circle
        id="xpProgressDot"
        cx="${markerCx}"
        cy="${numberValue(marker.cy, barY + barHeight / 2)}"
        r="${numberValue(marker.radius, 6)}"
        fill="${escapeAttr(marker.color || "#FFFFFF")}"
        opacity="${clamp(numberValue(marker.opacity, 1), 0, 1)}"
      />
    </g>

    <!-- EDITAR TEXTO OPCIONAL AQUI -->
    <text
      id="nextLevelText"
      x="${numberValue(text.nextLevel?.x, 134)}"
      y="${numberValue(text.nextLevel?.y, 105)}"
      font-size="${numberValue(text.nextLevel?.size, 12)}"
      font-weight="${numberValue(text.nextLevel?.weight, 600)}"
      fill="${escapeAttr(text.nextLevel?.color || text.secondaryColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(text.nextLevel?.opacity, 0.40), 0, 1)}"
    >${escapeXml(nextLevelText)}</text>
  </g>
</svg>`;
}

module.exports = {
  createDarkMinimalXpRankSvg
};
