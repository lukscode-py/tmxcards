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

function valueOf(target, fallback) {
  if (target && typeof target === "object" && "value" in target) return target.value;
  return target ?? fallback;
}

function backgroundSvg(card) {
  const bg = card.background || {};
  const href = imageSource(bg);

  if (href) {
    const overlayColor = bg.overlayColor || "#000000";
    const overlayOpacity = clamp(numberValue(bg.overlayOpacity, 0), 0, 1);
    const gridOpacity = clamp(numberValue(bg.gridOpacity ?? bg.patternOpacity, 1), 0, 1);

    return `  <!-- FUNDO PRINCIPAL -->
  <image
    href="${escapeAttr(href)}"
    x="0"
    y="0"
    width="960"
    height="360"
    preserveAspectRatio="xMidYMid slice"
  />
  <rect width="960" height="360" fill="${escapeAttr(overlayColor)}" opacity="${overlayOpacity}"/>
  <rect width="960" height="360" fill="url(#grid)" opacity="${gridOpacity}"/>`;
  }

  return `  <!-- FUNDO PRINCIPAL -->
  <rect width="960" height="360" fill="url(#bg)"/>
  <rect width="960" height="360" fill="url(#grid)"/>`;
}

function avatarImageSvg(card, avatar) {
  const href = imageSource(card.avatar);

  if (card.avatar?.enabled === false || !href) {
    return `    <circle cx="${avatar.cx}" cy="${avatar.cy}" r="${avatar.innerRadius}" fill="#1A1A1A"/>
    <text
      x="${avatar.cx}"
      y="${avatar.cy + 7}"
      text-anchor="middle"
      font-family="${escapeAttr(avatar.font)}"
      font-size="20"
      font-weight="700"
      fill="${escapeAttr(avatar.placeholderColor)}"
      opacity="${avatar.placeholderOpacity}"
    >${escapeXml(avatar.placeholderText)}</text>`;
  }

  return `    <!-- EDITAR FOTO DO USUÁRIO AQUI -->
    <image
      id="userAvatar"
      href="${escapeAttr(href)}"
      x="${avatar.x}"
      y="${avatar.y}"
      width="${avatar.size}"
      height="${avatar.size}"
      preserveAspectRatio="xMidYMid slice"
      clip-path="url(#avatarClip)"
      opacity="${avatar.opacity}"
    />`;
}

function banIconSvg(icon) {
  if (icon.enabled === false) return "";

  if (icon.text) {
    return `    <!-- ÍCONE DE BAN -->
    <text
      x="${icon.textX}"
      y="${icon.textY}"
      text-anchor="middle"
      font-family="${escapeAttr(icon.font)}"
      font-size="${icon.textSize}"
      font-weight="900"
      fill="${escapeAttr(icon.stroke)}"
      opacity="${icon.textOpacity}"
    >${escapeXml(icon.text)}</text>`;
  }

  return `    <!-- ÍCONE DE BAN -->
    <circle
      cx="${icon.cx}"
      cy="${icon.cy}"
      r="${icon.circleRadius}"
      fill="${escapeAttr(icon.circleFill)}"
      fill-opacity="${icon.circleOpacity}"
      stroke="${escapeAttr(icon.stroke)}"
      stroke-width="${icon.strokeWidth}"
    />
    <path
      d="M${icon.x1} ${icon.y1} L${icon.x2} ${icon.y2}"
      stroke="${escapeAttr(icon.stroke)}"
      stroke-width="${icon.lineWidth}"
      stroke-linecap="round"
    />`;
}

