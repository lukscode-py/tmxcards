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

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function textValue(card, key, fallback) {
  return card.text?.[key]?.value ?? fallback;
}

function textColor(card, key, fallback) {
  return card.text?.[key]?.color ?? fallback;
}

function textFamily(card, key, fallback) {
  return card.text?.[key]?.fontFamily
    || card.fonts?.[key]
    || card.fonts?.base
    || fallback;
}

function backgroundSvg(card) {
  const backgroundHref = imageSource(card.background);
  const href = backgroundHref;

  if (href) {
    const overlayColor = card.background?.overlayColor || "#000000";
    const overlayOpacity = clamp(numberValue(card.background?.overlayOpacity, 0), 0, 1);

    return `  <image
    href="${escapeAttr(href)}"
    x="0"
    y="0"
    width="900"
    height="340"
    preserveAspectRatio="xMidYMid slice"
  />${overlayOpacity > 0 ? `
  <rect width="900" height="340" fill="${escapeAttr(overlayColor)}" opacity="${overlayOpacity}"/>` : ""}`;
  }

  return `  <rect width="900" height="340" fill="url(#bg)"/>`;
}

function coverSvg(card) {
  if (card.cover?.enabled === false) {
    return "";
  }

  const frameX = numberValue(card.cover?.frameX, 78);
  const frameY = numberValue(card.cover?.frameY, 52);
  const frameWidth = numberValue(card.cover?.frameWidth, 236);
  const frameHeight = numberValue(card.cover?.frameHeight, 236);
  const frameRadius = numberValue(card.cover?.frameRadius, 28);

  const imageX = numberValue(card.cover?.x, 86);
  const imageY = numberValue(card.cover?.y, 60);
  const imageWidth = numberValue(card.cover?.width, 220);
  const imageHeight = numberValue(card.cover?.height, 220);
  const imageRadius = numberValue(card.cover?.radius, 22);

  const frameFill = card.cover?.frameFill || "#0D0D0D";
  const frameBorderColor = card.cover?.frameBorderColor || "#FFFFFF";
  const frameBorderOpacity = clamp(numberValue(card.cover?.frameBorderOpacity, 0.08), 0, 1);
  const frameBorderWidth = numberValue(card.cover?.frameBorderWidth, 2);
  const overlayColor = card.cover?.overlayColor || "#000000";
  const overlayOpacity = clamp(numberValue(card.cover?.overlayOpacity, 0.10), 0, 1);
  const placeholderColor = card.cover?.placeholderColor || "#FFFFFF";
  const placeholderOpacity = clamp(numberValue(card.cover?.placeholderOpacity, 0.58), 0, 1);
  const placeholderText = card.cover?.placeholderText || "Capa";
  const placeholderFont = card.cover?.placeholderFontFamily
    || card.fonts?.base
    || "Inter, Roboto, Arial, sans-serif";

  let imageLayer = `    <rect
      x="${imageX}"
      y="${imageY}"
      width="${imageWidth}"
      height="${imageHeight}"
      rx="${imageRadius}"
      fill="#151515"
    />`;

  const coverHref = imageSource(card.cover);

  if (coverHref) {
    imageLayer = `    <image
      href="${escapeAttr(coverHref)}"
      x="${imageX}"
      y="${imageY}"
      width="${imageWidth}"
      height="${imageHeight}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#coverClip)"
      opacity="${clamp(numberValue(card.cover?.opacity, 1), 0, 1)}"
    />`;
  } else {
    imageLayer += `
    <text
      x="${imageX + imageWidth / 2}"
      y="${imageY + imageHeight / 2 + 7}"
      text-anchor="middle"
      font-family="${escapeAttr(placeholderFont)}"
      font-size="24"
      font-weight="700"
      fill="${escapeAttr(placeholderColor)}"
      opacity="${placeholderOpacity}"
    >${escapeXml(placeholderText)}</text>`;
  }

  return `  <g>
    <rect
      x="${frameX}"
      y="${frameY}"
      width="${frameWidth}"
      height="${frameHeight}"
      rx="${frameRadius}"
      fill="${escapeAttr(frameFill)}"
      stroke="${escapeAttr(frameBorderColor)}"
      stroke-opacity="${frameBorderOpacity}"
      stroke-width="${frameBorderWidth}"
    />

${imageLayer}

    <rect
      x="${imageX}"
      y="${imageY}"
      width="${imageWidth}"
      height="${imageHeight}"
      rx="${imageRadius}"
      fill="${escapeAttr(overlayColor)}"
      opacity="${overlayOpacity}"
    />
  </g>`;
}

