const { imageHref } = require("./image-source");

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function valueOf(value) {
  if (isObject(value) && Object.prototype.hasOwnProperty.call(value, "value")) {
    return value.value;
  }

  return value;
}

function firstValue(...values) {
  for (const value of values) {
    const resolved = valueOf(value);

    if (resolved !== undefined && resolved !== null && resolved !== "") {
      return resolved;
    }
  }

  return undefined;
}

function numberValue(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function textValue(card, key, fallback = "") {
  const text = card.text || {};
  const user = card.user || {};
  const group = card.group || {};

  if (key === "title") return firstValue(card.title, text.title, fallback);
  if (key === "subtitle") return firstValue(card.subtitle, text.subtitle, fallback);
  if (key === "name") return firstValue(card.name, user.name, text.name, fallback);
  if (key === "group") {
    return firstValue(
      card.groupName,
      typeof card.group === "string" ? card.group : undefined,
      group.name,
      group.title,
      text.group,
      fallback
    );
  }
  if (key === "main") return firstValue(card.main, text.main, fallback);
  if (key === "footer") return firstValue(card.footer, text.footer, fallback);

  return fallback;
}

function attr(name, value) {
  if (value === undefined || value === null || value === false || value === "") return "";
  return ` ${name}="${escapeXml(value)}"`;
}

function styleAttrs(node = {}) {
  const style = node.style || {};

  return [
    attr("opacity", firstValue(node.opacity, style.opacity)),
    attr("fill", firstValue(node.fill, node.color, style.fill)),
    attr("stroke", firstValue(node.stroke, style.stroke)),
    attr("stroke-width", firstValue(node.strokeWidth, style.strokeWidth)),
    attr("stroke-opacity", firstValue(node.strokeOpacity, style.strokeOpacity)),
    attr("filter", node.filter),
    attr("transform", node.transform),
    attr("class", node.className || node.class),
    attr("id", node.id)
  ].join("");
}

function fontAttrs(node = {}, card = {}) {
  const theme = card.theme || {};

  return [
    attr("font-family", firstValue(node.fontFamily, node.font, theme.fontFamily, "Inter, Arial, sans-serif")),
    attr("font-size", firstValue(node.fontSize, 18)),
    attr("font-weight", firstValue(node.fontWeight, node.weight, 700)),
    attr("letter-spacing", node.letterSpacing),
    attr("text-anchor", firstValue(node.textAnchor, node.anchor, "start"))
  ].join("");
}

function wrapText(text, maxWidth, fontSize) {
  const raw = String(text ?? "");
  const limit = numberValue(maxWidth, 0);

  if (!limit) return [raw];

  const approxChar = numberValue(fontSize, 18) * 0.56;
  const maxChars = Math.max(1, Math.floor(limit / approxChar));
  const words = raw.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);

  return lines;
}

function renderPattern(card, width, height) {
  const background = card.background || {};
  const pattern = firstValue(background.pattern, card.pattern, "grid");

  if (pattern === false || pattern === "none") return "";

  if (pattern === "stars") {
    return Array.from({ length: 70 }, (_, index) => {
      const x = (index * 97) % width;
      const y = (index * 53) % height;
      const size = 1 + (index % 3);

      return `<path d="M ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} L ${x - size} ${y} Z" fill="#FFFFFF" opacity="0.14"/>`;
    }).join("\n");
  }

  if (pattern === "dots") {
    return Array.from({ length: 120 }, (_, index) => {
      const x = (index * 67) % width;
      const y = (index * 41) % height;

      return `<circle cx="${x}" cy="${y}" r="1.4" fill="#FFFFFF" opacity="0.10"/>`;
    }).join("\n");
  }

  if (pattern === "lines") {
    return Array.from({ length: Math.ceil(width / 34) }, (_, index) => {
      const x = index * 34;
      return `<path d="M ${x} -20 L ${x + 160} ${height + 20}" stroke="#FFFFFF" stroke-width="1" opacity="0.045"/>`;
    }).join("\n");
  }

  const step = numberValue(background.gridSize, 28);
  const lines = [];

  for (let x = 0; x <= width; x += step) {
    lines.push(`<path d="M ${x} 0 L ${x} ${height}" stroke="#FFFFFF" stroke-width="1" opacity="0.035"/>`);
  }

  for (let y = 0; y <= height; y += step) {
    lines.push(`<path d="M 0 ${y} L ${width} ${y}" stroke="#FFFFFF" stroke-width="1" opacity="0.035"/>`);
  }

  return lines.join("\n");
}

