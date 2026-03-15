const CITY_SUPPORT = {
  "москва": { id: 213, slug: "moscow", label: "Москва" },
  moscow: { id: 213, slug: "moscow", label: "Москва" },
  msk: { id: 213, slug: "moscow", label: "Москва" }
};

module.exports = async (req, res) => {
  try {
    const city = normalizeCity(req.query.city || "");
    const dates = String(req.query.dates || "").split(",").map((x) => x.trim()).filter(Boolean);
    const meta = CITY_SUPPORT[city];

    if (!meta) {
      return json(res, 400, {
        message: "Пока парсинг публичных смен подключен для Москвы. Для других городов оставим профиль и каталог профессий."
      });
    }

    const targetDates = dates.length ? dates : upcomingDates();
    const allShifts = [];

    for (const date of targetDates.slice(0, 2)) {
      const url = `https://offers.smena.yandex.ru/location-${meta.id}-${meta.slug}/podrabotka?sort=start_time&startDate=${date}`;
      const response = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; SmenaProfiler/1.0; +https://vercel.app)"
        }
      });

      if (!response.ok) continue;
      const html = await response.text();
      const parsed = parseOffersPage(html, url, date);
      allShifts.push(...parsed);
    }

    const unique = dedupeShifts(allShifts);
    return json(res, 200, {
      cityLabel: meta.label,
      source: "offers.smena.yandex.ru",
      shifts: unique
    });
  } catch (error) {
    return json(res, 500, {
      message: "Не удалось получить публичные смены с витрины.",
      error: error.message
    });
  }
};

function parseOffersPage(html, sourceUrl, fallbackDate) {
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
    .filter((line) => !/^Яндекс/i.test(line))
    .filter((line) => !/^Поделиться/i.test(line))
    .filter((line) => !/^Сортировка/i.test(line));

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
    const payAmount = parsePay(payText);

    shifts.push({
      title,
      date: fallbackDate,
      dateLabel,
      time: timeMatch ? timeMatch[1].replace(/\s+/g, "") : "",
      address,
      payText,
      payAmount,
      url: sourceUrl
    });
  }

  return shifts;
}

function looksLikeDateTime(value) {
  return /\d{2}:\d{2}\s*[-–]\s*\d{2}:\d{2}/.test(value) && /•/.test(value);
}

function findTitle(lines, index) {
  for (let i = index - 1; i >= Math.max(0, index - 3); i -= 1) {
    const line = lines[i];
    if (!line) continue;
    if (looksLikeDateTime(line)) continue;
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
    if (!line) continue;
    if (looksLikeDateTime(line)) continue;
    if (/₽/.test(line)) continue;
    if (/взять задание/i.test(line)) continue;
    if (/^\d/.test(line) && line.length < 12) continue;
    if (/[а-яё]/i.test(line)) return line;
  }
  return "";
}

function findPay(lines, start) {
  for (let i = start; i < Math.min(lines.length, start + 8); i += 1) {
    const line = lines[i];
    if (/₽|руб/i.test(line)) return line;
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

function normalizeCity(city) {
  return String(city || "").toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

function upcomingDates() {
  const now = new Date();
  const out = [];
  for (let d = 1; d <= 2; d += 1) {
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

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
