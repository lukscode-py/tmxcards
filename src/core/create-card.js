const merge = require("../utils/merge");
const { CARD_REGISTRY } = require("./card-registry");
const { createDynamicCard } = require("./dynamic-card");

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function valueOf(value) {
  if (isPlainObject(value) && Object.prototype.hasOwnProperty.call(value, "value")) {
    return value.value;
  }

  return value;
}

function firstValue(...values) {
  for (const value of values) {
    const finalValue = valueOf(value);

    if (finalValue !== undefined && finalValue !== null && finalValue !== "") {
      return finalValue;
    }
  }

  return undefined;
}

function normalizeId(id) {
  return String(id || "").trim().toLowerCase();
}

function findCard(id) {
  const normalized = normalizeId(id);

  return CARD_REGISTRY.find((card) => {
    return [
      card.id,
      card.template,
      ...(card.aliases || [])
    ].map(normalizeId).includes(normalized);
  });
}

function listCards(filter = {}) {
  return CARD_REGISTRY
    .filter((card) => !filter.category || card.category === filter.category)
    .map((card) => ({
      id: card.id,
      name: card.name,
      category: card.category,
      template: card.template,
      required: [...(card.required || [])],
      aliases: [...(card.aliases || [])]
    }));
}

function getCardInfo(id) {
  const card = findCard(id);

  if (!card) {
    return null;
  }

  return {
    id: card.id,
    name: card.name,
    category: card.category,
    template: card.template,
    required: [...(card.required || [])],
    aliases: [...(card.aliases || [])]
  };
}

function readPublic(config, key) {
  const text = config.text || {};
  const user = config.user || {};
  const group = config.group || {};
  const music = config.music || {};
  const rank = config.rank || {};

  if (key === "name") {
    return firstValue(
      config.name,
      user.name,
      text.name,
      text.userName
    );
  }

  if (key === "group") {
    return firstValue(
      config.groupName,
      group.name,
      group.title,
      typeof config.group === "string" ? config.group : undefined,
      text.group,
      text.groupName
    );
  }

  if (key === "title") {
    return firstValue(
      config.title,
      music.title,
      text.title
    );
  }

  if (key === "subtitle") {
    return firstValue(
      config.subtitle,
      music.artist,
      music.subtitle,
      text.subtitle
    );
  }

  if (key === "main") {
    return firstValue(
      config.main,
      text.main,
      text.greeting,
      text.subtext,
      text.xp
    );
  }

  if (key === "footer") {
    return firstValue(
      config.footer,
      text.footer,
      text.nextLevel
    );
  }

  if (key === "items") {
    return firstValue(
      config.items,
      rank.items
    );
  }

  return undefined;
}

function assertRequired(card, config) {
  const missing = [];

  for (const field of card.required || []) {
    const value = readPublic(config, field);

    if (field === "items") {
      if (!Array.isArray(value) || value.length === 0) {
        missing.push(field);
      }

      continue;
    }

    if (value === undefined || value === null || value === "") {
      missing.push(field);
    }
  }

  if (missing.length) {
    throw new Error(
      `Campos obrigatórios ausentes para "${card.id}": ${missing.join(", ")}. ` +
      `Use createCard("${card.id}", { ${missing.map((field) => `${field}: "..."`).join(", ")} }).`
    );
  }
}