function renderBackground(card, width, height) {
  const background = card.background || {};
  const href = imageHref(background);
  const overlayColor = firstValue(background.overlayColor, "#000000");
  const overlayOpacity = numberValue(background.overlayOpacity, 0.24);
  const opacity = numberValue(background.opacity, 1);
  const blur = numberValue(background.blur, 0);

  const base = href
    ? `<image href="${escapeXml(href)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="${opacity}"${blur > 0 ? ' filter="url(#dynamicBgBlur)"' : ""}/>`
    : `<rect width="${width}" height="${height}" fill="url(#dynamicBackgroundGradient)"/>`;

  return `
  <g id="dynamicBackground">
    ${base}
    ${renderPattern(card, width, height)}
    <rect width="${width}" height="${height}" fill="${escapeXml(overlayColor)}" opacity="${overlayOpacity}"/>
  </g>`;
}

function renderText(node, card) {
  const x = numberValue(node.x, 0);
  const y = numberValue(node.y, 0);
  const fontSize = numberValue(node.fontSize, 18);
  const lineHeight = numberValue(node.lineHeight, fontSize * 1.25);
  const text = firstValue(node.text, node.value, "");
  const lines = wrapText(text, node.maxWidth, fontSize);

  if (lines.length === 1) {
    return `<text x="${x}" y="${y}"${fontAttrs(node, card)}${styleAttrs(node)}>${escapeXml(lines[0])}</text>`;
  }

  return `<text x="${x}" y="${y}"${fontAttrs(node, card)}${styleAttrs(node)}>${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join("")}</text>`;
}

function renderImage(node, index) {
  const href = imageHref(node);
  if (!href) return "";

  const x = numberValue(node.x, 0);
  const y = numberValue(node.y, 0);
  const width = numberValue(node.width, 120);
  const height = numberValue(node.height, 120);
  const radius = numberValue(node.radius, 0);
  const clipId = `dynamicImageClip${index}`;

  if (radius > 0) {
    return `
  <clipPath id="${clipId}">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/>
  </clipPath>
  <image href="${escapeXml(href)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="${escapeXml(firstValue(node.preserveAspectRatio, "xMidYMid slice"))}" clip-path="url(#${clipId})"${styleAttrs(node)}/>`;
  }

  return `<image href="${escapeXml(href)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="${escapeXml(firstValue(node.preserveAspectRatio, "xMidYMid slice"))}"${styleAttrs(node)}/>`;
}

function renderAvatar(node, index, card) {
  const size = numberValue(node.size, 112);
  const x = numberValue(node.x, 40);
  const y = numberValue(node.y, 40);
  const radius = numberValue(node.radius, size / 2);
  const href = imageHref(node);
  const letter = firstValue(node.text, node.placeholderText, textValue(card, "name", "U").slice(0, 1).toUpperCase());
  const clipId = `dynamicAvatarClip${index}`;

  if (href) {
    return `
  <clipPath id="${clipId}">
    <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius}"/>
  </clipPath>
  <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius + 5}" fill="url(#dynamicAccentGradient)"/>
  <image href="${escapeXml(href)}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"${styleAttrs(node)}/>
  <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius}" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>`;
  }

  return `
  <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius + 5}" fill="url(#dynamicAccentGradient)"/>
  <circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius}" fill="${escapeXml(firstValue(node.fill, "#111111"))}"/>
  <text x="${x + size / 2}" y="${y + size / 2 + Math.round(size * 0.13)}" text-anchor="middle" font-family="${escapeXml(card.theme?.fontFamily || "Inter, Arial, sans-serif")}" font-size="${Math.round(size * 0.42)}" font-weight="900" fill="#FFFFFF">${escapeXml(letter)}</text>`;
}

