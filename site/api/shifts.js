const { loadCitySupport, normalizeCity } = require("./_lib/cities");

const CITY_SUPPORT = loadCitySupport();

module.exports = async (req, res) => {
  try {
    const city = normalizeCity(req.query.city || "");
    const dates = String(req.query.dates || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const meta = CITY_SUPPORT[city];

    if (!meta) {
      return json(res, 400, {
        message: "Для этого города пока не настроен публичный маршрут витрины. Профиль и каталог профессий по-прежнему работают."
      });
    }

    const targetDates = dates.length ? dates : upcomingDates(2);
    const allShifts = await loadShiftsForDates(meta, targetDates.slice(0, 2));
    let extendedRange = false;

    if (!allShifts.length && !dates.length) {
      const backupDates = upcomingDates(4).slice(2);
      allShifts.push(...await loadShiftsForDates(meta, backupDates));
      extendedRange = allShifts.length > 0;
    }

    return json(res, 200, {
      cityLabel: meta.label,
      source: "offers.smena.yandex.ru",
      extendedRange,
      shifts: dedupeShifts(allShifts)
    });
  } catch (error) {
    return json(res, 500, {
      message: "Не удалось получить публичные смены с витрины.",
      error: error.message
    });
  }
};

async function loadShiftsForDates(meta, dates) {
  const allShifts = [];
  for (const date of dates) {
    const url = `https://offers.smena.yandex.ru/location-${meta.id}-${meta.slug}/podrabotka?sort=start_time&startDate=${date}`;
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; SmenaProfiler/1.0; +https://vercel.app)"
      }
    });

    if (!response.ok) continue;
    const html = await response.text();
    allShifts.push(...parseOffersPage(html, url, date));
  }
  return allShifts;
}

function parseOffersPage(html, sourceUrl, fallbackDate) {
  const links = extractOfferLinks(html, sourceUrl);
  const text = decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, "\n")
  );

  const lines = text
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((line) => !/^яндекс/i.test(line))
    .filter((line) => !/^поделиться/i.test(line))
    .filter((line) => !/^сортировка/i.test(line));

  const shifts = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (!looksLikeDateTime(lines[i])) continue;

    const title = findTitle(lines, i);
    const address = findAddress(lines, i + 1);
    const payText = findPay(lines, i + 1);

    if (!title || !payText) continue;

    const dateTime = lines[i];
    const timeMatch = dateTime.match(/(\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2})/);
    const dateLabel = dateTime.replace(/\s*•\s*\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}.*/, "").trim() || fallbackDate;
    const directUrl = matchOfferUrl(title, links);

    shifts.push({
      title,
      date: fallbackDate,
      dateLabel,
      time: timeMatch ? timeMatch[1].replace(/\s+/g, "") : "",
      address,
      payText,
      payAmount: parsePay(payText),
      url: directUrl || "",
      listUrl: sourceUrl,
      isDirectUrl: Boolean(directUrl)
    });
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
    if (!href || !text) continue;
    if (!/offers\.smena\.yandex\.ru|smena\.yandex\.ru/i.test(href)) continue;
    if (text.length < 4) continue;
    links.push({ href, key: normalizeForMatch(text) });
  }

  return dedupeLinks(links);
}

function matchOfferUrl(title, links) {
  const key = normalizeForMatch(title);
  if (!key) return "";

  const exact = links.find((item) => item.key === key);
  if (exact) return exact.href;

  const contains = links.find((item) => item.key.includes(key) || key.includes(item.key));
  if (contains) return contains.href;

  const words = key.split(" ").filter((x) => x.length > 3);
  const fuzzy = links.find((item) => words.some((word) => item.key.includes(word)));
  return fuzzy ? fuzzy.href : "";
}

function looksLikeDateTime(value) {
  return /\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}/.test(value) && /•/.test(value);
}

function findTitle(lines, index) {
  for (let i = index - 1; i >= Math.max(0, index - 3); i -= 1) {
    const line = lines[i];
    if (!line || looksLikeDateTime(line)) continue;
    if (/подработка|вакансии|ежедневной оплат/i.test(line)) continue;
    if (/^\d/.test(line) && /₽/.test(line)) continue;
    if (line.length < 3) continue;
    return line;
  }
  return "";
}

function findAddress(lines, start) {
  for (let i = start; i < Math.min(lines.length, start + 6); i += 1) {
    const line = lines[i];
    if (!line || looksLikeDateTime(line)) continue;
    if (/₽/.test(line)) continue;
    if (/взять задание/i.test(line)) continue;
    if (/^\d/.test(line) && line.length < 12) continue;
    if (/[а-яё]/i.test(line)) return line;
  }
  return "";
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

function dedupeShifts(shifts) {
  const seen = new Set();
  return shifts.filter((shift) => {
    const key = `${shift.title}|${shift.dateLabel}|${shift.time}|${shift.address}|${shift.payText}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeLinks(links) {
  const seen = new Set();
  return links.filter((item) => {
    const key = `${item.href}|${item.key}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeForMatch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function upcomingDates(days = 2) {
  const now = new Date();
  const out = [];
  for (let d = 1; d <= days; d += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    out.push(date.toISOString().slice(0, 10));
  }
  return out;
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function absolutizeUrl(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return "";
  }
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
