const { listCities } = require("./_lib/cities");

module.exports = async (_req, res) => {
  res.statusCode = 200;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ cities: listCities() }));
};
