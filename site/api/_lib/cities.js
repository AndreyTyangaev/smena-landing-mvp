const fs = require("fs");
const path = require("path");

const DEFAULT_CITIES = [
  { city_name_ru: "Москва", city_name_en: "Moscow", city_slug: "moscow", location_id: 213, offers_url: "https://offers.smena.yandex.ru/location-213-moscow/podrabotka", enabled: true, supports_metro: true, aliases: ["Москва", "moscow", "msk"] },
  { city_name_ru: "Санкт-Петербург", city_name_en: "Saint Petersburg", city_slug: "", location_id: 2, offers_url: "https://offers.smena.yandex.ru/location-2/podrabotka", enabled: true, supports_metro: true, aliases: ["Санкт-Петербург", "Санкт Петербург", "Питер", "СПб", "spb", "saint-petersburg", "saint petersburg"] },
  { city_name_ru: "Екатеринбург", city_name_en: "Yekaterinburg", city_slug: "yekaterinburg", location_id: 54, offers_url: "https://offers.smena.yandex.ru/location-54-yekaterinburg/podrabotka", enabled: true, supports_metro: true, aliases: ["Екатеринбург", "ekaterinburg", "yekaterinburg", "екб"] },
  { city_name_ru: "Нижний Новгород", city_name_en: "Nizhny Novgorod", city_slug: "nizhny-novgorod", location_id: 47, offers_url: "https://offers.smena.yandex.ru/location-47-nizhny-novgorod/podrabotka", enabled: true, supports_metro: true, aliases: ["Нижний Новгород", "Нижний", "nizhny novgorod", "nizhny-novgorod"] }
];

function loadCityItems() {
  const csvPath = findCsvPath();
  if (csvPath && fs.existsSync(csvPath)) {
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

  const jsonPath = findJsonPath();
  if (jsonPath && fs.existsSync(jsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
      if (Array.isArray(parsed) && parsed.length) return parsed.map(normalizeItem);
    } catch {}
  }

  return DEFAULT_CITIES.map(normalizeItem);
}

function normalizeItem(item) {
  const cityRu = decodeMaybeMojibake(String(item.city_name_ru || "").trim());
  const cityEn = decodeMaybeMojibake(String(item.city_name_en || "").trim());
  const citySlug = String(item.city_slug || "").trim();
  const directOffersUrl = String(item.offers_url || item.offersUrl || "").trim();
  const offersUrl = directOffersUrl || (looksLikeUrl(cityEn) ? cityEn : "");
  const derivedRoute = extractRouteFromOffersUrl(offersUrl);
  return {
    city_name_ru: cityRu,
    city_name_en: cityEn && !looksLikeUrl(cityEn) ? cityEn : "",
    city_slug: citySlug || derivedRoute.slug,
    offers_url: offersUrl,
    location_id: Number(item.location_id) || derivedRoute.id,
    enabled: isEnabled(item.enabled),
    supports_metro: isEnabled(item.supports_metro),
    aliases: normalizeAliases(item)
  };
}

function normalizeAliases(item) {
  const rawAliases = Array.isArray(item.aliases) ? item.aliases : [item.city_name_ru, item.city_name_en, item.city_slug];
  const base = rawAliases
    .filter(Boolean)
    .map((value) => decodeMaybeMojibake(String(value).trim()))
    .filter(Boolean)
    .filter((value) => !looksLikeUrl(value));
  return [...new Set(base)];
}

function loadCitySupport() {
  const support = {};
  loadCityItems().forEach((item) => {
    if (!item.enabled || !item.location_id || (!item.city_slug && !item.offers_url)) return;
    const meta = { id: item.location_id, slug: item.city_slug, label: item.city_name_ru || item.city_name_en || item.city_slug, supportsMetro: Boolean(item.supports_metro), offersUrl: item.offers_url || "" };
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
    if (!unique.has(key)) unique.set(key, { label: meta.label, id: meta.id, slug: meta.slug, supportsMetro: meta.supportsMetro, aliases: meta.aliases || [], offersUrl: meta.offersUrl || "" });
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

function findCsvPath() {
  const candidates = [
    path.join(process.cwd(), "Cities.csv"),
    path.join(process.cwd(), "cities.csv"),
    path.join(process.cwd(), "data", "cities.csv"),
    path.join(__dirname, "..", "..", "data", "cities.csv"),
    path.join(__dirname, "..", "..", "..", "cities.csv")
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

function findJsonPath() {
  const candidates = [
    path.join(process.cwd(), "site", "data", "cities.generated.json"),
    path.join(process.cwd(), "data", "cities.generated.json"),
    path.join(__dirname, "..", "..", "data", "cities.generated.json")
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
}

function looksLikeUrl(value) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

function extractRouteFromOffersUrl(url) {
  const value = String(url || "").trim();
  const match = value.match(/location-(\d+)(?:-([^/?#]+))?\/podrabotka/i);
  return {
    id: match ? Number(match[1]) : 0,
    slug: match && match[2] ? match[2] : ""
  };
}

function decodeMaybeMojibake(value) {
  let text = String(value || "");
  for (let i = 0; i < 2; i += 1) {
    if (!/[РСЃ]/.test(text)) break;
    try {
      const decoded = Buffer.from(text, "latin1").toString("utf8");
      if (decoded && decoded !== text) text = decoded;
    } catch {
      break;
    }
  }
  return text;
}

function isEnabled(value) {
  return [true, 1, "1", "true", "yes"].includes(value) || String(value || "").toLowerCase() === "true";
}

module.exports = { loadCitySupport, listCities, normalizeCity, resolveCityMeta };