function applyCommon(config) {
  const output = {};

  const layout = config.layout || {};
  const background = config.background || {};
  const avatar = config.avatar || {};
  const cover = config.cover || {};
  const music = config.music || {};
  const theme = config.theme || {};

  const width = firstValue(layout.width, config.width);
  const height = firstValue(layout.height, config.height);
  const radius = firstValue(layout.radius, config.radius);

  if (width !== undefined) output.width = width;
  if (height !== undefined) output.height = height;
  if (radius !== undefined) output.radius = radius;

  const backgroundImage = firstValue(
    background.imagePath,
    background.path,
    background.dataUri,
    background.href,
    background.buffer,
    background.data,
    background.url,
    background.imageUrl,
    config.backgroundImage
  );

  const backgroundConfig = {};

  if (backgroundImage !== undefined) {
    backgroundConfig.imagePath = backgroundImage;
    backgroundConfig.path = backgroundImage;
  }

  for (const [from, to] of [
    ["startColor", "startColor"],
    ["endColor", "endColor"],
    ["opacity", "opacity"],
    ["blur", "blur"],
    ["overlayColor", "overlayColor"],
    ["overlayOpacity", "overlayOpacity"]
  ]) {
    if (background[from] !== undefined) backgroundConfig[to] = background[from];
  }

  if (Object.keys(backgroundConfig).length) {
    output.background = backgroundConfig;
  }

  const avatarImage = firstValue(
    avatar.imagePath,
    avatar.path,
    avatar.dataUri,
    avatar.href,
    avatar.buffer,
    avatar.data,
    avatar.url,
    avatar.imageUrl,
    config.avatarImage,
    config.user?.avatar,
    config.user?.avatarImagePath
  );

  const avatarConfig = {};

  if (avatarImage !== undefined) {
    avatarConfig.imagePath = avatarImage;
    avatarConfig.path = avatarImage;
  }

  if (avatar.enabled !== undefined) avatarConfig.enabled = avatar.enabled;
  if (avatar.opacity !== undefined) avatarConfig.opacity = avatar.opacity;

  if (Object.keys(avatarConfig).length) {
    output.avatar = avatarConfig;
  }

  const coverImage = firstValue(
    cover.imagePath,
    cover.path,
    cover.dataUri,
    cover.href,
    cover.buffer,
    cover.data,
    cover.url,
    cover.imageUrl,
    config.coverImage,
    config.musicImage,
    music.imagePath,
    music.cover?.imagePath,
    music.cover?.path,
    music.cover?.dataUri,
    music.cover?.href,
    music.cover?.buffer,
    music.cover?.data,
    music.cover?.url,
    music.cover?.imageUrl,
    music.thumbnail?.imagePath,
    music.thumbnail?.path,
    music.thumbnail?.dataUri,
    music.thumbnail?.href,
    music.thumbnail?.buffer,
    music.thumbnail?.data,
    music.thumbnail?.url,
    music.thumbnail?.imageUrl
  );

  const coverConfig = isPlainObject(cover) ? { ...cover } : {};

  if (coverImage !== undefined) {
    coverConfig.imagePath = coverImage;
    coverConfig.path = coverImage;
  }

  if (Object.keys(coverConfig).length) {
    output.cover = coverConfig;
  }

  if (config.output) {
    output.output = config.output;
  }

  if (Object.keys(theme).length) {
    output.theme = { ...theme };
  }

  return output;
}

function setValue(object, path, value) {
  if (value === undefined) return;

  const parts = path.split(".");
  let target = object;

  for (const part of parts.slice(0, -1)) {
    target[part] ||= {};
    target = target[part];
  }

  target[parts.at(-1)] = value;
}

function setText(object, path, value) {
  setValue(object, path, value);
}

function applyTheme(output, adapter, config) {
  const theme = config.theme || {};

  const accentColor = firstValue(theme.accentColor, theme.accent);
  const primaryColor = firstValue(theme.primaryColor, theme.textColor);
  const secondaryColor = firstValue(theme.secondaryColor, theme.mutedColor);
  const borderColor = firstValue(theme.borderColor);
  const fontFamily = firstValue(theme.fontFamily, theme.font);

  if (adapter === "rank-list") {
    if (accentColor !== undefined) {
      setValue(output, "theme.accentStart", accentColor);
      setValue(output, "theme.accentEnd", accentColor);
    }

    if (primaryColor !== undefined) setValue(output, "theme.text", primaryColor);
    if (secondaryColor !== undefined) setValue(output, "theme.muted", secondaryColor);
    if (borderColor !== undefined) setValue(output, "theme.border", borderColor);
    if (fontFamily !== undefined) setValue(output, "theme.font", fontFamily);

    return;
  }

  if (adapter === "xp-rank") {
    if (accentColor !== undefined) {
      setValue(output, "xp.startColor", accentColor);
      setValue(output, "xp.endColor", accentColor);
    }
  } else if (adapter === "dark-member") {
    if (accentColor !== undefined) {
      setValue(output, "accent.startColor", accentColor);
      setValue(output, "accent.endColor", accentColor);
    }
  } else if (adapter === "moderation") {
    if (accentColor !== undefined) {
      setValue(output, "action.startColor", accentColor);
      setValue(output, "action.endColor", accentColor);
    }
  }

  if (primaryColor !== undefined) setValue(output, "text.primaryColor", primaryColor);
  if (secondaryColor !== undefined) setValue(output, "text.secondaryColor", secondaryColor);
  if (borderColor !== undefined) setValue(output, "border.color", borderColor);
  if (fontFamily !== undefined) setValue(output, "fonts.base", fontFamily);
}

