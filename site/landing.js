const CITY_SUPPORT = {
  "москва": { id: 213, slug: "moscow", label: "Москва" },
  moscow: { id: 213, slug: "moscow", label: "Москва" },
  msk: { id: 213, slug: "moscow", label: "Москва" }
};

const QUESTIONS = [
  ["work_goal", "Для чего ты сейчас ищешь смены?", "Определи главный мотив", "single", ["Подработка", "Основной доход", "Временная работа", "Изучаю варианты"]],
  ["city", "Из какого ты города?", "Напиши город так, как тебе удобно. Например: Москва", "text"],
  ["shifts_week", "Сколько смен в неделю комфортно?", "Выберем ритм без перегруза", "single", ["1-2", "3-4", "5+"]],
  ["age_group", "Твой возрастной диапазон?", "Это помогает точнее подобрать формат входа и сложность старта", "single", ["18-24", "25-34", "35-44", "45-54", "55+"]],
  ["physical", "Какая физнагрузка комфортна?", "От легких ролей до активных смен", "single", ["Легкая", "Средняя", "Тяжелая"]],
  ["standing", "Как относишься к работе на ногах?", "Есть роли на ногах весь день, а есть более спокойные форматы", "single", ["Всю смену ок", "Только часть смены", "Нужна сидячая"]],
  ["outdoor", "Готов(а) работать на улице?", "Это важно для курьерских и уличных задач", "single", ["Да, в любую погоду", "Только в теплый сезон", "Предпочитаю в помещении"]],
  ["heavy_weight", "Комфортно регулярно переносить 15-20 кг?", "Склады и часть сборки бывают физически активными", "single", ["Да, ок", "Только иногда", "Лучше без тяжелого веса"]],
  ["digital", "Как тебе работа с приложениями и терминалом?", "Это влияет на сборку, кассу и часть складских ролей", "single", ["Уверенно", "Нормально", "Лучше попроще"]],
  ["communication", "Насколько комфортно общаться с клиентами?", "Разделим роли на фронт и бэк", "single", ["Люблю общаться", "Нормально", "Лучше без общения"]],
  ["pay_model", "Как тебе сдельная оплата?", "В некоторых ролях доход сильнее зависит от темпа и объема задач", "single", ["Люблю сдельную", "Ок, если есть минимум", "Только фикс за смену"]],
  ["pay_priority", "Что сейчас важнее всего?", "Выберем между стабильностью, доходом и комфортом", "single", ["Стабильный прогнозируемый доход", "Максимум заработка", "Комфорт и меньше стресса"]],
  ["cleaning", "Как относишься к задачам уборки помещений?", "Это отделяет клининг от других спокойных ролей", "single", ["Да, это ок", "Только зал или офис", "Лучше без уборки"]],
  ["skills", "Где уже есть опыт?", "Выбери до 4 направлений", "multi", ["Сборка заказов", "Выкладка товаров", "Касса", "Кухня", "Бариста", "Курьер", "Кладовщик", "Мерчендайзер", "Промоутер", "Уборка помещений", "Уборка территории", "Администратор/хостес"]],
  ["interests", "Какие направления хочешь попробовать?", "Тоже до 4 вариантов", "multi", ["Сборка заказов", "Выкладка товаров", "Касса", "Кухня", "Бариста", "Курьер", "Кладовщик", "Мерчендайзер", "Промоутер", "Уборка помещений", "Уборка территории", "Администратор/хостес"]],
  ["training_ready", "Готов(а) пройти короткое обучение 1-2 часа?", "Это открывает больше ролей и иногда поднимает ставку", "single", ["Да, если это даст больше возможностей", "Только если обучение короткое", "Предпочитаю без обучения"]]
];

