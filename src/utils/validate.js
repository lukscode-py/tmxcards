function assertVariantExists(presets, variant, family) {
  const found = presets.find((item) => item.id === variant);

  if (!found) {
    const available = presets.map((item) => item.id).join(", ");
    throw new Error(
      `Preset '${variant}' não encontrado em '${family}'. Disponíveis: ${available}`
    );
  }

  return found;
}

module.exports = {
  assertVariantExists
};
