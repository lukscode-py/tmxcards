const fs = require("node:fs");
const { parse } = require("csv-parse/sync");

function parseCsvInput(input, options = {}) {
  const {
    fromFile = true,
    parser = {}
  } = options;

  const raw = fromFile ? fs.readFileSync(input, "utf8") : String(input);

  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    ...parser
  });
}

function createCardsFromCsv(config = {}) {
  const {
    csv,
    fromFile = true,
    mapRow,
    templateFactory
  } = config;

  if (!csv) {
    throw new Error("O campo 'csv' é obrigatório.");
  }

  const rows = parseCsvInput(csv, { fromFile });

  return rows.map((row, index) => {
    if (typeof mapRow === "function") {
      return mapRow(row, index);
    }

    if (typeof templateFactory === "function") {
      return templateFactory(row, index);
    }

    return row;
  });
}

async function renderCardsFromCsv(config = {}) {
  const {
    csv,
    fromFile = true,
    mapRow,
    templateFactory,
    renderOptions,
    onResult
  } = config;

  if (!csv) {
    throw new Error("O campo 'csv' é obrigatório.");
  }

  const { renderCard } = require("./generator");
  const rows = parseCsvInput(csv, { fromFile });
  const results = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    let cardConfig;

    if (typeof mapRow === "function") {
      cardConfig = mapRow(row, index);
    } else if (typeof templateFactory === "function") {
      cardConfig = templateFactory(row, index);
    } else {
      cardConfig = row;
    }

    const output = await renderCard(cardConfig, renderOptions || {});
    results.push(output);

    if (typeof onResult === "function") {
      await onResult(output, row, index);
    }
  }

  return results;
}

module.exports = {
  parseCsvInput,
  createCardsFromCsv,
  renderCardsFromCsv
};
