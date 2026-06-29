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
  return card.text?.[key]?.color ?? card.textColors?.[key] ?? fallback;
}

function fontFamily(card, key, fallback) {
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

    return `  <!-- EDITAR FUNDO AQUI -->
  <image
    href="${escapeAttr(href)}"
    x="0"
    y="0"
    width="960"
    height="340"
    preserveAspectRatio="xMidYMid slice"
  />${overlayOpacity > 0 ? `
  <rect width="960" height="340" fill="${escapeAttr(overlayColor)}" opacity="${overlayOpacity}"/>` : ""}`;
  }

  return `  <!-- EDITAR FUNDO AQUI -->
  <rect width="960" height="340" fill="url(#bg)"/>`;
}

function coverImageSvg(card, cover) {
  if (card.cover?.enabled === false) {
    return "";
  }

  const coverHref = imageSource(card.cover);

  if (!coverHref) {
    return `    <circle
      cx="${cover.cx}"
      cy="${cover.cy}"
      r="${cover.r}"
      fill="#0A0A0A"
      clip-path="url(#coverClip)"
    />
    <text
      x="${cover.cx}"
      y="${cover.cy + 7}"
      text-anchor="middle"
      font-family="${escapeAttr(cover.placeholderFont)}"
      font-size="${cover.placeholderSize}"
      font-weight="700"
      fill="${escapeAttr(cover.placeholderColor)}"
      opacity="${cover.placeholderOpacity}"
    >${escapeXml(cover.placeholderText)}</text>`;
  }

  return `    <!-- EDITAR FOTO DA MÚSICA AQUI -->
    <image
      href="${escapeAttr(coverHref)}"
      x="${cover.x}"
      y="${cover.y}"
      width="${cover.size}"
      height="${cover.size}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#coverClip)"
      opacity="${cover.opacity}"
    />`;
}