function createMusicMidnightMonoPlayerSvg(card = {}) {
  const shadow = card.shadow || {};
  const fonts = card.fonts || {};
  const progress = card.progress || {};
  const cardBox = card.card || {};

  const cardX = numberValue(cardBox.x, 50);
  const cardY = numberValue(cardBox.y, 40);
  const cardWidth = numberValue(cardBox.width, 800);
  const cardHeight = numberValue(cardBox.height, 260);
  const cardRadius = numberValue(cardBox.radius, 28);

  const progressX = numberValue(progress.x, 370);
  const progressY = numberValue(progress.y, 218);
  const progressWidth = numberValue(progress.width, 400);
  const progressHeight = numberValue(progress.height, 10);
  const progressRadius = numberValue(progress.radius, 999);
  const progressValue = clamp(numberValue(progress.value, 38), 0, 100);
  const progressFillWidth = Math.round((progressWidth * progressValue) / 100);

  const handleCx = progressFillWidth;
  const handleCy = Math.round(progressHeight / 2);
  const handleRadius = numberValue(progress.handleRadius, 9);

  const title = textValue(card, "title", "Nome da música");
  const subtitle = textValue(card, "subtitle", "music card");
  const timeStart = textValue(card, "timeStart", "0:00");
  const timeEnd = textValue(card, "timeEnd", "~:~");
  const badge = textValue(card, "badge", "NOW PLAYING");

  const baseFont = fonts.base || "Inter, Roboto, Arial, sans-serif";
  const titleFont = textFamily(card, "title", baseFont);
  const subtitleFont = textFamily(card, "subtitle", baseFont);
  const timeStartFont = textFamily(card, "timeStart", baseFont);
  const timeEndFont = textFamily(card, "timeEnd", baseFont);
  const badgeFont = textFamily(card, "badge", baseFont);

  const titleColor = textColor(card, "title", "#FFFFFF");
  const subtitleColor = textColor(card, "subtitle", "#FFFFFF");
  const subtitleOpacity = clamp(numberValue(card.text?.subtitle?.opacity, 0.42), 0, 1);
  const badgeTextColor = textColor(card, "badge", "#FFFFFF");
  const badgeTextOpacity = clamp(numberValue(card.text?.badge?.opacity, 0.76), 0, 1);
  const timeStartColor = textColor(card, "timeStart", "#FFFFFF");
  const timeEndColor = textColor(card, "timeEnd", "#FFFFFF");
  const timeOpacity = clamp(numberValue(card.text?.timeOpacity, 0.60), 0, 1);

  const backgroundStart = card.background?.startColor || "#080808";
  const backgroundEnd = card.background?.endColor || "#141414";
  const cardStart = cardBox.startColor || "#111111";
  const cardEnd = cardBox.endColor || "#1A1A1A";
  const accentStart = progress.startColor || "#FFFFFF";
  const accentEnd = progress.endColor || "#BFBFBF";

  const cardBorderColor = cardBox.borderColor || "#FFFFFF";
  const cardBorderOpacity = clamp(numberValue(cardBox.borderOpacity, 0.08), 0, 1);
  const cardBorderWidth = numberValue(cardBox.borderWidth, 1.5);

  const outlineColor = cardBox.outlineColor || "#FFFFFF";
  const outlineOpacity = clamp(numberValue(cardBox.outlineOpacity, 0.03), 0, 1);
  const outlineWidth = numberValue(cardBox.outlineWidth, 1);

  const trackColor = progress.trackColor || "#FFFFFF";
  const trackOpacity = clamp(numberValue(progress.trackOpacity, 0.10), 0, 1);
  const handleColor = progress.handleColor || "#FFFFFF";

  const badgeBg = card.text?.badge?.bgColor || "#FFFFFF";
  const badgeBgOpacity = clamp(numberValue(card.text?.badge?.bgOpacity, 0.06), 0, 1);
  const badgeBorderColor = card.text?.badge?.borderColor || "#FFFFFF";
  const badgeBorderOpacity = clamp(numberValue(card.text?.badge?.borderOpacity, 0.06), 0, 1);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="900"
  height="340"
  viewBox="0 0 900 340"
  role="img"
  aria-label="Card de música em SVG"
  style="width:100%;height:auto;display:block"
  data-template="music-midnight-mono-player"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bg" x1="0" y1="0" x2="900" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(backgroundStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(backgroundEnd)}"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="cardBg" x1="60" y1="40" x2="840" y2="300" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(cardStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(cardEnd)}"/>
    </linearGradient>

    <!-- DESTAQUE -->
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(accentStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(accentEnd)}"/>
    </linearGradient>

    <!-- SOMBRA -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="${numberValue(shadow.dx, 0)}"
        dy="${numberValue(shadow.dy, 14)}"
        stdDeviation="${numberValue(shadow.blur, 18)}"
        flood-color="${escapeAttr(shadow.color || "#000000")}"
        flood-opacity="${clamp(numberValue(shadow.opacity, 0.32), 0, 1)}"
      />
    </filter>

    <!-- RECORTE DA CAPA -->
    <clipPath id="coverClip">
      <rect
        x="${numberValue(card.cover?.x, 86)}"
        y="${numberValue(card.cover?.y, 60)}"
        width="${numberValue(card.cover?.width, 220)}"
        height="${numberValue(card.cover?.height, 220)}"
        rx="${numberValue(card.cover?.radius, 22)}"
      />
    </clipPath>
  </defs>

${backgroundSvg(card)}

  <!-- CARD PRINCIPAL -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${cardWidth}"
    height="${cardHeight}"
    rx="${cardRadius}"
    fill="url(#cardBg)"
    stroke="${escapeAttr(cardBorderColor)}"
    stroke-opacity="${cardBorderOpacity}"
    stroke-width="${cardBorderWidth}"
    filter="url(#shadow)"
  />

  <!-- CONTORNO SUTIL -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${cardWidth}"
    height="${cardHeight}"
    rx="${cardRadius}"
    fill="none"
    stroke="${escapeAttr(outlineColor)}"
    stroke-opacity="${outlineOpacity}"
    stroke-width="${outlineWidth}"
  />

${coverSvg(card)}

  <!-- INFORMAÇÕES -->
  <g font-family="${escapeAttr(baseFont)}">
    <!-- ETIQUETA -->
    <rect
      x="370"
      y="68"
      width="118"
      height="30"
      rx="15"
      fill="${escapeAttr(badgeBg)}"
      fill-opacity="${badgeBgOpacity}"
      stroke="${escapeAttr(badgeBorderColor)}"
      stroke-opacity="${badgeBorderOpacity}"
    />
    <text
      x="429"
      y="87"
      text-anchor="middle"
      font-family="${escapeAttr(badgeFont)}"
      font-size="13"
      font-weight="700"
      fill="${escapeAttr(badgeTextColor)}"
      opacity="${badgeTextOpacity}"
      letter-spacing="1"
    >${escapeXml(badge)}</text>

    <!-- EDITAR TÍTULO AQUI -->
    <text
      x="370"
      y="138"
      font-family="${escapeAttr(titleFont)}"
      font-size="36"
      font-weight="800"
      fill="${escapeAttr(titleColor)}"
      letter-spacing="-0.8"
    >${escapeXml(title)}</text>

    <!-- EDITAR SUBTEXTO AQUI -->
    <text
      x="370"
      y="172"
      font-family="${escapeAttr(subtitleFont)}"
      font-size="18"
      font-weight="500"
      fill="${escapeAttr(subtitleColor)}"
      opacity="${subtitleOpacity}"
    >${escapeXml(subtitle)}</text>

    <!-- BARRA DE TEMPO -->
    <g transform="translate(${progressX} ${progressY})">
      <!-- FUNDO DA BARRA -->
      <rect
        x="0"
        y="0"
        width="${progressWidth}"
        height="${progressHeight}"
        rx="${progressRadius}"
        fill="${escapeAttr(trackColor)}"
        opacity="${trackOpacity}"
      />

      <!-- EDITAR PROGRESSO AQUI -->
      <rect
        x="0"
        y="0"
        width="${progressFillWidth}"
        height="${progressHeight}"
        rx="${progressRadius}"
        fill="url(#accent)"
        opacity="0.96"
      />

      <circle
        cx="${handleCx}"
        cy="${handleCy}"
        r="${handleRadius}"
        fill="${escapeAttr(handleColor)}"
      />
    </g>

    <!-- TEMPOS -->
    <text
      x="370"
      y="255"
      font-family="${escapeAttr(timeStartFont)}"
      font-size="16"
      font-weight="700"
      fill="${escapeAttr(timeStartColor)}"
      opacity="${timeOpacity}"
    >${escapeXml(timeStart)}</text>

    <text
      x="770"
      y="255"
      text-anchor="end"
      font-family="${escapeAttr(timeEndFont)}"
      font-size="16"
      font-weight="700"
      fill="${escapeAttr(timeEndColor)}"
      opacity="${timeOpacity}"
    >${escapeXml(timeEnd)}</text>
  </g>
</svg>`;
}

module.exports = {
  createMusicMidnightMonoPlayerSvg
};
