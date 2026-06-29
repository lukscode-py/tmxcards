const { imageSource, imageHref } = require("./image-source");

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

function clamp(num, min, max) {
  const number = Number(num);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, number));
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function createUniversalRankCardSvg(config = {}) {
  const width = numberValue(config.width, 1000);
  const padding = numberValue(config.padding, 40);

  const theme = {
    bgStart: "#050505",
    bgEnd: "#111111",
    cardStart: "#101010",
    cardEnd: "#181818",
    accentStart: "#FFFFFF",
    accentEnd: "#9CA3AF",
    top1Start: "#FACC15",
    top1End: "#A16207",
    top2Start: "#E5E7EB",
    top2End: "#6B7280",
    top3Start: "#FB923C",
    top3End: "#9A3412",
    text: "#FFFFFF",
    muted: "#FFFFFF",
    border: "#FFFFFF",
    rowRadius: 16,
    cardRadius: 30,
    font: "Inter, Roboto, Arial, sans-serif",
    shadowColor: "#000000",
    shadowOpacity: 0.40,
    gridOpacity: 0.022,
    ...config.theme
  };

  const options = {
    compact: false,
    showImages: true,
    showProgress: true,
    showDescription: true,
    showSub: true,
    showValue: true,
    showStats: true,
    showExtraTables: true,
    ...config.options
  };

  const items = Array.isArray(config.items) ? config.items : [];
  const stats = Array.isArray(config.stats) ? config.stats : [];
  const extraTables = Array.isArray(config.extraTables) ? config.extraTables : [];

  const rowHeight = options.compact ? 42 : 50;
  const rowGap = options.compact ? 6 : 8;

  const headerHeight = 138;
  const statsHeight = options.showStats && stats.length ? 74 : 0;
  const listHeight = items.length
    ? items.length * rowHeight + Math.max(0, items.length - 1) * rowGap
    : 0;

  const tableTitleHeight = 34;
  const tableRowHeight = 34;
  const tableGap = 18;

  const tablesHeight = options.showExtraTables
    ? extraTables.reduce((sum, table) => {
        const rows = Array.isArray(table.rows) ? table.rows.length : 0;
        return sum + tableTitleHeight + rows * tableRowHeight + tableGap;
      }, 0)
    : 0;

  const contentHeight = headerHeight + statsHeight + listHeight + tablesHeight + 70;
  const height = Math.max(360, contentHeight + padding);

  const cardX = numberValue(config.card?.x, 40);
  const cardY = numberValue(config.card?.y, 36);
  const cardW = numberValue(config.card?.width, width - 80);
  const cardH = Math.max(250, height - 72);

  const rightX = width - 98;
  const subX = numberValue(config.columns?.subX, Math.round(width * 0.43));
  const progressX = numberValue(config.columns?.progressX, Math.round(width * 0.61));
  const progressW = numberValue(config.columns?.progressWidth, Math.max(120, rightX - progressX - 82));

  const id = `rank_${String(config.idSuffix || Math.random().toString(36).slice(2, 8)).replace(/[^a-zA-Z0-9_-]/g, "")}`;

  function topGradient(index) {
    if (index === 0) return `url(#${id}_top1)`;
    if (index === 1) return `url(#${id}_top2)`;
    if (index === 2) return `url(#${id}_top3)`;
    return `url(#${id}_accent)`;
  }

  function renderBackground() {
    const bg = config.background || {};
    const bgHref = imageSource(bg);

    if (!bgHref) {
      return `  <!-- FUNDO PERSONALIZÁVEL -->
  <rect width="${width}" height="${height}" fill="url(#${id}_bg)"/>
  <rect width="${width}" height="${height}" fill="url(#${id}_grid)"/>`;
    }

    const overlayColor = bg.overlayColor || "#000000";
    const overlayOpacity = clamp(bg.overlayOpacity ?? 0, 0, 1);

    return `  <!-- FUNDO PERSONALIZÁVEL -->
  <image href="${escapeAttr(bgHref)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${width}" height="${height}" fill="${escapeAttr(overlayColor)}" opacity="${overlayOpacity}"/>
  <rect width="${width}" height="${height}" fill="url(#${id}_grid)"/>`;
  }

  function renderStats(startY) {
    if (!options.showStats || !stats.length) return "";

    const gap = 12;
    const statCount = Math.min(stats.length, 4);
    const statW = (cardW - 72 - gap * (statCount - 1)) / statCount;

    return `
    <!-- ESTATÍSTICAS PERSONALIZÁVEIS -->
    <g font-family="${escapeAttr(theme.font)}">
      ${stats.slice(0, 4).map((stat, i) => {
        const x = 76 + i * (statW + gap);
        return `
      <g>
        <rect x="${x}" y="${startY}" width="${statW}" height="54" rx="16" fill="${escapeAttr(theme.text)}" fill-opacity="0.045" stroke="${escapeAttr(theme.border)}" stroke-opacity="0.06"/>
        <text x="${x + 18}" y="${startY + 22}" font-size="11" font-weight="800" fill="${escapeAttr(theme.muted)}" opacity="0.38" letter-spacing="1">${escapeXml(stat.label)}</text>
        <text x="${x + 18}" y="${startY + 42}" font-size="18" font-weight="900" fill="${escapeAttr(theme.text)}">${escapeXml(stat.value)}</text>
      </g>`;
      }).join("")}
    </g>`;
  }

  function renderItem(item, index, y) {
    const position = item.position ?? index + 1;
    const pos = String(position).padStart(2, "0");
    const name = item.name || `Item ${index + 1}`;
    const description = item.description || "Descrição";
    const sub = item.sub || "Sub text";
    const value = item.value || "0";
    const icon = item.icon || String(index + 1);
    const href = imageHref(item);
    const progress = clamp(item.progress ?? 0, 0, 100);
    const progressFillW = Math.round((progress / 100) * progressW);

    const iconClipId = `${id}_iconClip_${index}`;
    const itemId = String(item.id || `rankItem${index + 1}`).replace(/[^a-zA-Z0-9_-]/g, "");
    const rowOpacity = index === 0
      ? 0.075
      : index === 1
        ? 0.055
        : index === 2
          ? 0.045
          : Math.max(0.012, 0.032 - index * 0.002);

    return `
    <!-- EDITAR LINHA ${index + 1} AQUI -->
    <g id="${escapeAttr(itemId)}">
      <clipPath id="${escapeAttr(iconClipId)}">
        <circle cx="132" cy="${y + rowHeight / 2}" r="18"/>
      </clipPath>

      <rect x="66" y="${y}" width="${cardW - 52}" height="${rowHeight}" rx="${theme.rowRadius}" fill="${escapeAttr(theme.text)}" fill-opacity="${rowOpacity}" stroke="${escapeAttr(theme.border)}" stroke-opacity="0.045"/>

      ${index < 3 ? `<rect x="66" y="${y}" width="5" height="${rowHeight}" rx="3" fill="${topGradient(index)}"/>` : ""}

      <text x="${pos.length > 2 ? 80 : 88}" y="${y + rowHeight / 2 + 6}" font-size="15" font-weight="900" fill="${escapeAttr(theme.text)}" opacity="${index < 3 ? 0.95 : 0.52}">${escapeXml(pos)}</text>

      <circle cx="132" cy="${y + rowHeight / 2}" r="18" fill="${index < 3 ? topGradient(index) : escapeAttr(theme.text)}" opacity="${index < 3 ? 1 : 0.07}"/>

      ${
        options.showImages && href
          ? `<image href="${escapeAttr(href)}" x="114" y="${y + rowHeight / 2 - 18}" width="36" height="36" preserveAspectRatio="xMidYMid slice" clip-path="url(#${escapeAttr(iconClipId)})"/>`
          : `<text x="132" y="${y + rowHeight / 2 + 6}" text-anchor="middle" font-size="13" font-weight="900" fill="${index < 3 ? "#111111" : escapeAttr(theme.text)}" opacity="${index < 3 ? 1 : 0.66}">${escapeXml(icon)}</text>`
      }

      <text id="item${index + 1}Name" x="162" y="${y + 20}" font-size="16" font-weight="800" fill="${escapeAttr(theme.text)}" opacity="${index < 3 ? 1 : 0.84}">${escapeXml(name)}</text>

      ${
        options.showDescription
          ? `<text id="item${index + 1}Description" x="162" y="${y + 38}" font-size="12" font-weight="600" fill="${escapeAttr(theme.muted)}" opacity="0.30">${escapeXml(description)}</text>`
          : ""
      }

      ${
        options.showSub
          ? `<text id="item${index + 1}Sub" x="${subX}" y="${y + rowHeight / 2 + 6}" font-size="14" font-weight="700" fill="${escapeAttr(theme.muted)}" opacity="0.46">${escapeXml(sub)}</text>`
          : ""
      }

      ${
        options.showProgress
          ? `
      <rect x="${progressX}" y="${y + rowHeight / 2 - 5}" width="${progressW}" height="10" rx="999" fill="${escapeAttr(theme.text)}" opacity="0.08"/>
      <rect id="item${index + 1}Progress" x="${progressX}" y="${y + rowHeight / 2 - 5}" width="${progressFillW}" height="10" rx="999" fill="${topGradient(index)}" opacity="${index < 3 ? 1 : 0.72}"/>`
          : ""
      }

      ${
        options.showValue
          ? `<text id="item${index + 1}Value" x="${rightX}" y="${y + rowHeight / 2 + 6}" text-anchor="end" font-size="16" font-weight="900" fill="${escapeAttr(theme.text)}" opacity="${index < 3 ? 1 : 0.74}">${escapeXml(value)}</text>`
          : ""
      }
    </g>`;
  }

  function renderExtraTables(startY) {
    if (!options.showExtraTables || !extraTables.length) return "";

    let y = startY;

    return `
    <!-- TABELAS EXTRAS PERSONALIZÁVEIS -->
    <g font-family="${escapeAttr(theme.font)}">
      ${extraTables.map((table, tableIndex) => {
        const rows = Array.isArray(table.rows) ? table.rows : [];
        const tableTitle = table.title || `Tabela ${tableIndex + 1}`;
        const tableY = y;
        y += tableTitleHeight + rows.length * tableRowHeight + tableGap;

        return `
      <g id="extraTable${tableIndex + 1}">
        <text x="76" y="${tableY}" font-size="20" font-weight="900" fill="${escapeAttr(theme.text)}">${escapeXml(tableTitle)}</text>

        ${rows.map((row, rowIndex) => {
          const ry = tableY + 18 + rowIndex * tableRowHeight;
          return `
        <g>
          <rect x="66" y="${ry}" width="${cardW - 52}" height="28" rx="10" fill="${escapeAttr(theme.text)}" fill-opacity="0.026"/>
          <text x="86" y="${ry + 19}" font-size="13" font-weight="750" fill="${escapeAttr(theme.text)}" opacity="0.78">${escapeXml(row.label)}</text>
          <text x="${rightX}" y="${ry + 19}" text-anchor="end" font-size="13" font-weight="850" fill="${escapeAttr(theme.text)}" opacity="0.86">${escapeXml(row.value)}</text>
        </g>`;
        }).join("")}
      </g>`;
      }).join("")}
    </g>`;
  }

  const statsY = 150;
  const listY = statsY + statsHeight + 12;
  const tablesY = listY + listHeight + 34;

  return `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  role="img"
  aria-label="Card de ranking universal"
  style="width:100%;height:auto;display:block"
  data-template="universal_rank_card"
>
  <defs>
    <!-- EDITAR FUNDO AQUI -->
    <linearGradient id="${id}_bg" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(theme.bgStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(theme.bgEnd)}"/>
    </linearGradient>

    <!-- EDITAR FUNDO DO CARD AQUI -->
    <linearGradient id="${id}_cardBg" x1="${cardX}" y1="${cardY}" x2="${cardX + cardW}" y2="${cardY + cardH}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${escapeAttr(theme.cardStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(theme.cardEnd)}"/>
    </linearGradient>

    <!-- EDITAR COR DE DESTAQUE GERAL AQUI -->
    <linearGradient id="${id}_accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(theme.accentStart)}"/>
      <stop offset="100%" stop-color="${escapeAttr(theme.accentEnd)}"/>
    </linearGradient>

    <!-- EDITAR CORES DO TOP 3 AQUI -->
    <linearGradient id="${id}_top1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(theme.top1Start)}"/>
      <stop offset="100%" stop-color="${escapeAttr(theme.top1End)}"/>
    </linearGradient>

    <linearGradient id="${id}_top2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(theme.top2Start)}"/>
      <stop offset="100%" stop-color="${escapeAttr(theme.top2End)}"/>
    </linearGradient>

    <linearGradient id="${id}_top3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeAttr(theme.top3Start)}"/>
      <stop offset="100%" stop-color="${escapeAttr(theme.top3End)}"/>
    </linearGradient>

    <filter id="${id}_shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="${escapeAttr(theme.shadowColor)}" flood-opacity="${clamp(theme.shadowOpacity, 0, 1)}"/>
    </filter>

    <pattern id="${id}_grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M26 0H0V26" fill="none" stroke="${escapeAttr(theme.border)}" stroke-opacity="${clamp(theme.gridOpacity, 0, 1)}" stroke-width="1"/>
    </pattern>
  </defs>

${renderBackground()}

  <!-- CARD PRINCIPAL COM ALTURA DINÂMICA -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${cardW}"
    height="${cardH}"
    rx="${theme.cardRadius}"
    fill="url(#${id}_cardBg)"
    stroke="${escapeAttr(theme.border)}"
    stroke-opacity="0.08"
    stroke-width="1.5"
    filter="url(#${id}_shadow)"
  />

  <!-- FAIXA SUPERIOR -->
  <rect
    x="${cardX}"
    y="${cardY}"
    width="${cardW}"
    height="6"
    rx="3"
    fill="url(#${id}_accent)"
    opacity="0.90"
  />

  <!-- CABEÇALHO PERSONALIZÁVEL -->
  <g font-family="${escapeAttr(theme.font)}">
    <!-- EDITAR TÍTULO AQUI -->
    <text id="rankTitle" x="76" y="96" font-size="40" font-weight="900" fill="${escapeAttr(theme.text)}" letter-spacing="-0.8">${escapeXml(config.title || "Top Rank")}</text>

    <!-- EDITAR SUBTÍTULO AQUI -->
    <text id="rankSubtitle" x="76" y="128" font-size="17" font-weight="500" fill="${escapeAttr(theme.muted)}" opacity="0.48">${escapeXml(config.subtitle || "Lista personalizável")}</text>

    <!-- EDITAR TIPO DO RANK AQUI -->
    <rect x="${rightX - 160}" y="70" width="160" height="40" rx="20" fill="${escapeAttr(theme.text)}" fill-opacity="0.055" stroke="${escapeAttr(theme.border)}" stroke-opacity="0.08"/>
    <text id="rankType" x="${rightX - 80}" y="95" text-anchor="middle" font-size="13" font-weight="800" fill="${escapeAttr(theme.text)}" opacity="0.74" letter-spacing="1.2">${escapeXml(config.type || "MÉTRICA")}</text>

    <!-- EDITAR INFO/DATA AQUI -->
    <text id="rankInfo" x="${rightX}" y="132" text-anchor="end" font-size="14" font-weight="600" fill="${escapeAttr(theme.muted)}" opacity="0.42">${escapeXml(config.info || "Atualizado: 00/00/0000")}</text>
  </g>

  ${renderStats(statsY)}

  <!-- CABEÇALHO DAS COLUNAS -->
  <g font-family="${escapeAttr(theme.font)}" fill="${escapeAttr(theme.text)}" opacity="0.38">
    <text x="76" y="${listY - 14}" font-size="12" font-weight="800" letter-spacing="1.2">POS</text>
    <text x="162" y="${listY - 14}" font-size="12" font-weight="800" letter-spacing="1.2">ITEM</text>
    ${options.showSub ? `<text x="${subX}" y="${listY - 14}" font-size="12" font-weight="800" letter-spacing="1.2">SUB</text>` : ""}
    ${options.showProgress ? `<text x="${progressX}" y="${listY - 14}" font-size="12" font-weight="800" letter-spacing="1.2">PROGRESSO</text>` : ""}
    ${options.showValue ? `<text x="${rightX}" y="${listY - 14}" text-anchor="end" font-size="12" font-weight="800" letter-spacing="1.2">VALOR</text>` : ""}
  </g>

  <!-- LISTA DINÂMICA -->
  <g font-family="${escapeAttr(theme.font)}">
    ${items.map((item, index) => renderItem(item, index, listY + index * (rowHeight + rowGap))).join("")}
  </g>

  ${renderExtraTables(tablesY)}
</svg>`;
}

module.exports = {
  createUniversalRankCardSvg
};