function renderProgress(node, card) {
  const x = numberValue(node.x, 0);
  const y = numberValue(node.y, 0);
  const width = numberValue(node.width, 300);
  const height = numberValue(node.height, 14);
  const radius = numberValue(node.radius, 999);
  const value = numberValue(firstValue(node.percent, node.value), 0);
  const max = numberValue(node.max, 100);
  const percent = clamp(max > 0 ? value / max : value / 100, 0, 1);
  const fillWidth = Math.round(width * percent);
  const label = firstValue(node.label, "");

  return `
  <g${attr("id", node.id)}${attr("class", node.className || node.class)}>
    ${label ? `<text x="${x}" y="${y - 10}" font-family="${escapeXml(card.theme?.fontFamily || "Inter, Arial, sans-serif")}" font-size="13" font-weight="800" fill="${escapeXml(firstValue(node.labelColor, "#FFFFFF"))}">${escapeXml(label)}</text>` : ""}
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${escapeXml(firstValue(node.backgroundColor, "#FFFFFF"))}" opacity="${numberValue(node.backgroundOpacity, 0.14)}"/>
    <rect x="${x}" y="${y}" width="${fillWidth}" height="${height}" rx="${radius}" fill="${escapeXml(firstValue(node.fill, "url(#dynamicAccentGradient)"))}"/>
  </g>`;
}

function renderList(node, card) {
  const items = Array.isArray(node.items) ? node.items : [];
  const x = numberValue(node.x, 0);
  const y = numberValue(node.y, 0);
  const rowHeight = numberValue(node.rowHeight, 32);

  return `<g${attr("id", node.id)}${attr("class", node.className || node.class)}>${items.map((item, index) => {
    const text = isObject(item) ? firstValue(item.text, item.name, item.label, item.value, "") : item;

    return `<text x="${x}" y="${y + index * rowHeight}"${fontAttrs(node, card)}${styleAttrs(node)}>${escapeXml(text)}</text>`;
  }).join("\n")}</g>`;
}

function renderTable(node, card) {
  const rows = Array.isArray(node.rows) ? node.rows : [];
  const columns = Array.isArray(node.columns) ? node.columns : [];
  const x = numberValue(node.x, 0);
  const y = numberValue(node.y, 0);
  const rowHeight = numberValue(node.rowHeight, 34);
  const colWidth = numberValue(node.colWidth, 140);

  const header = columns.map((column, index) => {
    return `<text x="${x + index * colWidth}" y="${y}" font-family="${escapeXml(card.theme?.fontFamily || "Inter, Arial, sans-serif")}" font-size="13" font-weight="900" fill="${escapeXml(firstValue(node.headerColor, "#A1A1AA"))}">${escapeXml(column)}</text>`;
  }).join("\n");

  const body = rows.map((row, rowIndex) => {
    const cells = Array.isArray(row) ? row : columns.map((column) => row[column] ?? "");

    return cells.map((cell, cellIndex) => {
      return `<text x="${x + cellIndex * colWidth}" y="${y + (rowIndex + 1) * rowHeight}" font-family="${escapeXml(card.theme?.fontFamily || "Inter, Arial, sans-serif")}" font-size="${numberValue(node.fontSize, 15)}" font-weight="${escapeXml(firstValue(node.fontWeight, 700))}" fill="${escapeXml(firstValue(node.fill, "#FFFFFF"))}">${escapeXml(cell)}</text>`;
    }).join("\n");
  }).join("\n");

  return `<g${attr("id", node.id)}${attr("class", node.className || node.class)}>${header}${body}</g>`;
}