function createOrbitMonoPlayerSvg(card = {}) {
  const bg = card.background || {};
  const cardBox = card.card || {};
  const coverInput = card.cover || {};
  const progress = card.progress || {};
  const tag = card.tag || {};
  const bottomBlock = card.bottomBlock || {};
  const shadow = card.shadow || {};

  const baseFont = card.fonts?.base || "Inter, Roboto, Arial, sans-serif";

  const cardX = numberValue(cardBox.x, 48);
  const cardY = numberValue(cardBox.y, 30);
  const cardWidth = numberValue(cardBox.width, 864);
  const cardHeight = numberValue(cardBox.height, 280);
  const cardRadius = numberValue(cardBox.radius, 30);

  const coverCx = numberValue(coverInput.cx, 190);
  const coverCy = numberValue(coverInput.cy, 170);
  const coverR = numberValue(coverInput.radius, 84);
  const coverSize = numberValue(coverInput.size, coverR * 2);
  const coverX = numberValue(coverInput.x, coverCx - coverSize / 2);
  const coverY = numberValue(coverInput.y, coverCy - coverSize / 2);
  const coverOpacity = clamp(numberValue(coverInput.opacity, 1), 0, 1);

  const cover = {
    cx: coverCx,
    cy: coverCy,
    r: coverR,
    x: coverX,
    y: coverY,
    size: coverSize,
    opacity: coverOpacity,
    placeholderText: coverInput.placeholderText || "Capa",
    placeholderColor: coverInput.placeholderColor || "#FFFFFF",
    placeholderOpacity: clamp(numberValue(coverInput.placeholderOpacity, 0.58), 0, 1),
    placeholderSize: numberValue(coverInput.placeholderSize, 22),
    placeholderFont: coverInput.placeholderFontFamily || baseFont
  };

  const orbitOuterR = numberValue(coverInput.outerRadius, 98);
  const orbitDecorR = numberValue(coverInput.decorRadius, 108);
  const coverBgR = numberValue(coverInput.backgroundRadius, 88);
  const coverBgColor = coverInput.backgroundColor || "#0A0A0A";

  const bgStart = bg.startColor || "#050505";
  const bgEnd = bg.endColor || "#121212";

  const cardStart = cardBox.startColor || "#0E0E0E";
  const cardEnd = cardBox.endColor || "#181818";

  const accentStart = progress.startColor || progress.color || "#FFFFFF";
  const accentEnd = progress.endColor || progress.color || "#A3A3A3";

  const progressX = numberValue(progress.x, 338);
  const progressY = numberValue(progress.y, 224);
  const progressWidth = numberValue(progress.width, 500);
  const progressHeight = numberValue(progress.height, 8);
  const progressRadius = numberValue(progress.radius, 999);
  const progressValue = clamp(numberValue(progress.value, 38.8), 0, 100);
  const progressFillWidth = clamp(numberValue(progress.fillWidth, Math.round((progressWidth * progressValue) / 100)), 0, progressWidth);
  const indicatorX = clamp(numberValue(progress.indicatorX, progressFillWidth), 0, progressWidth);

  const primaryColor = card.textColors?.primary || "#FFFFFF";
  const secondaryColor = card.textColors?.secondary || "#FFFFFF";

  const title = textValue(card, "title", "Nome da música");
  const subtitle = textValue(card, "subtitle", "artista ou sub text");
  const timeStart = textValue(card, "timeStart", "0:00");
  const timeEnd = textValue(card, "timeEnd", "~:~");
  const tagText = tag.text ?? textValue(card, "tag", "MUSIC CARD");
  const bottomText = bottomBlock.text ?? textValue(card, "bottomText", "MIDNIGHT SESSION");

  const bottomEnabled = bottomBlock.enabled !== false;

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="960"
  height="340"
  viewBox="0 0 960 340"
  role="img"
  aria-label="Card de música em SVG"
  style="width:100%;height:auto;display:block"
  data-template="orbit_mono_player"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bg" x1="0" y1="0" x2="960" y2="340" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(bgStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(bgEnd)}"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="cardBg" x1="48" y1="30" x2="912" y2="310" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(cardStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(cardEnd)}"/>
    </linearGradient>

    <!-- EDITAR COR DE DESTAQUE AQUI -->
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(accentStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(accentEnd)}"/>
    </linearGradient>

    <!-- RECORTE DA FOTO REDONDA -->
    <clipPath id="coverClip">
      <circle cx="${coverCx}" cy="${coverCy}" r="${coverR}"/>
    </clipPath>

    <!-- SOMBRA -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="${numberValue(shadow.dx, 0)}"
        dy="${numberValue(shadow.dy, 14)}"
        stdDeviation="${numberValue(shadow.blur, 18)}"
        flood-color="${escapeAttr(shadow.color || "#000000")}"
        flood-opacity="${clamp(numberValue(shadow.opacity, 0.34), 0, 1)}"
      />
    </filter>
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
    stroke="${escapeAttr(cardBox.borderColor || "#FFFFFF")}"
    stroke-opacity="${clamp(numberValue(cardBox.borderOpacity, 0.06), 0, 1)}"
    stroke-width="${numberValue(cardBox.borderWidth, 1.5)}"
    filter="url(#shadow)"
  />

  <!-- CONTORNO EXTRA -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${cardWidth}"
    height="${cardHeight}"
    rx="${cardRadius}"
    fill="none"
    stroke="${escapeAttr(cardBox.outlineColor || "#FFFFFF")}"
    stroke-opacity="${clamp(numberValue(cardBox.outlineOpacity, 0.03), 0, 1)}"
    stroke-width="${numberValue(cardBox.outlineWidth, 1)}"
  />

  <!-- CAPA REDONDA -->
  <g>
    <!-- ANEL EXTERNO -->
    <circle
      cx="${coverCx}"
      cy="${coverCy}"
      r="${orbitOuterR}"
      fill="none"
      stroke="${escapeAttr(coverInput.outerRingColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(coverInput.outerRingOpacity, 0.10), 0, 1)}"
      stroke-width="${numberValue(coverInput.outerRingWidth, 2)}"
    />

    <!-- ANEL DECORATIVO -->
    <path
      d="M${coverCx} ${coverCy - orbitDecorR}
         A${orbitDecorR} ${orbitDecorR} 0 0 1 ${coverCx + orbitDecorR - 1} ${coverCy}"
      fill="none"
      stroke="${escapeAttr(coverInput.decorColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(coverInput.decorOpacity, 0.18), 0, 1)}"
      stroke-width="${numberValue(coverInput.decorWidth, 5)}"
      stroke-linecap="round"
    />
    <path
      d="M${coverCx} ${coverCy + orbitDecorR}
         A${orbitDecorR} ${orbitDecorR} 0 0 1 ${coverCx - orbitDecorR + 1} ${coverCy}"
      fill="none"
      stroke="${escapeAttr(coverInput.decorColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(coverInput.decorBackOpacity, 0.08), 0, 1)}"
      stroke-width="${numberValue(coverInput.decorWidth, 5)}"
      stroke-linecap="round"
    />

    <!-- FUNDO DA FOTO -->
    <circle
      cx="${coverCx}"
      cy="${coverCy}"
      r="${coverBgR}"
      fill="${escapeAttr(coverBgColor)}"
      stroke="${escapeAttr(coverInput.borderColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(coverInput.borderOpacity, 0.08), 0, 1)}"
      stroke-width="${numberValue(coverInput.borderWidth, 2)}"
    />

${coverImageSvg(card, cover)}

    <!-- CONTORNO INTERNO -->
    <circle
      cx="${coverCx}"
      cy="${coverCy}"
      r="${coverR}"
      fill="none"
      stroke="${escapeAttr(coverInput.innerBorderColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(coverInput.innerBorderOpacity, 0.12), 0, 1)}"
      stroke-width="${numberValue(coverInput.innerBorderWidth, 2)}"
    />

    <!-- PONTO CENTRAL ESTILO VINIL -->
    <circle cx="${coverCx}" cy="${coverCy}" r="${numberValue(coverInput.centerDotRadius, 10)}" fill="${escapeAttr(coverInput.centerDotColor || "#FFFFFF")}" opacity="${clamp(numberValue(coverInput.centerDotOpacity, 0.90), 0, 1)}"/>
    <circle cx="${coverCx}" cy="${coverCy}" r="${numberValue(coverInput.centerDotInnerRadius, 4)}" fill="${escapeAttr(coverInput.centerDotInnerColor || "#111111")}"/>
  </g>

  <!-- LADO DIREITO -->
  <g font-family="${escapeAttr(baseFont)}">
    <!-- TAG -->
    <rect
      x="${numberValue(tag.x, 338)}"
      y="${numberValue(tag.y, 66)}"
      width="${numberValue(tag.width, 112)}"
      height="${numberValue(tag.height, 30)}"
      rx="${numberValue(tag.radius, 15)}"
      fill="${escapeAttr(tag.bgColor || "#FFFFFF")}"
      fill-opacity="${clamp(numberValue(tag.bgOpacity, 0.06), 0, 1)}"
      stroke="${escapeAttr(tag.borderColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(tag.borderOpacity, 0.06), 0, 1)}"
    />
    <text
      x="${numberValue(tag.textX, 394)}"
      y="${numberValue(tag.textY, 85)}"
      text-anchor="middle"
      font-family="${escapeAttr(fontFamily(card, "tag", baseFont))}"
      font-size="${numberValue(tag.fontSize, 12)}"
      font-weight="${numberValue(tag.fontWeight, 700)}"
      fill="${escapeAttr(tag.color || primaryColor)}"
      opacity="${clamp(numberValue(tag.opacity, 0.78), 0, 1)}"
      letter-spacing="${numberValue(tag.letterSpacing, 1.2)}"
    >${escapeXml(tagText)}</text>

    <!-- EDITAR TÍTULO AQUI -->
    <text
      x="${numberValue(card.text?.title?.x, 338)}"
      y="${numberValue(card.text?.title?.y, 138)}"
      font-family="${escapeAttr(fontFamily(card, "title", baseFont))}"
      font-size="${numberValue(card.text?.title?.size, 40)}"
      font-weight="${numberValue(card.text?.title?.weight, 800)}"
      fill="${escapeAttr(textColor(card, "title", primaryColor))}"
      letter-spacing="${numberValue(card.text?.title?.letterSpacing, -0.8)}"
    >${escapeXml(title)}</text>

    <!-- EDITAR SUBTEXTO AQUI -->
    <text
      x="${numberValue(card.text?.subtitle?.x, 338)}"
      y="${numberValue(card.text?.subtitle?.y, 176)}"
      font-family="${escapeAttr(fontFamily(card, "subtitle", baseFont))}"
      font-size="${numberValue(card.text?.subtitle?.size, 19)}"
      font-weight="${numberValue(card.text?.subtitle?.weight, 500)}"
      fill="${escapeAttr(textColor(card, "subtitle", secondaryColor))}"
      opacity="${clamp(numberValue(card.text?.subtitle?.opacity, 0.42), 0, 1)}"
    >${escapeXml(subtitle)}</text>

    <!-- BARRA DE TEMPO -->
    <g transform="translate(${progressX} ${progressY})">
      <!-- LINHA DE FUNDO -->
      <rect
        x="0"
        y="0"
        width="${progressWidth}"
        height="${progressHeight}"
        rx="${progressRadius}"
        fill="${escapeAttr(progress.trackColor || "#FFFFFF")}"
        opacity="${clamp(numberValue(progress.trackOpacity, 0.10), 0, 1)}"
      />

      <!-- EDITAR PROGRESSO AQUI -->
      <rect
        x="0"
        y="0"
        width="${progressFillWidth}"
        height="${progressHeight}"
        rx="${progressRadius}"
        fill="url(#accent)"
        opacity="${clamp(numberValue(progress.opacity, 0.98), 0, 1)}"
      />

      <!-- EDITAR POSIÇÃO DO INDICADOR AQUI -->
      <circle
        cx="${indicatorX}"
        cy="${numberValue(progress.indicatorY, progressHeight / 2)}"
        r="${numberValue(progress.indicatorRadius, 8)}"
        fill="${escapeAttr(progress.indicatorColor || "#FFFFFF")}"
      />
    </g>

    <!-- TEMPOS -->
    <text
      x="${numberValue(card.text?.timeStart?.x, 338)}"
      y="${numberValue(card.text?.timeStart?.y, 255)}"
      font-family="${escapeAttr(fontFamily(card, "timeStart", baseFont))}"
      font-size="${numberValue(card.text?.timeStart?.size, 15)}"
      font-weight="${numberValue(card.text?.timeStart?.weight, 700)}"
      fill="${escapeAttr(textColor(card, "timeStart", secondaryColor))}"
      opacity="${clamp(numberValue(card.text?.timeStart?.opacity, 0.56), 0, 1)}"
    >${escapeXml(timeStart)}</text>

    <text
      x="${numberValue(card.text?.timeEnd?.x, 838)}"
      y="${numberValue(card.text?.timeEnd?.y, 255)}"
      text-anchor="end"
      font-family="${escapeAttr(fontFamily(card, "timeEnd", baseFont))}"
      font-size="${numberValue(card.text?.timeEnd?.size, 15)}"
      font-weight="${numberValue(card.text?.timeEnd?.weight, 700)}"
      fill="${escapeAttr(textColor(card, "timeEnd", secondaryColor))}"
      opacity="${clamp(numberValue(card.text?.timeEnd?.opacity, 0.56), 0, 1)}"
    >${escapeXml(timeEnd)}</text>

${bottomEnabled ? `    <!-- BLOCO INFERIOR OPCIONAL -->
    <rect
      x="${numberValue(bottomBlock.x, 338)}"
      y="${numberValue(bottomBlock.y, 274)}"
      width="${numberValue(bottomBlock.width, 180)}"
      height="${numberValue(bottomBlock.height, 28)}"
      rx="${numberValue(bottomBlock.radius, 14)}"
      fill="${escapeAttr(bottomBlock.bgColor || "#FFFFFF")}"
      fill-opacity="${clamp(numberValue(bottomBlock.bgOpacity, 0.04), 0, 1)}"
      stroke="${escapeAttr(bottomBlock.borderColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(bottomBlock.borderOpacity, 0.04), 0, 1)}"
    />
    <text
      x="${numberValue(bottomBlock.textX, 428)}"
      y="${numberValue(bottomBlock.textY, 292)}"
      text-anchor="middle"
      font-family="${escapeAttr(bottomBlock.fontFamily || baseFont)}"
      font-size="${numberValue(bottomBlock.fontSize, 12)}"
      font-weight="${numberValue(bottomBlock.fontWeight, 700)}"
      fill="${escapeAttr(bottomBlock.color || primaryColor)}"
      opacity="${clamp(numberValue(bottomBlock.opacity, 0.60), 0, 1)}"
      letter-spacing="${numberValue(bottomBlock.letterSpacing, 1)}"
    >${escapeXml(bottomText)}</text>` : ""}
  </g>
</svg>`;
}

module.exports = {
  createOrbitMonoPlayerSvg
};