const ROLES = [
  { code: "kitchen", role: "Кухонный работник/повар", family: "Кухня", pay: 5000, tags: ["Профнавык", "Команда", "Рост"], skills: ["Кухня"], fit: { physical: ["Средняя", "Тяжелая"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Да, ок", "Только иногда"], digital: ["Нормально", "Лучше попроще"], communication: ["Нормально", "Лучше без общения"], pay_model: ["Только фикс за смену", "Ок, если есть минимум"], cleaning: ["Только зал или офис", "Лучше без уборки"] } },
  { code: "collector", role: "Сборщик заказов", family: "Сборка и даркстор", pay: 4700, tags: ["Терминал", "Темп", "Точность"], skills: ["Сборка заказов", "Кладовщик"], fit: { physical: ["Средняя", "Тяжелая"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Да, ок", "Только иногда"], digital: ["Уверенно", "Нормально"], communication: ["Лучше без общения", "Нормально"], pay_model: ["Ок, если есть минимум", "Только фикс за смену"], cleaning: ["Только зал или офис", "Лучше без уборки"] } },
  { code: "cashier", role: "Кассир", family: "Ритейл", pay: 4300, tags: ["Фронт", "Терминал", "Новички"], skills: ["Касса"], fit: { physical: ["Легкая", "Средняя"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Лучше без тяжелого веса", "Только иногда"], digital: ["Уверенно", "Нормально"], communication: ["Люблю общаться", "Нормально"], pay_model: ["Только фикс за смену", "Ок, если есть минимум"], cleaning: ["Лучше без уборки", "Только зал или офис"] } },
  { code: "rtz", role: "Выкладка товара/мерчендайзер", family: "Торговый зал", pay: 4100, tags: ["Порядок", "Планограмма", "Спокойный темп"], skills: ["Выкладка товаров", "Мерчендайзер"], fit: { physical: ["Легкая", "Средняя"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Лучше без тяжелого веса", "Только иногда"], digital: ["Нормально", "Лучше попроще"], communication: ["Нормально", "Лучше без общения"], pay_model: ["Только фикс за смену", "Ок, если есть минимум"], cleaning: ["Только зал или офис", "Лучше без уборки"] } },
  { code: "barista", role: "Бариста", family: "Кофе и сервис", pay: 4800, tags: ["Сервис", "Темп", "Обучение"], skills: ["Бариста"], fit: { physical: ["Легкая", "Средняя"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Лучше без тяжелого веса", "Только иногда"], digital: ["Нормально", "Уверенно"], communication: ["Люблю общаться", "Нормально"], pay_model: ["Только фикс за смену", "Ок, если есть минимум"], cleaning: ["Только зал или офис", "Лучше без уборки"] } },
  { code: "courier", role: "Курьер", family: "Доставка", pay: 5600, tags: ["Движение", "Сдельность", "Улица"], skills: ["Курьер"], fit: { physical: ["Средняя", "Тяжелая"], standing: ["Всю смену ок"], outdoor: ["Да, в любую погоду", "Только в теплый сезон"], heavy_weight: ["Да, ок", "Только иногда"], digital: ["Нормально", "Уверенно"], communication: ["Нормально", "Лучше без общения"], pay_model: ["Люблю сдельную", "Ок, если есть минимум"], cleaning: ["Лучше без уборки", "Только зал или офис"] } },
  { code: "warehouse", role: "Кладовщик", family: "Склад", pay: 4900, tags: ["Склад", "Темп", "Точность"], skills: ["Кладовщик", "Сборка заказов"], fit: { physical: ["Средняя", "Тяжелая"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Да, ок", "Только иногда"], digital: ["Нормально", "Уверенно"], communication: ["Лучше без общения", "Нормально"], pay_model: ["Только фикс за смену", "Ок, если есть минимум"], cleaning: ["Лучше без уборки", "Только зал или офис"] } },
  { code: "promoter", role: "Промоутер", family: "Промо и события", pay: 3900, tags: ["Коммуникация", "Легкий вход", "Гибкость"], skills: ["Промоутер", "Администратор/хостес"], fit: { physical: ["Легкая", "Средняя"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Только в теплый сезон", "Предпочитаю в помещении"], heavy_weight: ["Лучше без тяжелого веса"], digital: ["Лучше попроще", "Нормально"], communication: ["Люблю общаться"], pay_model: ["Только фикс за смену", "Ок, если есть минимум"], cleaning: ["Лучше без уборки", "Только зал или офис"] } },
  { code: "cleaner_indoor", role: "Уборка помещений", family: "Клининг", pay: 3900, tags: ["cleaner", "Простой вход", "Без цифры"], skills: ["Уборка помещений"], fit: { physical: ["Легкая", "Средняя"], standing: ["Всю смену ок", "Только часть смены"], outdoor: ["Предпочитаю в помещении"], heavy_weight: ["Лучше без тяжелого веса", "Только иногда"], digital: ["Лучше попроще"], communication: ["Лучше без общения", "Нормально"], pay_model: ["Только фикс за смену"], cleaning: ["Да, это ок"] } },
  { code: "cleaner_outdoor", role: "Уборка территории", family: "Клининг", pay: 4700, tags: ["cleaner", "cold_conditions", "heavy_weight"], skills: ["Уборка территории"], fit: { physical: ["Средняя", "Тяжелая"], standing: ["Всю смену ок"], outdoor: ["Да, в любую погоду", "Только в теплый сезон"], heavy_weight: ["Да, ок", "Только иногда"], digital: ["Лучше попроще"], communication: ["Лучше без общения", "Нормально"], pay_model: ["Только фикс за смену"], cleaning: ["Да, это ок"] } }
];

const STATE = { i: 0, answers: {}, selected: [], badges: [], score: { physical: 50, communication: 50, digital: 50, stability: 50, learning: 50 } };

const UI = {
  startBtn: document.getElementById("startBtn"),
  quiz: document.getElementById("quizSection"),
  result: document.getElementById("resultSection"),
  title: document.getElementById("questionTitle"),
  hint: document.getElementById("questionHint"),
  options: document.getElementById("options"),
  inputWrap: document.getElementById("inputWrap"),
  textAnswer: document.getElementById("textAnswer"),
  textNextBtn: document.getElementById("textNextBtn"),
  badges: document.getElementById("badges"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  multiActions: document.getElementById("multiActions"),
  doneMultiBtn: document.getElementById("doneMultiBtn"),
  profileName: document.getElementById("profileName"),
  profileDesc: document.getElementById("profileDesc"),
  incomeForecast: document.getElementById("incomeForecast"),
  trainReadiness: document.getElementById("trainReadiness"),
  topScore: document.getElementById("topScore"),
  recommendations: document.getElementById("recommendations"),
  realShifts: document.getElementById("realShifts"),
  familyFit: document.getElementById("familyFit"),
  fallbackBox: document.getElementById("fallbackBox"),
  restartBtn: document.getElementById("restartBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  radar: document.getElementById("radar")
};

UI.startBtn.addEventListener("click", startQuiz);
UI.doneMultiBtn.addEventListener("click", submitMulti);
UI.textNextBtn.addEventListener("click", submitText);
UI.textAnswer.addEventListener("keydown", (e) => { if (e.key === "Enter") submitText(); });
UI.restartBtn.addEventListener("click", () => window.location.reload());
UI.downloadBtn.addEventListener("click", downloadProfile);

function startQuiz() {
  resetState();
  UI.result.classList.add("hidden");
  UI.recommendations.innerHTML = "";
  UI.realShifts.innerHTML = "";
  UI.familyFit.innerHTML = "";
  UI.fallbackBox.innerHTML = "";
  UI.fallbackBox.classList.add("hidden");
  UI.quiz.classList.remove("hidden");
  UI.quiz.scrollIntoView({ behavior: "smooth", block: "start" });
  render();
}

function resetState() {
  STATE.i = 0;
  STATE.answers = {};
  STATE.selected = [];
  STATE.badges = [];
  STATE.score = {
    physical: 50,
    communication: 50,
    digital: 50,
    stability: 50,
    learning: 50
  };
}

function render() {
  const [id, text, hint, type, options] = QUESTIONS[STATE.i];
  STATE.selected = [];
  UI.title.textContent = text;
  UI.hint.textContent = hint;
  UI.progressText.textContent = `${STATE.i + 1}/${QUESTIONS.length}`;
  UI.progressBar.style.width = `${((STATE.i + 1) / QUESTIONS.length) * 100}%`;
  UI.badges.innerHTML = STATE.badges.map((x) => `<span class="badge">${x}</span>`).join("");
  UI.options.innerHTML = "";
  UI.inputWrap.classList.add("hidden");
  UI.multiActions.classList.add("hidden");
  if (type === "single") options.forEach((o) => UI.options.appendChild(makeOption(o, () => answerSingle(id, o))));
  if (type === "multi") { options.forEach((o) => UI.options.appendChild(makeOption(o, () => toggleMulti(o)))); UI.multiActions.classList.remove("hidden"); }
  if (type === "text") { UI.inputWrap.classList.remove("hidden"); UI.textAnswer.placeholder = "Введите город"; UI.textAnswer.value = STATE.answers[id] || ""; setTimeout(() => UI.textAnswer.focus(), 50); }
}

function makeOption(text, handler) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "option";
  b.textContent = text;
  b.addEventListener("click", handler);
  return b;
}

function toggleMulti(option) {
  const node = [...UI.options.querySelectorAll(".option")].find((x) => x.textContent === option);
  if (STATE.selected.includes(option)) {
    STATE.selected = STATE.selected.filter((x) => x !== option);
    if (node) node.classList.remove("selected");
    return;
  }
  if (STATE.selected.length >= 4) return;
  STATE.selected.push(option);
  if (node) node.classList.add("selected");
}

function answerSingle(id, answer) {
  STATE.answers[id] = answer;
  adaptScore(id, answer);
  grantBadge(id, answer);
  next();
}

function submitText() {
  const value = UI.textAnswer.value.trim();
  if (!value) return;
  STATE.answers.city = value;
  const norm = normalizeCity(value);
  addBadge(`Город: ${CITY_SUPPORT[norm]?.label || value}`);
  next();
}

function submitMulti() {
  const [id] = QUESTIONS[STATE.i];
  if (!STATE.selected.length) return;
  STATE.answers[id] = [...STATE.selected];
  if (id === "skills") addBadge("Есть база навыков");
  if (id === "interests" && STATE.selected.length >= 3) addBadge("Открыт(а) к новым ролям");
  next();
}

function next() {
  STATE.i += 1;
  if (STATE.i < QUESTIONS.length) return render();
  finish();
}

function adaptScore(id, answer) {
  if (id === "physical") STATE.score.physical = answer === "Легкая" ? 25 : answer === "Средняя" ? 60 : 90;
  if (id === "communication") STATE.score.communication = answer === "Люблю общаться" ? 90 : answer === "Нормально" ? 60 : 20;
  if (id === "digital") STATE.score.digital = answer === "Уверенно" ? 90 : answer === "Нормально" ? 60 : 30;
  if (id === "pay_priority") STATE.score.stability = answer === "Стабильный прогнозируемый доход" ? 90 : answer === "Комфорт и меньше стресса" ? 75 : 40;
  if (id === "training_ready") STATE.score.learning = answer === "Да, если это даст больше возможностей" ? 90 : answer === "Только если обучение короткое" ? 60 : 30;
}

function grantBadge(id, answer) {
  if (id === "digital" && answer === "Уверенно") addBadge("Цифровой профи");
  if (id === "communication" && answer === "Люблю общаться") addBadge("Сильная коммуникация");
  if (id === "outdoor" && answer === "Да, в любую погоду") addBadge("Готов(а) к полевым задачам");
  if (id === "physical" && answer === "Тяжелая") addBadge("Высокая выносливость");
  if (id === "training_ready" && answer === "Да, если это даст больше возможностей") addBadge("Ориентир на рост");
}

function addBadge(text) { if (!STATE.badges.includes(text)) STATE.badges.push(text); }

function finish() {
  const ranked = normalizeCleaning(rankRoles());
  const top = ranked.slice(0, 3);
  const profile = detectProfile();
  const avgPay = Math.round(top.reduce((s, x) => s + x.pay, 0) / Math.max(1, top.length));
  UI.quiz.classList.add("hidden");
  UI.result.classList.remove("hidden");
  UI.profileName.textContent = profile.title;
  UI.profileDesc.textContent = profile.desc;
  UI.incomeForecast.textContent = `${avgPay * 4} - ${(avgPay + 900) * 4} ₽`;
  UI.trainReadiness.textContent = `${STATE.score.learning}/100`;
  UI.topScore.textContent = `${top[0]?.score || 0}%`;
  UI.recommendations.innerHTML = `<h3>Топ-3 профессии для тебя</h3>${top.map((x) => `<div class="rec-card"><h4>${x.role} - match ${x.score}%</h4><p><strong>Семейство:</strong> ${x.family} | <strong>Ориентир по ставке:</strong> ${x.pay} ₽ за смену</p><div>${x.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div></div>`).join("")}`;
  renderFamilies(ranked);
  renderFallback(top);
  drawRadar();
  renderRealShifts(top);
  UI.result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function detectProfile() {
  if (STATE.answers.pay_model === "Люблю сдельную" || STATE.answers.pay_priority === "Максимум заработка") return { title: "Охотник за высоким доходом", desc: "Тебе ближе смены, где можно ускориться, взять больше объема и за счет этого зарабатывать заметно выше среднего." };
  if (STATE.answers.communication === "Лучше без общения") return { title: "Мастер спокойного порядка", desc: "Тебе комфортнее роли без лишнего контакта с клиентами, где важны точность, аккуратность и предсказуемый ритм." };
  if (STATE.answers.training_ready === "Да, если это даст больше возможностей" && (STATE.answers.interests || []).length >= 2) return { title: "Универсал с потенциалом роста", desc: "Ты открыт(а) к новому, готов(а) пройти короткое обучение и постепенно открывать более сильные и доходные роли." };
  return { title: "Стабильный помощник в ритейле", desc: "Тебе подходят понятные смены с умеренной нагрузкой, прозрачной ставкой и быстрым входом без лишнего стресса." };
}

function rankRoles() {
  const skills = new Set(STATE.answers.skills || []);
  const interests = new Set(STATE.answers.interests || []);
  return ROLES.map((r) => {
    let score = 26;
    ["physical", "standing", "outdoor", "heavy_weight", "digital", "communication", "pay_model", "cleaning"].forEach((key) => { if ((r.fit[key] || []).includes(STATE.answers[key])) score += ({ physical: 11, standing: 9, outdoor: 8, heavy_weight: 8, digital: 10, communication: 10, pay_model: 8, cleaning: 8 })[key]; });
    r.skills.forEach((s) => { if (skills.has(s)) score += 7; if (interests.has(s)) score += 5; });
    if (STATE.answers.pay_priority === "Максимум заработка" && r.pay >= 5000) score += 8;
    if (STATE.answers.pay_priority === "Стабильный прогнозируемый доход" && r.pay <= 5000) score += 6;
    if (STATE.answers.work_goal === "Основной доход" && r.pay >= 4700) score += 4;
    if (STATE.answers.work_goal === "Подработка" && r.pay >= 4300) score += 3;
    return { ...r, score: Math.min(100, Math.max(1, Math.round(score))) };
  }).sort((a, b) => b.score - a.score);
}

function normalizeCleaning(list) {
  const out = [...list];
  const isCleaning = (x) => x.tags.includes("cleaner");
  if (isCleaning(out[0])) {
    const idx = out.findIndex((x) => !isCleaning(x));
    if (idx > 0) [out[0], out[idx]] = [out[idx], out[0]];
  }
  const topScore = out[0]?.score || 0;
  return out.map((x) => isCleaning(x) ? { ...x, score: Math.min(x.score, Math.max(1, topScore - 1)) } : x).sort((a, b) => b.score - a.score);
}

function renderFamilies(ranked) {
  const familyMap = {};
  ranked.forEach((x) => { familyMap[x.family] ||= []; familyMap[x.family].push(x.score); });
  const rows = Object.entries(familyMap).map(([family, scores]) => ({ family, fit: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) })).sort((a, b) => b.fit - a.fit);
  UI.familyFit.innerHTML = `<h3>Каталог профессий Смены: твой уровень совпадения</h3>${rows.map((x) => `<div class="rec-card"><p><strong>${x.family}</strong> - ${x.fit}%</p><div class="progress"><span style="width:${x.fit}%"></span></div></div>`).join("")}`;
}

function renderFallback(top) {
  if (top.some((x) => x.score >= 62)) { UI.fallbackBox.classList.add("hidden"); UI.fallbackBox.innerHTML = ""; return; }
  const wl = (STATE.answers.interests || []).slice(0, 3);
  UI.fallbackBox.classList.remove("hidden");
  UI.fallbackBox.classList.add("fallback");
  UI.fallbackBox.innerHTML = `<h3>План Б: если сильных совпадений мало</h3><p>Сейчас под твой профиль мало ролей с высоким матчем. Это не отказ, а сигнал, что стоит либо расширить фильтры, либо подписать тебя на нужные направления.</p><p><strong>Что имеет смысл отслеживать:</strong> ${wl.length ? wl.join(", ") : "Касса, выкладка товара, сборка заказов"}.</p>`;
}

async function renderRealShifts(topRoles) {
  const city = (STATE.answers.city || "").trim();
  UI.realShifts.innerHTML = `<h3>Реальные смены в твоем городе</h3><p class="inline-note">Ищу публичные смены на завтра и послезавтра...</p>`;
  try {
    const dates = upcomingDates();
    const res = await fetch(`/api/shifts?city=${encodeURIComponent(city)}&dates=${dates.join(",")}`);
    const data = await res.json();
    if (!res.ok || !(data.shifts || []).length) {
      UI.realShifts.innerHTML = `<h3>Реальные смены в твоем городе</h3><p class="inline-note">${data.message || "Пока не удалось получить публичные смены для этого города."}</p>`;
      return;
    }
    const ranked = rankPublicShifts(data.shifts, topRoles).slice(0, 3);
    UI.realShifts.innerHTML = `<h3>Реальные смены в твоем городе</h3><p class="inline-note">Публичная витрина Смены на ${data.cityLabel || city}. Ниже 2-3 самые близкие по профилю смены.</p>${ranked.map((x) => `<div class="rec-card"><h4>${escapeHtml(x.title)} - fit ${x.match}%</h4><p><strong>Когда:</strong> ${escapeHtml(x.dateLabel || x.date)}${x.time ? `, ${escapeHtml(x.time)}` : ""}</p><p><strong>Где:</strong> ${escapeHtml(x.address || "Адрес уточняется")}</p><p><strong>Оплата:</strong> ${escapeHtml(x.payText || "Ставка на витрине")}</p><p class="inline-note">${escapeHtml(x.why)}</p>${x.url ? `<a class="shift-link" href="${x.url}" target="_blank" rel="noreferrer">Открыть смену</a>` : ""}</div>`).join("")}`;
  } catch {
    UI.realShifts.innerHTML = `<h3>Реальные смены в твоем городе</h3><p class="inline-note">Профиль уже готов. Блок с реальными сменами недоступен локально или не ответил вовремя.</p>`;
  }
}

function rankPublicShifts(shifts, topRoles) {
  const topCodes = topRoles.map((x) => x.code);
  return shifts.map((s) => {
    const code = inferRoleCode(s.title);
    let match = 48;
    if (topCodes.includes(code)) match += 28;
    if (s.payAmount >= 5000 && STATE.answers.pay_priority === "Максимум заработка") match += 8;
    if (STATE.answers.communication === "Лучше без общения" && ["collector", "warehouse", "cleaner_indoor", "cleaner_outdoor"].includes(code)) match += 7;
    if (STATE.answers.digital === "Уверенно" && ["collector", "cashier"].includes(code)) match += 5;
    if (STATE.answers.outdoor === "Да, в любую погоду" && ["courier", "cleaner_outdoor", "promoter"].includes(code)) match += 4;
    if (STATE.answers.cleaning === "Лучше без уборки" && code.startsWith("cleaner")) match -= 25;
    return { ...s, match: Math.max(1, Math.min(99, match)), why: explainShift(code) };
  }).sort((a, b) => b.match - a.match);
}

function explainShift(code) {
  return {
    kitchen: "Подходит по сочетанию понятной кухни, умеренной нагрузки и фиксированной ставки.",
    collector: "Сильное совпадение по темпу, точности и готовности работать с терминалом.",
    cashier: "Хорошо совпадает с комфортом к общению и базовой цифровой нагрузке.",
    rtz: "Подходит под спокойный магазинный ритм и умеренную физнагрузку.",
    barista: "Подходит по сервисной роли и готовности быстро входить в новые форматы.",
    courier: "Совпадает с динамичным форматом и ориентацией на более высокий доход.",
    warehouse: "Хороший матч по складу, порядку и работе без лишней коммуникации.",
    cleaner_indoor: "Подходит по простому входу и низкому уровню цифровой нагрузки.",
    cleaner_outdoor: "Совпадает с уличным форматом и более физически активными задачами.",
    promoter: "Совпадает с высокой коммуникацией и гибким форматом выхода."
  }[code] || "Эта смена ближе всего к твоему профилю по типу задач и формату работы.";
}

function inferRoleCode(title) {
  const t = (title || "").toLowerCase();
  if (/повар|кухон|кухн/.test(t)) return "kitchen";
  if (/сборщ|комплектов/.test(t)) return "collector";
  if (/касс/.test(t)) return "cashier";
  if (/мерчен|выклад/.test(t)) return "rtz";
  if (/бариста|кофе/.test(t)) return "barista";
  if (/курьер|достав/.test(t)) return "courier";
  if (/кладов|склад/.test(t)) return "warehouse";
  if (/территор/.test(t)) return "cleaner_outdoor";
  if (/уборк|клининг|мойщ/.test(t)) return "cleaner_indoor";
  if (/промо|хостес|консультант/.test(t)) return "promoter";
  return "rtz";
}

function drawRadar() {
  const c = UI.radar, ctx = c.getContext("2d"), labels = ["Физика", "Общение", "Цифра", "Стабильность", "Обучение"], vals = [STATE.score.physical, STATE.score.communication, STATE.score.digital, STATE.score.stability, STATE.score.learning], cx = 160, cy = 130, r = 90, step = (Math.PI * 2) / labels.length;
  ctx.clearRect(0, 0, c.width, c.height); ctx.strokeStyle = "#dbe4ee"; ctx.fillStyle = "#5b6b7a"; ctx.font = '13px "Segoe UI", sans-serif';
  for (let ring = 1; ring <= 4; ring += 1) { ctx.beginPath(); for (let i = 0; i < labels.length; i += 1) { const a = -Math.PI / 2 + i * step, x = cx + Math.cos(a) * (r * ring / 4), y = cy + Math.sin(a) * (r * ring / 4); if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.stroke(); }
  labels.forEach((label, i) => { const a = -Math.PI / 2 + i * step; ctx.fillText(label, cx + Math.cos(a) * (r + 18) - 24, cy + Math.sin(a) * (r + 18)); });
  ctx.beginPath(); vals.forEach((v, i) => { const a = -Math.PI / 2 + i * step, x = cx + Math.cos(a) * (r * v / 100), y = cy + Math.sin(a) * (r * v / 100); if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.closePath(); ctx.fillStyle = "rgba(15, 118, 110, 0.25)"; ctx.strokeStyle = "#0f766e"; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
}

function downloadProfile() {
  const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), answers: STATE.answers, badges: STATE.badges }, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "smena-profile.json"; a.click(); URL.revokeObjectURL(url);
}

function normalizeCity(city) { return city.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim(); }
function upcomingDates() { const n = new Date(), out = []; for (let d = 1; d <= 2; d += 1) { const x = new Date(n); x.setDate(n.getDate() + d); out.push(x.toISOString().slice(0, 10)); } return out; }
function escapeHtml(x) { return String(x || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
