const { loadCitySupport, resolveCityMeta } = require("./_lib/cities");
const CITY_SUPPORT = loadCitySupport();

module.exports = async (req, res) => {
  try {
    const city = String(req.query.city || "");
    const dates = String(req.query.dates || "").split(",").map((x) => x.trim()).filter(Boolean);
    const meta = resolveCityMeta(city, CITY_SUPPORT);

    if (!meta) {
      return json(res, 400, { message: "Для этого города пока не настроен публичный маршрут витрины. Профиль и каталог профессий по-прежнему работают." });
    }

    const targetDates = dates.length ? dates : upcomingDates(2);
    const shifts = await loadShiftsForDates(meta, targetDates.slice(0, 2));
    let extendedRange = false;
    if (!shifts.length) {
      const extendedDates = buildExtendedDates(targetDates);
      shifts.push(...await loadShiftsForDates(meta, extendedDates));
      extendedRange = shifts.length > 0;
    }

    return json(res, 200, { cityLabel: meta.label, source: "offers.smena.yandex.ru", extendedRange, shifts: dedupeShifts(shifts) });
  } catch (error) {
    return json(res, 500, { message: "Не удалось получить публичные смены с витрины.", error: error.message });
  }
};

async function loadShiftsForDates(meta, dates) {
  const allShifts = [];
  for (const date of dates) {
    const listUrl = `https://offers.smena.yandex.ru/location-${meta.id}-${meta.slug}/podrabotka?sort=start_time&startDate=${date}`;
    const response = await fetch(listUrl, { headers: { "user-agent": "Mozilla/5.0 (compatible; SmenaProfiler/1.0; +https://vercel.app)" } });
    if (!response.ok) continue;
    const html = await response.text();
    allShifts.push(...parseOffersPage(html, listUrl, date));
  }
  return allShifts;
}

function parseOffersPage(html, listUrl, fallbackDate) {
  const links = extractOfferLinks(html, listUrl);
  const text = decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, "\n"));
  const lines = text.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const shifts = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (!looksLikeDateTime(lines[i])) continue;
    const title = findTitle(lines, i);
    const location = findLocation(lines, i + 1);
    const payText = findPay(lines, i + 1);
    if (!title || !payText) continue;
    const timeMatch = lines[i].match(/(\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2})/);
    const dateLabel = lines[i].replace(/\s*[•·]\s*\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}.*/, "").trim() || fallbackDate;
    const directUrl = matchOfferUrl(title, links);
    shifts.push({ title, date: fallbackDate, dateLabel, time: timeMatch ? timeMatch[1].replace(/\s+/g, "") : "", address: location.address, station: location.station, landmark: location.landmark, payText, payAmount: parsePay(payText), url: directUrl || "", listUrl, isDirectUrl: Boolean(directUrl) });
  }

  return shifts;
}

function extractOfferLinks(html, sourceUrl) {
  const links = [];
  const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html))) {
    const href = absolutizeUrl(match[1], sourceUrl);
    const text = decodeEntities(match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    if (!href || !text || text.length < 4) continue;
    if (!/offers\.smena\.yandex\.ru|smena\.yandex\.ru/i.test(href)) continue;
    links.push({ href, key: normalizeForMatch(text) });
  }
  return dedupeLinks(links);
}

function matchOfferUrl(title, links) {
  const key = normalizeForMatch(title);
  if (!key) return "";
  return links.find((item) => item.key === key)?.href || links.find((item) => item.key.includes(key) || key.includes(item.key))?.href || "";
}

function looksLikeDateTime(value) {
  return /\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}/.test(value) && /[•·]/.test(value);
}

function findTitle(lines, index) {
  for (let i = index - 1; i >= Math.max(0, index - 3); i -= 1) {
    const line = lines[i];
    if (!line || looksLikeDateTime(line)) continue;
    if (/подработка|вакансии|ежедневной оплаты/i.test(line)) continue;
    if (/^\d/.test(line) && /₽/.test(line)) continue;
    if (line.length >= 3) return line;
  }
  return "";
}

function findLocation(lines, start) {
  let address = "";
  let station = "";
  let landmark = "";

  for (let i = start; i < Math.min(lines.length, start + 10); i += 1) {
    const line = String(lines[i] || "").trim();
    if (!line || looksLikeDateTime(line) || /₽/.test(line)) continue;
    if (/взять задание|поделиться|смена|войти/i.test(line)) continue;

    if (!station) {
      const stationMatch = line.match(/(?:м\.?|метро|ст\.?\s*м\.?)[\s:,-]*([А-Яа-яЁёA-Za-z0-9\- ]{3,})/i);
      if (stationMatch) {
        station = stationMatch[1].trim();
        continue;
      }
    }

    if (!address && looksLikeStreetAddress(line)) {
      address = line;
      continue;
    }

    if (!landmark && !looksLikeBrandOnly(line)) {
      landmark = line;
    }
  }

  return {
    address: address || landmark || "",
    station,
    landmark: landmark || ""
  };
}

function looksLikeStreetAddress(line) {
  return /(ул\.?|улица|просп\.?|проспект|шоссе|наб\.?|набережная|пер\.?|переулок|бульвар|пл\.?|площадь|д\.?\s*\d|,\s*\d)/i.test(line);
}

function looksLikeBrandOnly(line) {
  return /^(перекр[её]сток|магнит|пят[её]рочка|вкусвилл|лента|fix price|дикси|ozon|самокат|купер)$/i.test(line);
}

function findPay(lines, start) {
  for (let i = start; i < Math.min(lines.length, start + 8); i += 1) {
    if (/₽|руб/i.test(lines[i])) return lines[i];
  }
  return "";
}

function parsePay(value) {
  const match = String(value || "").replace(/\s/g, "").match(/(\d{3,6})/);
  return match ? Number(match[1]) : 0;
}
function dedupeShifts(shifts) { const seen = new Set(); return shifts.filter((shift) => { const key = `${shift.title}|${shift.dateLabel}|${shift.time}|${shift.address}|${shift.station}|${shift.payText}`; if (seen.has(key)) return false; seen.add(key); return true; }); }
function dedupeLinks(links) { const seen = new Set(); return links.filter((item) => { const key = `${item.href}|${item.key}`; if (seen.has(key)) return false; seen.add(key); return true; }); }
function normalizeForMatch(value) { return String(value || "").toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я0-9\s-]/gi, " ").replace(/\s+/g, " ").trim(); }
function upcomingDates(days = 2) { const now = new Date(); const out = []; for (let d = 1; d <= days; d += 1) { const date = new Date(now); date.setDate(now.getDate() + d); out.push(date.toISOString().slice(0, 10)); } return out; }
function buildExtendedDates(initialDates) {
  const set = new Set(initialDates.filter(Boolean));
  upcomingDates(7).forEach((date) => set.add(date));
  return Array.from(set).slice(0, 7);
}
function absolutizeUrl(href, sourceUrl) { try { return new URL(href, sourceUrl).toString(); } catch { return ""; } }
function decodeEntities(value) { return String(value || "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); }
function json(res, statusCode, payload) { res.statusCode = statusCode; res.setHeader("content-type", "application/json; charset=utf-8"); res.end(JSON.stringify(payload)); }

