const fs = require("fs");
const path = require("path");

const DEFAULT_CITIES = [
  { city_name_ru: "Москва", city_name_en: "Moscow", city_slug: "moscow", location_id: 213, enabled: true, supports_metro: true, aliases: ["Москва", "moscow", "msk"] },
  { city_name_ru: "Санкт-Петербург", city_name_en: "Saint Petersburg", city_slug: "saint-petersburg", location_id: 2, enabled: true, supports_metro: true, aliases: ["Санкт-Петербург", "Санкт Петербург", "Питер", "СПб", "saint-petersburg", "saint petersburg"] },
  { city_name_ru: "Астрахань", city_name_en: "Astrakhan", city_slug: "astrahan", location_id: 37, enabled: true, supports_metro: false, aliases: ["Астрахань", "astrakhan", "astrahan"] },
  { city_name_ru: "Архангельск", city_name_en: "Arkhangelsk", city_slug: "arkhangelsk", location_id: 20, enabled: true, supports_metro: false, aliases: ["Архангельск", "arkhangelsk"] }
];

function loadCityItems() {
  const jsonPath = path.join(process.cwd(), "site", "data", "cities.generated.json");
  if (fs.existsSync(jsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeItem);
    } catch {}
  }

  const csvPath = path.join(process.cwd(), "Cities.csv");
  if (fs.existsSync(csvPath)) {
    try {
      const raw = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
      const lines = raw.split(/\r?\n/).filter(Boolean);
      if (lines.length >= 2) {
        const headers = lines[0].split(",").map((x) => x.trim());
        const rows = lines.slice(1).map((line) => parseCsvLine(line, headers)).map(normalizeItem);
        if (rows.length) return rows;
      }
    } catch {}
  }

  return DEFAULT_CITIES.map(normalizeItem);
}

function normalizeItem(item) {
  return {
    city_name_ru: String(item.city_name_ru || "").trim(),
    city_name_en: String(item.city_name_en || "").trim(),
    city_slug: String(item.city_slug || "").trim(),
    location_id: Number(item.location_id),
    enabled: isEnabled(item.enabled),
    supports_metro: isEnabled(item.supports_metro),
    aliases: normalizeAliases(item)
  };
}

function normalizeAliases(item) {
  const base = Array.isArray(item.aliases) ? item.aliases : [item.city_name_ru, item.city_name_en, item.city_slug];
  return base.filter(Boolean).map((value) => String(value).trim()).filter(Boolean);
}

function loadCitySupport() {
  const support = {};
  loadCityItems().forEach((item) => {
    if (!item.enabled || !item.city_slug || !item.location_id) return;
    const meta = { id: item.location_id, slug: item.city_slug, label: item.city_name_ru || item.city_name_en || item.city_slug, supportsMetro: Boolean(item.supports_metro) };
    item.aliases.forEach((alias) => {
      support[normalizeCity(alias)] = { ...meta, aliases: item.aliases };
    });
  });
  return support;
}

function listCities() {
  const support = loadCitySupport();
  const unique = new Map();
  Object.values(support).forEach((meta) => {
    const key = `${meta.id}|${meta.slug}`;
    if (!unique.has(key)) unique.set(key, { label: meta.label, id: meta.id, slug: meta.slug, supportsMetro: meta.supportsMetro, aliases: meta.aliases || [] });
  });
  return [...unique.values()].sort((a, b) => a.label.localeCompare(b.label, "ru"));
}

function resolveCityMeta(input, support = loadCitySupport()) {
  const key = normalizeCity(input);
  if (!key) return null;
  if (support[key]) return support[key];
  return Object.entries(support).find(([alias]) => alias.includes(key) || key.includes(alias))?.[1] || null;
}

function normalizeCity(city) {
  return String(city || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/^г\.\s*/g, "")
    .replace(/^город\s+/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  return [true, 1, "1", "true", "yes"].includes(value) || String(value || "").toLowerCase() === "true";
}

module.exports = { loadCitySupport, listCities, normalizeCity, resolveCityMeta };