function renderNode(node = {}, index = 0, card = {}) {
  const type = firstValue(node.type, "text");

  if (type === "group" || type === "g") {
    const children = Array.isArray(node.children) ? node.children : [];
    return `<g${attr("id", node.id)}${attr("class", node.className || node.class)}${attr("transform", node.transform)}${attr("opacity", node.opacity)}>${children.map((child, childIndex) => renderNode(child, `${index}-${childIndex}`, card)).join("\n")}</g>`;
  }

  if (type === "rect" || type === "panel" || type === "glass") {
    return `<rect x="${numberValue(node.x, 0)}" y="${numberValue(node.y, 0)}" width="${numberValue(node.width, 100)}" height="${numberValue(node.height, 40)}" rx="${numberValue(node.radius, node.rx ?? 12)}"${styleAttrs({ fill: "#FFFFFF", opacity: type === "glass" ? 0.08 : 1, stroke: type === "glass" ? "#FFFFFF" : undefined, strokeOpacity: type === "glass" ? 0.14 : undefined, ...node })}/>`;
  }

  if (type === "circle") {
    return `<circle cx="${numberValue(node.cx, node.x ?? 0)}" cy="${numberValue(node.cy, node.y ?? 0)}" r="${numberValue(node.r, node.radius ?? 20)}"${styleAttrs(node)}/>`;
  }

  if (type === "line" || type === "divider") {
    return `<path d="M ${numberValue(node.x1, node.x ?? 0)} ${numberValue(node.y1, node.y ?? 0)} L ${numberValue(node.x2, (node.x ?? 0) + numberValue(node.width, 100))} ${numberValue(node.y2, node.y ?? 0)}" stroke="${escapeXml(firstValue(node.stroke, node.color, "#FFFFFF"))}" stroke-width="${numberValue(node.strokeWidth, 1)}" opacity="${numberValue(node.opacity, 0.35)}"/>`;
  }

  if (type === "path") {
    return `<path d="${escapeXml(firstValue(node.d, ""))}"${styleAttrs(node)}/>`;
  }

  if (type === "image") return renderImage(node, index);
  if (type === "avatar") return renderAvatar(node, index, card);
  if (type === "progress") return renderProgress(node, card);
  if (type === "list") return renderList(node, card);
  if (type === "table") return renderTable(node, card);

  return renderText(node, card);
}

