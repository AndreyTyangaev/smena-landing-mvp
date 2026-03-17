const { listCities } = require("./_lib/cities");

module.exports = async (_req, res) => {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("pragma", "no-cache");
  res.setHeader("expires", "0");
  res.setHeader("surrogate-control", "no-store");
  res.end(JSON.stringify({ cities: listCities(), generatedAt: new Date().toISOString() }));
};
