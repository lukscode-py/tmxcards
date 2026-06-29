function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function merge(target, source) {
  const output = Array.isArray(target) ? [...target] : { ...target };

  if (!isObject(source)) {
    return output;
  }

  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[key] = merge(targetValue, sourceValue);
      continue;
    }

    output[key] = sourceValue;
  }

  return output;
}

module.exports = merge;
