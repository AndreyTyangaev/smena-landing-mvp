const fs = require("fs");
const path = require("path");

const DEFAULT_CITIES = [
  {
    city_name_ru: "Москва",
    city_name_en: "Moscow",
    city_slug: "moscow",
    location_id: 213,
    enabled: true,
    supports_metro: true,
    aliases: ["Москва", "moscow", "msk"]
  },
  {
    city_name_ru: "Санкт-Петербург",
    city_name_en: "Saint Petersburg",
    city_slug: "saint-petersburg",
    location_id: 2,
    enabled: true,
    supports_metro: true,
    aliases: ["Санкт-Петербург", "Санкт Петербург", "Питер", "СПб", "saint-petersburg", "saint petersburg"]
  },
  {
    city_name_ru: "Астрахань",
    city_name_en: "Astrakhan",
    city_slug: "astrahan",
    location_id: 37,
    enabled: true,
    supports_metro: false,
    aliases: ["Астрахань", "astrakhan", "astrahan"]
  },
  {
    city_name_ru: "Архангельск",
    city_name_en: "Arkhangelsk",
    city_slug: "arkhangelsk",
    location_id: 20,
    enabled: true,
    supports_metro: false,
    aliases: ["Архангельск", "arkhangelsk"]
  }
];

function loadCitySupport() {
  const items = loadCityItems();
  const result = {};

  items.forEach((item) => {
    if (!item || !item.enabled) return;

    const label = cleanText(item.city_name_ru || item.city_name_en || item.city_slug || "").trim();
    const slug = String(item.city_slug || "").trim();
    const id = Number(item.location_id);
    const supportsMetro = Boolean(item.supports_metro);
    const aliases = Array.isArray(item.aliases)
      ? item.aliases
      : [item.city_name_ru, item.city_name_en, item.city_slug];

    if (!label || !slug || !id) return;

    aliases
      .filter(Boolean)
      .map((value) => normalizeCity(value))
      .filter(Boolean)
      .forEach((alias) => {
        result[alias] = { id, slug, label, supportsMetro };
      });
  });

  return result;
}

function loadCityItems() {
  const jsonPath = path.join(process.cwd(), "site", "data", "cities.generated.json");
  if (fs.existsSync(jsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeItem);
    } catch {
      // fall through to csv/defaults
    }
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
    } catch {
      // fall back to defaults
    }
  }

  return DEFAULT_CITIES.map(normalizeItem);
}

function normalizeItem(item) {
  return {
    city_name_ru: cleanText(item.city_name_ru || ""),
    city_name_en: cleanText(item.city_name_en || ""),
    city_slug: String(item.city_slug || "").trim(),
    location_id: Number(item.location_id),
    enabled: isEnabled(item.enabled),
    supports_metro: isEnabled(item.supports_metro),
    aliases: normalizeAliases(item)
  };
}

function normalizeAliases(item) {
  const base = Array.isArray(item.aliases)
    ? item.aliases
    : [item.city_name_ru, item.city_name_en, item.city_slug];

  return base
    .filter(Boolean)
    .map((value) => cleanText(String(value)).trim())
    .filter(Boolean);
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

function resolveCityMeta(input, support = loadCitySupport()) {
  const normalized = normalizeCity(input);
  if (!normalized) return null;
  if (support[normalized]) return support[normalized];

  const compact = normalized.replace(/\s+/g, "");
  const entries = Object.entries(support);
  const fuzzy = entries.find(([alias]) => {
    const compactAlias = alias.replace(/\s+/g, "");
    return alias.includes(normalized) || normalized.includes(alias) || compactAlias === compact;
  });

  return fuzzy ? fuzzy[1] : null;
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

function cleanText(value) {
  const text = String(value || "");
  if (!/[ÐÑРСЃв]/.test(text)) return text;

  try {
    let best = text;
    let current = text;

    for (let i = 0; i < 3; i += 1) {
      const decoded = Buffer.from(current, "cp1251").toString("utf8");
      if (scoreCyrillic(decoded) > scoreCyrillic(best)) best = decoded;
      if (decoded === current) break;
      current = decoded;
    }

    return best;
  } catch {
    return text;
  }
}

function scoreCyrillic(value) {
  return (String(value || "").match(/[А-Яа-яЁё]/g) || []).length;
}

function normalizeCity(city) {
  return cleanText(city)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/^г\.\s*/g, "")
    .replace(/^город\s+/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = {
  loadCitySupport,
  listCities,
  normalizeCity,
  resolveCityMeta
};

