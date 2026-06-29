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

function valueOf(input, fallback) {
  if (input && typeof input === "object" && "value" in input) return input.value;
  return input ?? fallback;
}

function getModeDefaults(mode) {
  if (mode === "demote" || mode === "rebaixar" || mode === "rebaixado") {
    return {
      startColor: "#F97316",
      endColor: "#7C2D12",
      status: "REBAIXADO",
      icon: "↓",
      watermark: "DEMOTE"
    };
  }

  if (mode === "neutral" || mode === "neutro") {
    return {
      startColor: "#FFFFFF",
      endColor: "#737373",
      status: "CARGO ALTERADO",
      icon: "•",
      watermark: "RANK"
    };
  }

  return {
    startColor: "#22C55E",
    endColor: "#14532D",
    status: "PROMOVIDO",
    icon: "↑",
    watermark: "PROMOTE"
  };
}

function backgroundSvg(card) {
  const bg = card.background || {};
  const href = imageSource(bg);

  if (href) {
    const overlayColor = bg.overlayColor || "#000000";
    const overlayOpacity = clamp(numberValue(bg.overlayOpacity, 0), 0, 1);
    const gridOpacity = clamp(numberValue(bg.gridOpacity, 1), 0, 1);

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

function avatarSvg(card, avatar, baseFont) {
  const href = imageSource(card.avatar);

  if (card.avatar?.enabled === false || !href) {
    return `    <circle cx="${avatar.cx}" cy="${avatar.cy}" r="${avatar.clipRadius}" fill="#1A1A1A"/>
    <text
      x="${avatar.cx}"
      y="${avatar.cy + 7}"
      text-anchor="middle"
      font-family="${escapeAttr(baseFont)}"
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

function createRankShiftNoticeSvg(card = {}) {
  const action = card.action || {};
  const mode = action.mode || card.mode || "promote";
  const modeDefaults = getModeDefaults(mode);

  const bg = card.background || {};
  const panel = card.card || card.panel || {};
  const avatarInput = card.avatar || {};
  const text = card.text || {};
  const roles = card.roles || {};
  const oldRole = card.oldRole || roles.old || text.oldRole || {};
  const newRole = card.newRole || roles.new || text.newRole || {};
  const status = card.status || action.status || {};
  const moderator = card.moderator || {};
  const date = card.date || {};
  const time = card.time || {};
  const watermark = card.watermark || {};
  const sidePanel = card.sidePanel || {};
  const sideBand = card.sideBand || {};
  const oldRoleBlock = card.oldRoleBlock || {};
  const newRoleBlock = card.newRoleBlock || {};
  const arrow = card.arrow || {};
  const progress = card.progress || {};
  const shadow = card.shadow || {};
  const fonts = card.fonts || {};

  const baseFont = fonts.base || "Inter, Roboto, Arial, sans-serif";
  const heavyFont = fonts.heavy || "Impact, Haettenschweiler, 'Arial Narrow Bold', Arial, sans-serif";

  const actionStart = action.startColor || action.color || modeDefaults.startColor;
  const actionEnd = action.endColor || action.color || modeDefaults.endColor;
  const actionIcon = valueOf(action.icon, modeDefaults.icon);

  const bgStart = bg.startColor || "#050505";
  const bgEnd = bg.endColor || "#111111";
  const panelStart = panel.startColor || "#101010";
  const panelEnd = panel.endColor || "#181818";

  const primaryColor = text.primaryColor || "#FFFFFF";
  const secondaryColor = text.secondaryColor || "#FFFFFF";

  const cardX = numberValue(panel.x, 40);
  const cardY = numberValue(panel.y, 35);
  const cardWidth = numberValue(panel.width, 880);
  const cardHeight = numberValue(panel.height, 290);
  const cardRadius = numberValue(panel.radius, 32);

  const avatar = {
    cx: numberValue(avatarInput.cx, 172),
    cy: numberValue(avatarInput.cy, 174),
    outerRadius: numberValue(avatarInput.outerRadius, 96),
    middleRadius: numberValue(avatarInput.middleRadius, 82),
    clipRadius: numberValue(avatarInput.clipRadius || avatarInput.radius, 74),
    size: numberValue(avatarInput.size, 148),
    x: numberValue(avatarInput.x, 98),
    y: numberValue(avatarInput.y, 100),
    opacity: clamp(numberValue(avatarInput.opacity, 1), 0, 1),
    placeholderText: avatarInput.placeholderText || "Perfil",
    placeholderColor: avatarInput.placeholderColor || "#FFFFFF",
    placeholderOpacity: clamp(numberValue(avatarInput.placeholderOpacity, 0.68), 0, 1)
  };

  const iconCircle = card.actionIcon || {};
  const iconCx = numberValue(iconCircle.cx, 232);
  const iconCy = numberValue(iconCircle.cy, 232);

  const statusX = numberValue(status.x, 340);
  const statusY = numberValue(status.y, 64);
  const statusWidth = numberValue(status.width, 156);
  const statusHeight = numberValue(status.height, 34);

  const sidePanelX = numberValue(sidePanel.x, 802);
  const sidePanelY = numberValue(sidePanel.y, 70);
  const sidePanelWidth = numberValue(sidePanel.width, 82);
  const sidePanelHeight = numberValue(sidePanel.height, 218);

  const titleText = valueOf(text.title, "Cargo atualizado");
  const userNameText = valueOf(text.userName, "Nome");
  const groupNameText = valueOf(text.groupName, "Nome do grupo");
  const statusText = valueOf(status.value, modeDefaults.status);
  const oldRoleText = valueOf(oldRole.value, "Cargo antigo");
  const newRoleText = valueOf(newRole.value, "Cargo novo");
  const moderatorText = valueOf(moderator.value, "Admin");
  const dateText = valueOf(date.value, "00/00/0000");
  const timeText = valueOf(time.value, "00:00");
  const watermarkText = valueOf(watermark.value, modeDefaults.watermark);

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="960"
  height="360"
  viewBox="0 0 960 360"
  role="img"
  aria-label="Card de promoção ou rebaixamento"
  style="width:100%;height:auto;display:block"
  data-template="rank_shift_notice"
  data-category="moderation"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="bg" x1="0" y1="0" x2="960" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(bgStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(bgEnd)}"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="cardBg" x1="40" y1="35" x2="920" y2="325" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(panelStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(panelEnd)}"/>
    </linearGradient>

    <!-- EDITAR COR DA AÇÃO AQUI -->
    <linearGradient id="actionColor" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(actionStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(actionEnd)}"/>
    </linearGradient>

    <!-- RECORTE DA FOTO -->
    <clipPath id="avatarClip">
      <circle cx="${avatar.cx}" cy="${avatar.cy}" r="${avatar.clipRadius}"/>
    </clipPath>

    <!-- SOMBRA DO CARD -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow
        dx="${numberValue(shadow.dx, 0)}"
        dy="${numberValue(shadow.dy, 16)}"
        stdDeviation="${numberValue(shadow.blur, 20)}"
        flood-color="${escapeAttr(shadow.color || "#000000")}"
        flood-opacity="${clamp(numberValue(shadow.opacity, 0.38), 0, 1)}"
      />
    </filter>

    <!-- SOMBRA DO TEXTO -->
    <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.50"/>
    </filter>

    <!-- PADRÃO SUTIL -->
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0H0V26" fill="none" stroke="#FFFFFF" stroke-opacity="0.022" stroke-width="1"/>
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
    fill="url(#cardBg)"
    stroke="${escapeAttr(panel.borderColor || "#FFFFFF")}"
    stroke-opacity="${clamp(numberValue(panel.borderOpacity, 0.08), 0, 1)}"
    stroke-width="${numberValue(panel.borderWidth, 1.5)}"
    filter="url(#shadow)"
  />

  <!-- FAIXA LATERAL DA AÇÃO -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${numberValue(sideBand.width, 12)}"
    height="${cardHeight}"
    rx="${numberValue(sideBand.radius, 6)}"
    fill="url(#actionColor)"
    opacity="${clamp(numberValue(sideBand.opacity, 1), 0, 1)}"
  />

  <!-- MARCA D'ÁGUA EDITÁVEL -->
  ${watermark.enabled === false ? "" : `<text
    x="${numberValue(watermark.x, 672)}"
    y="${numberValue(watermark.y, 190)}"
    text-anchor="middle"
    font-family="${escapeAttr(heavyFont)}"
    font-size="${numberValue(watermark.size, 92)}"
    font-weight="900"
    fill="${escapeAttr(watermark.color || "#FFFFFF")}"
    opacity="${clamp(numberValue(watermark.opacity, 0.030), 0, 1)}"
    letter-spacing="${numberValue(watermark.letterSpacing, 5)}"
    transform="rotate(${numberValue(watermark.rotate, -9)} ${numberValue(watermark.x, 672)} ${numberValue(watermark.y, 190)})"
  >${escapeXml(watermarkText)}</text>`}

  <!-- FOTO DO USUÁRIO -->
  <g>
    <circle
      cx="${avatar.cx}"
      cy="${avatar.cy}"
      r="${avatar.outerRadius}"
      fill="${escapeAttr(avatarInput.outerFill || "#0A0A0A")}"
      stroke="url(#actionColor)"
      stroke-opacity="${clamp(numberValue(avatarInput.outerStrokeOpacity, 0.75), 0, 1)}"
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

${avatarSvg(card, avatar, baseFont)}

    <circle
      cx="${avatar.cx}"
      cy="${avatar.cy}"
      r="${avatar.clipRadius}"
      fill="none"
      stroke="${escapeAttr(avatarInput.ringColor || "#FFFFFF")}"
      stroke-opacity="${clamp(numberValue(avatarInput.ringOpacity, 0.14), 0, 1)}"
      stroke-width="${numberValue(avatarInput.ringWidth, 2)}"
    />

    <!-- ÍCONE CENTRAL DA AÇÃO -->
    <circle
      cx="${iconCx}"
      cy="${iconCy}"
      r="${numberValue(iconCircle.radius, 30)}"
      fill="${escapeAttr(iconCircle.bgColor || "#080808")}"
      stroke="url(#actionColor)"
      stroke-width="${numberValue(iconCircle.borderWidth, 3)}"
    />
    <text
      id="actionIcon"
      x="${numberValue(iconCircle.textX, iconCx)}"
      y="${numberValue(iconCircle.textY, iconCy + 11)}"
      text-anchor="middle"
      font-family="${escapeAttr(iconCircle.fontFamily || baseFont)}"
      font-size="${numberValue(iconCircle.size, 34)}"
      font-weight="900"
      fill="${escapeAttr(iconCircle.color || "#FFFFFF")}"
    >${escapeXml(actionIcon)}</text>
  </g>

  <!-- DIVISÓRIA -->
  <rect x="304" y="72" width="1.5" height="220" fill="#FFFFFF" opacity="0.08"/>

  <!-- CONTEÚDO PRINCIPAL -->
  <g font-family="${escapeAttr(baseFont)}" filter="url(#textShadow)">
    <!-- EDITAR STATUS AQUI -->
    <g>
      <rect
        x="${statusX}"
        y="${statusY}"
        width="${statusWidth}"
        height="${statusHeight}"
        rx="${numberValue(status.radius, 17)}"
        fill="url(#actionColor)"
        fill-opacity="${clamp(numberValue(status.bgOpacity, 0.22), 0, 1)}"
        stroke="${escapeAttr(status.borderColor || "#FFFFFF")}"
        stroke-opacity="${clamp(numberValue(status.borderOpacity, 0.10), 0, 1)}"
      />
      <text
        id="actionStatus"
        x="${statusX + statusWidth / 2}"
        y="${statusY + 22}"
        text-anchor="middle"
        font-size="${numberValue(status.size, 13)}"
        font-weight="850"
        fill="${escapeAttr(status.color || primaryColor)}"
        letter-spacing="1.4"
      >${escapeXml(statusText)}</text>
    </g>

    <!-- EDITAR TÍTULO AQUI -->
    <text
      id="title"
      x="${numberValue(text.title?.x, 340)}"
      y="${numberValue(text.title?.y, 144)}"
      font-size="${numberValue(text.title?.size, 41)}"
      font-weight="900"
      fill="${escapeAttr(text.title?.color || primaryColor)}"
      letter-spacing="-0.8"
    >${escapeXml(titleText)}</text>

    <!-- EDITAR NOME AQUI -->
    <text
      id="userName"
      x="${numberValue(text.userName?.x, 340)}"
      y="${numberValue(text.userName?.y, 186)}"
      font-size="${numberValue(text.userName?.size, 25)}"
      font-weight="750"
      fill="${escapeAttr(text.userName?.color || primaryColor)}"
      opacity="${clamp(numberValue(text.userName?.opacity, 0.88), 0, 1)}"
    >${escapeXml(userNameText)}</text>

    <!-- EDITAR NOME DO GRUPO AQUI -->
    <text
      id="groupName"
      x="${numberValue(text.groupName?.x, 340)}"
      y="${numberValue(text.groupName?.y, 219)}"
      font-size="${numberValue(text.groupName?.size, 18)}"
      font-weight="600"
      fill="${escapeAttr(text.groupName?.color || secondaryColor)}"
      opacity="${clamp(numberValue(text.groupName?.opacity, 0.56), 0, 1)}"
    >${escapeXml(groupNameText)}</text>

    <!-- BLOCO DE CARGOS -->
    <g>
      <!-- CARGO ANTIGO -->
      <rect
        x="${numberValue(oldRoleBlock.x, 340)}"
        y="${numberValue(oldRoleBlock.y, 242)}"
        width="${numberValue(oldRoleBlock.width, 176)}"
        height="${numberValue(oldRoleBlock.height, 46)}"
        rx="${numberValue(oldRoleBlock.radius, 15)}"
        fill="${escapeAttr(oldRoleBlock.bgColor || "#FFFFFF")}"
        fill-opacity="${clamp(numberValue(oldRoleBlock.bgOpacity, 0.045), 0, 1)}"
        stroke="${escapeAttr(oldRoleBlock.borderColor || "#FFFFFF")}"
        stroke-opacity="${clamp(numberValue(oldRoleBlock.borderOpacity, 0.06), 0, 1)}"
      />

      <text
        x="${numberValue(oldRoleBlock.labelX, 360)}"
        y="${numberValue(oldRoleBlock.labelY, 261)}"
        font-size="11"
        font-weight="800"
        fill="${escapeAttr(oldRoleBlock.labelColor || secondaryColor)}"
        opacity="${clamp(numberValue(oldRoleBlock.labelOpacity, 0.38), 0, 1)}"
        letter-spacing="1"
      >${escapeXml(oldRoleBlock.label || "ANTES")}</text>

      <!-- EDITAR CARGO ANTIGO AQUI -->
      <text
        id="oldRole"
        x="${numberValue(oldRole.x, 360)}"
        y="${numberValue(oldRole.y, 280)}"
        font-size="${numberValue(oldRole.size, 16)}"
        font-weight="750"
        fill="${escapeAttr(oldRole.color || primaryColor)}"
        opacity="${clamp(numberValue(oldRole.opacity, 0.78), 0, 1)}"
      >${escapeXml(oldRoleText)}</text>

      <!-- SETA -->
      <path
        d="M${numberValue(arrow.x1, 538)} ${numberValue(arrow.y1, 265)}H${numberValue(arrow.x2, 578)}"
        stroke="${escapeAttr(arrow.color || "url(#actionColor)")}"
        stroke-width="${numberValue(arrow.width, 3)}"
        stroke-linecap="round"
      />
      <path
        d="M${numberValue(arrow.headX1, 568)} ${numberValue(arrow.headY1, 255)}L${numberValue(arrow.headX2, 578)} ${numberValue(arrow.headY2, 265)}L${numberValue(arrow.headX3, 568)} ${numberValue(arrow.headY3, 275)}"
        fill="none"
        stroke="${escapeAttr(arrow.color || "url(#actionColor)")}"
        stroke-width="${numberValue(arrow.width, 3)}"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- CARGO NOVO -->
      <rect
        x="${numberValue(newRoleBlock.x, 600)}"
        y="${numberValue(newRoleBlock.y, 242)}"
        width="${numberValue(newRoleBlock.width, 176)}"
        height="${numberValue(newRoleBlock.height, 46)}"
        rx="${numberValue(newRoleBlock.radius, 15)}"
        fill="url(#actionColor)"
        fill-opacity="${clamp(numberValue(newRoleBlock.bgOpacity, 0.18), 0, 1)}"
        stroke="${escapeAttr(newRoleBlock.borderColor || "#FFFFFF")}"
        stroke-opacity="${clamp(numberValue(newRoleBlock.borderOpacity, 0.08), 0, 1)}"
      />

      <text
        x="${numberValue(newRoleBlock.labelX, 620)}"
        y="${numberValue(newRoleBlock.labelY, 261)}"
        font-size="11"
        font-weight="800"
        fill="${escapeAttr(newRoleBlock.labelColor || secondaryColor)}"
        opacity="${clamp(numberValue(newRoleBlock.labelOpacity, 0.48), 0, 1)}"
        letter-spacing="1"
      >${escapeXml(newRoleBlock.label || "AGORA")}</text>

      <!-- EDITAR CARGO NOVO AQUI -->
      <text
        id="newRole"
        x="${numberValue(newRole.x, 620)}"
        y="${numberValue(newRole.y, 280)}"
        font-size="${numberValue(newRole.size, 16)}"
        font-weight="850"
        fill="${escapeAttr(newRole.color || primaryColor)}"
        opacity="${clamp(numberValue(newRole.opacity, 0.92), 0, 1)}"
      >${escapeXml(newRoleText)}</text>
    </g>
  </g>

  <!-- PAINEL LATERAL -->
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
      y="109"
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
      y="139"
      text-anchor="middle"
      font-size="${numberValue(moderator.size, 16)}"
      font-weight="800"
      fill="${escapeAttr(moderator.color || primaryColor)}"
      opacity="${clamp(numberValue(moderator.opacity, 0.86), 0, 1)}"
    >${escapeXml(moderatorText)}</text>

    <rect x="822" y="162" width="42" height="1" fill="#FFFFFF" opacity="0.12"/>

    <!-- EDITAR DATA AQUI -->
    <text
      x="${sidePanelX + sidePanelWidth / 2}"
      y="193"
      text-anchor="middle"
      font-size="11"
      font-weight="800"
      fill="${escapeAttr(secondaryColor)}"
      opacity="0.42"
      letter-spacing="1.2"
    >DATA</text>

    <text
      id="date"
      x="${sidePanelX + sidePanelWidth / 2}"
      y="221"
      text-anchor="middle"
      font-size="${numberValue(date.size, 13)}"
      font-weight="700"
      fill="${escapeAttr(date.color || primaryColor)}"
      opacity="${clamp(numberValue(date.opacity, 0.62), 0, 1)}"
    >${escapeXml(dateText)}</text>

    <!-- EDITAR HORÁRIO AQUI -->
    <text
      id="time"
      x="${sidePanelX + sidePanelWidth / 2}"
      y="249"
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
      x="${numberValue(progress.x, 340)}"
      y="${numberValue(progress.y, 304)}"
      width="${numberValue(progress.width, 330)}"
      height="${numberValue(progress.height, 4)}"
      rx="${numberValue(progress.radius, 999)}"
      fill="${escapeAttr(progress.baseColor || "#FFFFFF")}"
      opacity="${clamp(numberValue(progress.baseOpacity, 0.10), 0, 1)}"
    />
    <rect
      x="${numberValue(progress.x, 340)}"
      y="${numberValue(progress.y, 304)}"
      width="${numberValue(progress.fillWidth, 128)}"
      height="${numberValue(progress.height, 4)}"
      rx="${numberValue(progress.radius, 999)}"
      fill="url(#actionColor)"
      opacity="${clamp(numberValue(progress.fillOpacity, 0.98), 0, 1)}"
    />
  </g>
</svg>`;
}

module.exports = {
  createRankShiftNoticeSvg
};
