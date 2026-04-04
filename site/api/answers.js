module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("access-control-allow-methods", "POST, OPTIONS");
    res.setHeader("access-control-allow-headers", "content-type, x-sheets-token");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: "Method Not Allowed" });
  }

  try {
    const payload = await parseJsonBody(req);
    const webhookUrl = String(process.env.GOOGLE_SHEETS_WEBHOOK_URL || "").trim();
    const webhookToken = String(process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN || "").trim();

    if (!webhookUrl) {
      return json(res, 200, {
        ok: false,
        skipped: true,
        message: "GOOGLE_SHEETS_WEBHOOK_URL is not configured"
      });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...(webhookToken ? { "x-sheets-token": webhookToken } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const bodyText = await safeText(response);
      return json(res, 502, {
        ok: false,
        message: "Google Sheets webhook returned error",
        status: response.status,
        body: bodyText
      });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 400, {
      ok: false,
      message: "Invalid payload",
      error: String(error?.message || error || "unknown error")
    });
  }
};

async function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) return JSON.parse(req.body);

  const raw = await readRawBody(req);
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

async function readRawBody(req) {
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function safeText(response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