function createCrimsonAuthorityBanSvg(card = {}) {
  const bg = card.background || {};
  const panel = card.panel || {};
  const alert = card.alert || {};
  const avatarInput = card.avatar || {};
  const text = card.text || {};
  const status = card.status || {};
  const reason = card.reason || {};
  const moderator = card.moderator || {};
  const date = card.date || {};
  const time = card.time || {};
  const watermark = card.watermark || {};
  const iconInput = card.icon || {};
  const sidePanel = card.sidePanel || {};
  const sideBand = card.sideBand || {};
  const progress = card.progress || {};
  const shadow = card.shadow || {};
  const fonts = card.fonts || {};

  const baseFont = fonts.base || "Inter, Roboto, Arial, sans-serif";
  const heavyFont = fonts.heavy || "Impact, Haettenschweiler, 'Arial Narrow Bold', Arial, sans-serif";

  const bgStart = bg.startColor || "#050505";
  const bgEnd = bg.endColor || "#140808";
  const panelStart = panel.startColor || "#101010";
  const panelEnd = panel.endColor || "#1A0B0B";
  const alertStart = alert.startColor || alert.color || "#FF4D4D";
  const alertEnd = alert.endColor || alert.color || "#7F1D1D";

  const primaryColor = text.primaryColor || "#FFFFFF";
  const secondaryColor = text.secondaryColor || "#FFFFFF";

  const cardX = numberValue(panel.x, 40);
  const cardY = numberValue(panel.y, 35);
  const cardWidth = numberValue(panel.width, 880);
  const cardHeight = numberValue(panel.height, 290);
  const cardRadius = numberValue(panel.radius, 32);

  const avatar = {
    cx: numberValue(avatarInput.cx, 178),
    cy: numberValue(avatarInput.cy, 172),
    outerRadius: numberValue(avatarInput.outerRadius, 98),
    middleRadius: numberValue(avatarInput.middleRadius, 84),
    innerRadius: numberValue(avatarInput.innerRadius, 76),
    size: numberValue(avatarInput.size, 152),
    x: numberValue(avatarInput.x, 102),
    y: numberValue(avatarInput.y, 96),
    opacity: clamp(numberValue(avatarInput.opacity, 1), 0, 1),
    placeholderText: avatarInput.placeholderText || "Perfil",
    placeholderColor: avatarInput.placeholderColor || "#FFFFFF",
    placeholderOpacity: clamp(numberValue(avatarInput.placeholderOpacity, 0.68), 0, 1),
    font: avatarInput.fontFamily || baseFont
  };

  const icon = {
    enabled: iconInput.enabled !== false,
    cx: numberValue(iconInput.cx, avatar.cx),
    cy: numberValue(iconInput.cy, avatar.cy),
    circleRadius: numberValue(iconInput.circleRadius, 45),
    circleFill: iconInput.circleFill || "#000000",
    circleOpacity: clamp(numberValue(iconInput.circleOpacity, 0.48), 0, 1),
    stroke: iconInput.stroke || alert.color || "#EF4444",
    strokeWidth: numberValue(iconInput.strokeWidth, 5),
    x1: numberValue(iconInput.x1, 148),
    y1: numberValue(iconInput.y1, 202),
    x2: numberValue(iconInput.x2, 208),
    y2: numberValue(iconInput.y2, 142),
    lineWidth: numberValue(iconInput.lineWidth, 7),
    text: iconInput.text || null,
    textX: numberValue(iconInput.textX, avatar.cx),
    textY: numberValue(iconInput.textY, avatar.cy + 12),
    textSize: numberValue(iconInput.textSize, 42),
    textOpacity: clamp(numberValue(iconInput.textOpacity, 0.92), 0, 1),
    font: iconInput.fontFamily || heavyFont
  };

  const statusText = valueOf(status.value, "BANIMENTO");
  const titleText = valueOf(text.title, "Usuário banido");
  const userNameText = valueOf(text.userName, "Nome");
  const groupNameText = valueOf(text.groupName, "Nome do grupo");
  const reasonText = valueOf(reason.value, "Motivo: sub text");
  const moderatorText = valueOf(moderator.value, "Admin");
  const dateText = valueOf(date.value, "00/00/0000");
  const timeText = valueOf(time.value, "00:00");
  const watermarkText = valueOf(watermark.value, "BAN");

  const statusX = numberValue(status.x, 342);
  const statusY = numberValue(status.y, 66);
  const statusWidth = numberValue(status.width, 152);
  const statusHeight = numberValue(status.height, 34);

  const sidePanelX = numberValue(sidePanel.x, 790);
  const sidePanelY = numberValue(sidePanel.y, 70);
  const sidePanelWidth = numberValue(sidePanel.width, 92);
  const sidePanelHeight = numberValue(sidePanel.height, 218);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="960"
  height="360"
  viewBox="0 0 960 360"
  role="img"
  aria-label="Card de banimento"
  style="width:100%;height:auto;display:block"
  data-template="crimson_authority_ban"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bg" x1="0" y1="0" x2="960" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(bgStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(bgEnd)}"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="panelBg" x1="40" y1="35" x2="920" y2="325" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(panelStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(panelEnd)}"/>
    </linearGradient>

    <!-- EDITAR COR DE ALERTA AQUI -->
    <linearGradient id="danger" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(alertStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(alertEnd)}"/>
    </linearGradient>

    <!-- RECORTE DA FOTO -->
    <clipPath id="avatarClip">
      <circle cx="${avatar.cx}" cy="${avatar.cy}" r="${avatar.innerRadius}"/>
    </clipPath>

    <!-- SOMBRA DO CARD -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="${numberValue(shadow.dx, 0)}"
        dy="${numberValue(shadow.dy, 16)}"
        stdDeviation="${numberValue(shadow.blur, 20)}"
        flood-color="${escapeAttr(shadow.color || "#000000")}"
        flood-opacity="${clamp(numberValue(shadow.opacity, 0.42), 0, 1)}"
      />
    </filter>

    <!-- SOMBRA DO TEXTO -->
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.55"/>
    </filter>

    <!-- PADRÃO SUTIL DO FUNDO -->
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="#FFFFFF" stroke-opacity="0.025" stroke-width="1"/>
    </pattern>
  </defs>

${backgroundSvg(card)}

  <!-- CARD PRINCIPAL -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${cardWidth}"
    height="${cardHeight}"
    rx="${cardRadius}"
    fill="url(#panelBg)"
    stroke="${escapeAttr(panel.borderColor || "#FFFFFF")}"
    stroke-opacity="${clamp(numberValue(panel.borderOpacity, 0.08), 0, 1)}"
    stroke-width="${numberValue(panel.borderWidth, 1.5)}"
    filter="url(#shadow)"
  />

  <!-- FAIXA DE ALERTA LATERAL -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${numberValue(sideBand.width, 12)}"
    height="${cardHeight}"
    rx="${numberValue(sideBand.radius, 6)}"
    fill="url(#danger)"
    opacity="${clamp(numberValue(sideBand.opacity, 1), 0, 1)}"
  />

  <!-- MARCA D'ÁGUA OPCIONAL -->
  ${watermark.enabled === false ? "" : `<text
    x="${numberValue(watermark.x, 672)}"
    y="${numberValue(watermark.y, 185)}"
    text-anchor="middle"
    font-family="${escapeAttr(heavyFont)}"
    font-size="${numberValue(watermark.size, 108)}"
    font-weight="900"
    fill="${escapeAttr(watermark.color || "#FFFFFF")}"
    opacity="${clamp(numberValue(watermark.opacity, 0.035), 0, 1)}"
    letter-spacing="${numberValue(watermark.letterSpacing, 5)}"
    transform="rotate(${numberValue(watermark.rotate, -10)} ${numberValue(watermark.x, 672)} ${numberValue(watermark.y, 185)})"
  >${escapeXml(watermarkText)}</text>`}

  <!-- BLOCO DO PERFIL -->
  <g>
    <circle
      cx="${avatar.cx}"
      cy="${avatar.cy}"
      r="${avatar.outerRadius}"
      fill="${escapeAttr(avatarInput.outerFill || "#0A0A0A")}"
      stroke="${escapeAttr(avatarInput.outerStroke || alert.color || "#EF4444")}"
      stroke-opacity="${clamp(numberValue(avatarInput.outerStrokeOpacity, 0.55), 0, 1)}"
      stroke-width="${numberValue(avatarInput.outerStrokeWidth, 3)}"
    />

    <circle
      cx="${avatar.cx}"
      cy="${avatar.cy}"
      r="${avatar.middleRadius}"
      fill="${escapeAttr(avatarInput.innerFill || "#121212")}"
      stroke="${escapeAttr(avatarInput.innerStroke || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(avatarInput.innerStrokeOpacity, 0.08), 0, 1)}"
      stroke-width="${numberValue(avatarInput.innerStrokeWidth, 2)}"
    />

${avatarImageSvg(card, avatar)}

    <!-- ESCURECIMENTO SOBRE A FOTO -->
    <circle cx="${avatar.cx}" cy="${avatar.cy}" r="${avatar.innerRadius}" fill="${escapeAttr(avatarInput.overlayColor || "#000000")}" opacity="${clamp(numberValue(avatarInput.overlayOpacity, 0.18), 0, 1)}"/>

${banIconSvg(icon)}

    <circle
      cx="${avatar.cx}"
      cy="${avatar.cy}"
      r="${avatar.innerRadius}"
      fill="none"
      stroke="${escapeAttr(avatarInput.ringColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(avatarInput.ringOpacity, 0.14), 0, 1)}"
      stroke-width="${numberValue(avatarInput.ringWidth, 2)}"
    />
  </g>

  <!-- DIVISÓRIA -->
  <rect x="306" y="72" width="1.5" height="220" fill="#FFFFFF" opacity="0.08"/>

  <!-- CONTEÚDO PRINCIPAL -->
  <g font-family="${escapeAttr(baseFont)}" filter="url(#textShadow)">
    <!-- EDITAR STATUS/TAG AQUI -->
    <g>
      <rect
        x="${statusX}"
        y="${statusY}"
        width="${statusWidth}"
        height="${statusHeight}"
        rx="${numberValue(status.radius, 17)}"
        fill="${escapeAttr(status.bgColor || alert.color || "#EF4444")}"
        fill-opacity="${clamp(numberValue(status.bgOpacity, 0.12), 0, 1)}"
        stroke="${escapeAttr(status.borderColor || alert.color || "#EF4444")}"
        stroke-opacity="${clamp(numberValue(status.borderOpacity, 0.38), 0, 1)}"
      />
      <text
        id="banStatus"
        x="${statusX + statusWidth / 2}"
        y="${statusY + 22}"
        text-anchor="middle"
        font-size="${numberValue(status.size, 13)}"
        font-weight="800"
        fill="${escapeAttr(status.color || primaryColor)}"
        letter-spacing="1.4"
      >${escapeXml(statusText)}</text>
    </g>

    <!-- EDITAR TÍTULO AQUI -->
    <text
      id="title"
      x="${numberValue(text.title?.x, 342)}"
      y="${numberValue(text.title?.y, 145)}"
      font-size="${numberValue(text.title?.size, 42)}"
      font-weight="900"
      fill="${escapeAttr(text.title?.color || primaryColor)}"
      letter-spacing="-0.8"
    >${escapeXml(titleText)}</text>

    <!-- EDITAR NOME AQUI -->
    <text
      id="userName"
      x="${numberValue(text.userName?.x, 342)}"
      y="${numberValue(text.userName?.y, 188)}"
      font-size="${numberValue(text.userName?.size, 25)}"
      font-weight="750"
      fill="${escapeAttr(text.userName?.color || primaryColor)}"
      opacity="${clamp(numberValue(text.userName?.opacity, 0.88), 0, 1)}"
    >${escapeXml(userNameText)}</text>

    <!-- EDITAR NOME DO GRUPO AQUI -->
    <text
      id="groupName"
      x="${numberValue(text.groupName?.x, 342)}"
      y="${numberValue(text.groupName?.y, 222)}"
      font-size="${numberValue(text.groupName?.size, 18)}"
      font-weight="600"
      fill="${escapeAttr(text.groupName?.color || secondaryColor)}"
      opacity="${clamp(numberValue(text.groupName?.opacity, 0.56), 0, 1)}"
    >${escapeXml(groupNameText)}</text>

    <!-- EDITAR MOTIVO AQUI -->
    <g>
      <rect
        x="${numberValue(reason.x, 342)}"
        y="${numberValue(reason.y, 242)}"
        width="${numberValue(reason.width, 430)}"
        height="${numberValue(reason.height, 42)}"
        rx="${numberValue(reason.radius, 14)}"
        fill="${escapeAttr(reason.bgColor || "#FFFFFF")}"
        fill-opacity="${clamp(numberValue(reason.bgOpacity, 0.045), 0, 1)}"
        stroke="${escapeAttr(reason.borderColor || "#FFFFFF")}"
        stroke-opacity="${clamp(numberValue(reason.borderOpacity, 0.055), 0, 1)}"
      />
      <text
        id="banReason"
        x="${numberValue(reason.textX, 362)}"
        y="${numberValue(reason.textY, 269)}"
        font-size="${numberValue(reason.size, 16)}"
        font-weight="600"
        fill="${escapeAttr(reason.color || primaryColor)}"
        opacity="${clamp(numberValue(reason.opacity, 0.68), 0, 1)}"
      >${escapeXml(reasonText)}</text>
    </g>
  </g>

  <!-- PAINEL LATERAL SEM CASE -->
  <g font-family="${escapeAttr(baseFont)}">
    <rect
      x="${sidePanelX}"
      y="${sidePanelY}"
      width="${sidePanelWidth}"
      height="${sidePanelHeight}"
      rx="${numberValue(sidePanel.radius, 24)}"
      fill="${escapeAttr(sidePanel.fill || "#070707")}"
      stroke="${escapeAttr(sidePanel.stroke || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(sidePanel.strokeOpacity, 0.07), 0, 1)}"
    />

    <!-- EDITAR MODERADOR AQUI -->
    <text
      x="${sidePanelX + sidePanelWidth / 2}"
      y="111"
      text-anchor="middle"
      font-size="11"
      font-weight="800"
      fill="${escapeAttr(secondaryColor)}"
      opacity="0.42"
      letter-spacing="1.2"
    >MOD</text>

    <text
      id="moderator"
      x="${sidePanelX + sidePanelWidth / 2}"
      y="142"
      text-anchor="middle"
      font-size="${numberValue(moderator.size, 17)}"
      font-weight="800"
      fill="${escapeAttr(moderator.color || primaryColor)}"
      opacity="${clamp(numberValue(moderator.opacity, 0.86), 0, 1)}"
    >${escapeXml(moderatorText)}</text>

    <rect x="812" y="166" width="48" height="1" fill="#FFFFFF" opacity="0.12"/>

    <!-- EDITAR DATA AQUI -->
    <text
      x="${sidePanelX + sidePanelWidth / 2}"
      y="198"
      text-anchor="middle"
      font-size="11"
      font-weight="800"
      fill="${escapeAttr(secondaryColor)}"
      opacity="0.42"
      letter-spacing="1.2"
    >DATA</text>

    <text
      id="banDate"
      x="${sidePanelX + sidePanelWidth / 2}"
      y="226"
      text-anchor="middle"
      font-size="${numberValue(date.size, 13)}"
      font-weight="700"
      fill="${escapeAttr(date.color || primaryColor)}"
      opacity="${clamp(numberValue(date.opacity, 0.62), 0, 1)}"
    >${escapeXml(dateText)}</text>

    <!-- EDITAR HORÁRIO AQUI -->
    <text
      id="banTime"
      x="${sidePanelX + sidePanelWidth / 2}"
      y="253"
      text-anchor="middle"
      font-size="${numberValue(time.size, 13)}"
      font-weight="700"
      fill="${escapeAttr(time.color || primaryColor)}"
      opacity="${clamp(numberValue(time.opacity, 0.42), 0, 1)}"
    >${escapeXml(timeText)}</text>
  </g>

  <!-- LINHA DE DESTAQUE INFERIOR -->
  <g>
    <rect
      x="${numberValue(progress.x, 342)}"
      y="${numberValue(progress.y, 302)}"
      width="${numberValue(progress.width, 330)}"
      height="${numberValue(progress.height, 4)}"
      rx="${numberValue(progress.radius, 999)}"
      fill="${escapeAttr(progress.baseColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(progress.baseOpacity, 0.10), 0, 1)}"
    />
    <rect
      x="${numberValue(progress.x, 342)}"
      y="${numberValue(progress.y, 302)}"
      width="${numberValue(progress.fillWidth, 118)}"
      height="${numberValue(progress.height, 4)}"
      rx="${numberValue(progress.radius, 999)}"
      fill="${escapeAttr(progress.fillColor || alert.color || "#EF4444")}"
      opacity="${clamp(numberValue(progress.fillOpacity, 0.95), 0, 1)}"
    />
  </g>
</svg>`;
}

module.exports = {
  createCrimsonAuthorityBanSvg
};
