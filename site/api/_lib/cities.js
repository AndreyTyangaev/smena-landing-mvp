const fs = require("fs");
const path = require("path");

function loadCitySupport() {
  const jsonPath = path.join(process.cwd(), "site", "data", "cities.generated.json");
  if (fs.existsSync(jsonPath)) {
    return loadCitySupportFromJson(jsonPath);
  }

  const csvPath = path.join(process.cwd(), "Cities.csv");
  if (!fs.existsSync(csvPath)) {
    return {
      "москва": { id: 213, slug: "moscow", label: "Москва", supportsMetro: true },
      moscow: { id: 213, slug: "moscow", label: "Москва", supportsMetro: true }
    };
  }

  const raw = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return {};

  const headers = lines[0].split(",").map((x) => x.trim());
  const rows = lines.slice(1).map((line) => parseCsvLine(line, headers));
  const result = {};

  rows.forEach((row) => {
    if (!isEnabled(row.enabled)) return;

    const label = decodeMojibake(row.city_name_ru || "").trim() || row.city_name_en || row.city_slug;
    const slug = (row.city_slug || "").trim();
    const id = Number(row.location_id);
    const supportsMetro = isEnabled(row.supports_metro);

    if (!label || !slug || !id) return;

    const aliases = [label, row.city_name_en, row.city_slug]
      .filter(Boolean)
      .map((value) => normalizeCity(decodeMojibake(String(value))));

    aliases.forEach((alias) => {
      if (!alias) return;
      result[alias] = { id, slug, label, supportsMetro };
    });
  });

  return result;
}

function loadCitySupportFromJson(jsonPath) {
  const items = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const result = {};

  items.forEach((item) => {
    if (!item.enabled) return;
    const label = decodeMojibake(String(item.city_name_ru || item.city_name_en || item.city_slug || "")).trim();
    const slug = String(item.city_slug || "").trim();
    const id = Number(item.location_id);
    const supportsMetro = Boolean(item.supports_metro);
    const aliases = Array.isArray(item.aliases) ? item.aliases : [item.city_name_ru, item.city_name_en, item.city_slug];

    if (!label || !slug || !id) return;

    aliases
      .filter(Boolean)
      .map((value) => normalizeCity(decodeMojibake(String(value))))
      .forEach((alias) => {
        if (!alias) return;
        result[alias] = { id, slug, label, supportsMetro };
      });
  });

  return result;
}

function listCities() {
  const support = loadCitySupport();
  const unique = new Map();
  Object.entries(support).forEach(([alias, meta]) => {
    const key = `${meta.id}|${meta.slug}`;
    if (!unique.has(key)) {
      unique.set(key, {
        label: meta.label,
        id: meta.id,
        slug: meta.slug,
        supportsMetro: Boolean(meta.supportsMetro),
        aliases: [alias]
      });
      return;
    }
    unique.get(key).aliases.push(alias);
  });
  return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label, "ru"));
}

function parseCsvLine(line, headers) {
  const cols = line.split(",");
  const row = {};
  headers.forEach((header, index) => {
    row[header] = (cols[index] || "").trim();
  });
  return row;
}

function isEnabled(value) {
  return ["1", "true", "yes"].includes(String(value || "").toLowerCase());
}

function decodeMojibake(value) {
  if (!/[РрСс]/.test(value)) return value;
  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function normalizeCity(city) {
  return decodeMojibake(String(city || "")).toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

module.exports = {
  loadCitySupport,
  listCities,
  normalizeCity
};
