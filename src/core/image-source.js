const fs = require("node:fs");
const path = require("node:path");

const imageCache = new Map();

const stats = {
  hits: 0,
  misses: 0,
  reads: 0
};

const DEFAULT_MAX_ENTRIES = 64;

function isBufferLike(value) {
  return Buffer.isBuffer(value) || value instanceof Uint8Array;
}

function exists(filePath) {
  return typeof filePath === "string" && filePath.length > 0 && fs.existsSync(filePath);
}

function mimeFromPath(filePath) {
  const extension = path.extname(String(filePath || "")).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";

  return "application/octet-stream";
}

function mimeFromBuffer(buffer, fallback = "application/octet-stream") {
  const data = Buffer.from(buffer);

  if (data.length >= 8 && data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) {
    return "image/png";
  }

  if (data.length >= 3 && data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF) {
    return "image/jpeg";
  }

  if (data.length >= 6) {
    const header = data.subarray(0, 6).toString("ascii");
    if (header === "GIF87a" || header === "GIF89a") return "image/gif";
  }

  if (data.length >= 12) {
    const riff = data.subarray(0, 4).toString("ascii");
    const webp = data.subarray(8, 12).toString("ascii");
    if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  }

  const start = data.subarray(0, 256).toString("utf8").trimStart();
  if (start.startsWith("<svg") || start.startsWith("<?xml")) {
    return "image/svg+xml";
  }

  return fallback;
}

function pruneCache(maxEntries = DEFAULT_MAX_ENTRIES) {
  while (imageCache.size > maxEntries) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
}

function fileCacheKey(filePath) {
  const resolved = path.resolve(filePath);
  const stat = fs.statSync(resolved);

  return `${resolved}:${stat.size}:${Math.round(stat.mtimeMs)}`;
}

function bufferToDataUri(buffer, mimeType) {
  const finalBuffer = Buffer.from(buffer);
  const mime = mimeType || mimeFromBuffer(finalBuffer);

  return `data:${mime};base64,${finalBuffer.toString("base64")}`;
}

function fileToDataUri(filePath, options = {}) {
  if (!exists(filePath)) return "";

  const key = fileCacheKey(filePath);
  const cached = imageCache.get(key);

  if (cached) {
    stats.hits++;
    return cached;
  }

  stats.misses++;
  stats.reads++;

  const buffer = fs.readFileSync(filePath);
  const dataUri = bufferToDataUri(buffer, options.mimeType || mimeFromPath(filePath));

  imageCache.set(key, dataUri);
  pruneCache(options.maxEntries || DEFAULT_MAX_ENTRIES);

  return dataUri;
}

function directStringSource(value) {
  if (typeof value !== "string" || value.length === 0) return "";

  if (
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("file://")
  ) {
    return value;
  }

  if (exists(value)) {
    return fileToDataUri(value);
  }

  return "";
}

function imageSource(input = {}) {
  if (!input) return "";

  if (typeof input === "string") {
    return directStringSource(input);
  }

  if (isBufferLike(input)) {
    return bufferToDataUri(input);
  }

  if (typeof input.dataUri === "string" && input.dataUri.length > 0) return input.dataUri;
  if (typeof input.href === "string" && input.href.length > 0) return directStringSource(input.href) || input.href;

  if (typeof input.base64 === "string" && input.base64.length > 0) {
    if (input.base64.startsWith("data:")) return input.base64;
    return `data:${input.mimeType || input.mime || "application/octet-stream"};base64,${input.base64}`;
  }

  for (const key of ["buffer", "data", "bytes", "imagePath", "path"]) {
    const value = input[key];

    if (isBufferLike(value)) {
      return bufferToDataUri(value, input.mimeType || input.mime);
    }

    if (typeof value === "string") {
      const resolved = directStringSource(value);
      if (resolved) return resolved;
    }
  }

  if (typeof input.imageUrl === "string" && input.imageUrl.length > 0) return input.imageUrl;
  if (typeof input.url === "string" && input.url.length > 0) return input.url;

  return "";
}

function clearImageCache() {
  imageCache.clear();
  stats.hits = 0;
  stats.misses = 0;
  stats.reads = 0;
}

function getImageCacheStats() {
  return {
    entries: imageCache.size,
    hits: stats.hits,
    misses: stats.misses,
    reads: stats.reads
  };
}

module.exports = {
  exists,
  mimeFromPath,
  mimeFromBuffer,
  fileToDataUri,
  imageSource,
  imageHref: imageSource,
  clearImageCache,
  getImageCacheStats
};