function renderProfileLayout(card, width, height) {
  const panel = card.panel || {};
  const avatar = card.avatar || {};
  const progress = card.progress || {};
  const x = numberValue(panel.x, 28);
  const y = numberValue(panel.y, 28);
  const panelWidth = numberValue(panel.width, width - x * 2);
  const panelHeight = numberValue(panel.height, height - y * 2);
  const title = textValue(card, "title", "Card personalizado");
  const subtitle = textValue(card, "subtitle", "Layout dinâmico avançado");
  const name = textValue(card, "name", "");
  const group = textValue(card, "group", "");
  const main = textValue(card, "main", "Configure textos, imagens, formas, listas, tabelas e barras.");
  const footer = textValue(card, "footer", "");
  const theme = card.theme || {};
  const font = escapeXml(firstValue(theme.fontFamily, "Inter, Arial, sans-serif"));
  const startX = avatar.enabled === false ? 58 : 198;

  return `
  <rect x="${x}" y="${y}" width="${panelWidth}" height="${panelHeight}" rx="${numberValue(panel.radius, 28)}" fill="${escapeXml(firstValue(panel.color, "#FFFFFF"))}" opacity="${numberValue(panel.opacity, 0.08)}" stroke="${escapeXml(firstValue(panel.borderColor, "#FFFFFF"))}" stroke-opacity="${numberValue(panel.borderOpacity, 0.14)}" filter="url(#dynamicSoftShadow)"/>
  ${avatar.enabled === false ? "" : renderAvatar({ ...avatar, type: "avatar" }, "profile", card)}
  <g id="dynamicProfileText">
    <text x="${startX}" y="86" font-family="${font}" font-size="18" font-weight="800" fill="url(#dynamicAccentGradient)" letter-spacing="1.8">${escapeXml(subtitle).toUpperCase()}</text>
    <text x="${startX}" y="132" font-family="${font}" font-size="42" font-weight="900" fill="${escapeXml(firstValue(theme.primaryColor, "#FFFFFF"))}">${escapeXml(title)}</text>
    ${name ? `<text x="${startX}" y="176" font-family="${font}" font-size="28" font-weight="800" fill="${escapeXml(firstValue(theme.secondaryColor, "#D4D4D8"))}">${escapeXml(name)}</text>` : ""}
    ${group ? `<text x="${startX}" y="207" font-family="${font}" font-size="18" font-weight="700" fill="${escapeXml(firstValue(theme.mutedColor, "#A1A1AA"))}">${escapeXml(group)}</text>` : ""}
    <text x="${startX}" y="246" font-family="${font}" font-size="18" font-weight="600" fill="${escapeXml(firstValue(theme.secondaryColor, "#D4D4D8"))}" opacity="0.92">${escapeXml(main)}</text>
    ${footer ? `<text x="${startX}" y="${height - 42}" font-family="${font}" font-size="15" font-weight="700" fill="${escapeXml(firstValue(theme.mutedColor, "#A1A1AA"))}">${escapeXml(footer)}</text>` : ""}
  </g>
  ${progress.enabled ? renderProgress({ x: startX, y: height - 84, width: Math.min(560, width - startX - 70), ...progress }, card) : ""}`;
}

function renderUserDefs(card, width, height) {
  const gradients = Array.isArray(card.gradients) ? card.gradients : [];

  return gradients.map((gradient) => {
    const id = escapeXml(firstValue(gradient.id, ""));
    const stops = Array.isArray(gradient.stops) ? gradient.stops : [];

    if (!id || !stops.length) return "";

    return `<linearGradient id="${id}" x1="${firstValue(gradient.x1, 0)}" y1="${firstValue(gradient.y1, 0)}" x2="${firstValue(gradient.x2, width)}" y2="${firstValue(gradient.y2, 0)}" gradientUnits="userSpaceOnUse">
      ${stops.map((stop) => `<stop offset="${escapeXml(firstValue(stop.offset, "0%"))}" stop-color="${escapeXml(firstValue(stop.color, "#FFFFFF"))}" stop-opacity="${numberValue(stop.opacity, 1)}"/>`).join("\n")}
    </linearGradient>`;
  }).join("\n");
}

function createDynamicCustomCardSvg(card = {}) {
  const width = numberValue(card.width, 900);
  const height = numberValue(card.height, 360);
  const radius = numberValue(card.radius, 34);
  const theme = card.theme || {};
  const background = card.background || {};
  const elements = Array.isArray(card.elements) ? card.elements : [];
  const mode = firstValue(card.mode, card.layoutMode, "auto");
  const shouldRenderProfile = mode === "profile" || (mode === "auto" && elements.length === 0 && card.defaultLayout !== false);

  const bgStart = firstValue(background.startColor, "#050505");
  const bgEnd = firstValue(background.endColor, "#18181B");
  const accentStart = firstValue(theme.accentColor, "#A855F7");
  const accentEnd = firstValue(theme.accentEndColor, theme.accentColor, "#EC4899");

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  data-template="dynamic_custom_card"
  data-card-id="${escapeXml(card.cardId || card.id || "custom/dynamic")}"
  data-category="${escapeXml(card.category || "custom")}"
>
  <defs>
    <linearGradient id="dynamicBackgroundGradient" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeXml(bgStart)}"/>
      <stop offset="100%" stop-color="${escapeXml(bgEnd)}"/>
    </linearGradient>

    <linearGradient id="dynamicAccentGradient" x1="0" y1="0" x2="${width}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeXml(accentStart)}"/>
      <stop offset="100%" stop-color="${escapeXml(accentEnd)}"/>
    </linearGradient>

    ${renderUserDefs(card, width, height)}

    <filter id="dynamicSoftShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.38"/>
    </filter>

    <filter id="dynamicBgBlur">
      <feGaussianBlur stdDeviation="${numberValue(background.blur, 0)}"/>
    </filter>

    <clipPath id="dynamicRootClip">
      <rect width="${width}" height="${height}" rx="${radius}"/>
    </clipPath>
  </defs>

  <g clip-path="url(#dynamicRootClip)">
    ${renderBackground(card, width, height)}
    ${shouldRenderProfile ? renderProfileLayout(card, width, height) : ""}
    ${elements.map((element, index) => renderNode(element, index, card)).join("\n")}
  </g>
</svg>`;
}

module.exports = {
  createDynamicCustomCardSvg
};