function normalizeForCard(card, config) {
  const output = applyCommon(config);

  const name = readPublic(config, "name");
  const group = readPublic(config, "group");
  const title = readPublic(config, "title");
  const subtitle = readPublic(config, "subtitle");
  const main = readPublic(config, "main");
  const footer = readPublic(config, "footer");

  if (card.adapter === "dark-member") {
    setText(output, "text.name.value", name);
    setText(output, "text.group.value", group);
    setText(output, "text.main.value", main);
  }

  if (card.adapter === "classic-welcome") {
    setText(output, "text.name.value", name);
    setText(output, "text.group.value", group);
    setText(output, "text.greeting.value", title);
    setText(output, "text.subtext.value", main);
  }

  if (card.adapter === "midnight-member") {
    setText(output, "text.name.value", name);
    setText(output, "text.group.value", group);
    setText(output, "text.title.value", firstValue(title, main));
  }

  if (card.adapter === "xp-rank") {
    setText(output, "text.name.value", name);
    setText(output, "text.nextLevel.value", footer);

    const level = firstValue(
      config.level,
      config.rank?.level
    );

    if (level !== undefined) {
      if (typeof level === "object") {
        output.level = merge(output.level || {}, level);
      } else {
        setValue(output, "level.value", level);
      }
    }

    if (config.xp) {
      output.xp = merge(output.xp || {}, config.xp);
    }

    if (config.progress !== undefined) {
      setValue(output, "xp.progress", config.progress);
    }
  }

  if (card.adapter === "rank-list") {
    const items = readPublic(config, "items");

    if (items !== undefined) output.items = items;
    if (config.stats !== undefined) output.stats = config.stats;
    if (config.extraTables !== undefined) output.extraTables = config.extraTables;
    if (config.type !== undefined) output.type = config.type;
    if (config.info !== undefined) output.info = config.info;

    setValue(output, "title", title);
    setValue(output, "subtitle", subtitle);
  }

  if (card.adapter === "music") {
    setText(output, "text.title.value", title);
    setText(output, "text.subtitle.value", subtitle);
    setText(output, "text.footer.value", footer);

    if (config.music) {
      output.music = merge(output.music || {}, config.music);
    }
  }

  if (card.adapter === "moderation") {
    setText(output, "text.userName.value", name);
    setText(output, "text.groupName.value", group);
    setText(output, "text.title.value", title);
    setText(output, "text.subtitle.value", subtitle);
    setText(output, "text.main.value", main);
    setText(output, "text.footer.value", footer);

    if (config.moderation) {
      output.moderation = merge(output.moderation || {}, config.moderation);
    }

    if (config.oldRole !== undefined) setValue(output, "oldRole.value", config.oldRole);
    if (config.newRole !== undefined) setValue(output, "newRole.value", config.newRole);
    if (config.moderator !== undefined) setValue(output, "moderator.value", config.moderator);
  }

  applyTheme(output, card.adapter, config);

  return output;
}

function createCard(idOrConfig, maybeConfig = {}) {
  const isObjectMode = isPlainObject(idOrConfig);
  const id = isObjectMode
    ? firstValue(idOrConfig.id, idOrConfig.cardId, idOrConfig.template)
    : idOrConfig;

  const config = isObjectMode ? idOrConfig : maybeConfig;
  const card = findCard(id);

  if (!card) {
    return createDynamicCard(id, config);
  }

  assertRequired(card, config);

  const normalizedConfig = normalizeForCard(card, config);
  const createdCard = card.factory(normalizedConfig);

  return {
    ...createdCard,
    id: card.id,
    cardId: card.id,
    name: card.name,
    category: card.category
  };
}

module.exports = {
  createCard,
  listCards,
  getCardInfo
};
