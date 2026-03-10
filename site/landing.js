const questions = [
  { id: "work_goal", text: "Для чего ты сейчас ищешь смены?", hint: "Определи главный мотив", options: ["Подработка", "Основной доход", "Временная работа", "Изучаю варианты"] },
  { id: "city", text: "Из какого ты города?", hint: "Подберем направления с учетом региона", options: ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Другой город"] },
  { id: "shifts_week", text: "Сколько смен в неделю комфортно?", hint: "Нужен реалистичный ритм", options: ["1-2", "3-4", "5+"] },
  { id: "age_group", text: "Твой возрастной диапазон?", hint: "Нужно для адаптации сложности и онбординга", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
  { id: "physical", text: "Какая физнагрузка комфортна?", hint: "Сверим с ролями по тяжести", options: ["Легкая", "Средняя", "Тяжелая"] },
  { id: "standing", text: "Как относишься к работе на ногах?", hint: "Учитываем стоячие и смешанные смены", options: ["Всю смену ок", "Только часть смены", "Нужна сидячая"] },
  { id: "outdoor", text: "Готов(а) работать на улице в любую погоду?", hint: "Важно для территории и курьерских задач", options: ["Да, в любую погоду", "Только в теплый сезон", "Предпочитаю в помещении"] },
  { id: "heavy_weight", text: "Комфортно регулярно переносить 15-20 кг?", hint: "Нужно для части складских и уличных ролей", options: ["Да, ок", "Только иногда", "Лучше без тяжелого веса"] },
  { id: "digital", text: "Как тебе работа с приложениями/терминалом?", hint: "Определяет цифровую сложность ролей", options: ["Уверенно", "Нормально", "Лучше попроще"] },
  { id: "communication", text: "Насколько комфортно общаться с клиентами?", hint: "Разделяем фронт- и бэк-позиции", options: ["Люблю общаться", "Нормально", "Лучше без общения"] },
  { id: "pay_model", text: "Как тебе сдельная оплата (зависит от объема)?", hint: "Это влияет на формат предложений", options: ["Люблю сдельную", "Ок, если есть минимум", "Только фикс за смену"] },
  { id: "pay_priority", text: "Что сейчас важнее всего?", hint: "Баланс дохода, стабильности и комфорта", options: ["Стабильный прогнозируемый доход", "Максимум заработка", "Комфорт и меньше стресса"] },
  { id: "cleaning", text: "Готов(а) к задачам уборки помещений/санузлов?", hint: "Важно для cleaner-семейства", options: ["Да, это ок", "Только зал/офис", "Лучше без уборки"] },
  { id: "skills", text: "Где уже есть опыт? (выбери до 4)", hint: "Это основа skills-вектора", multi: true, minSelected: 2, options: ["Сборка заказов", "Выкладка товаров", "Уборка помещений", "Уборка территории", "Касса", "Кухня", "Бариста", "Курьер", "Кладовщик", "Мерчендайзер", "Промоутер", "Администратор/хостес"] },
  { id: "interests", text: "Какие направления хочешь попробовать? (до 4)", hint: "Сигнал для запуска новых профессий", multi: true, minSelected: 2, options: ["Сборка заказов", "Выкладка товаров", "Уборка помещений", "Уборка территории", "Касса", "Кухня", "Бариста", "Курьер", "Кладовщик", "Мерчендайзер", "Промоутер", "Администратор/хостес"] },
  { id: "training_ready", text: "Готов(а) пройти короткое обучение 1-2 часа?", hint: "Нужно для ролей с training_required", options: ["Да, особенно если это дает рост дохода", "Только если очень коротко", "Предпочитаю без обучения"] }
];

const rolesCatalog = [
  { role: "Сборщик заказов", family: "Сборка", city: ["Москва", "Санкт-Петербург", "Казань"], intensity: "Тяжелая", standing: "Всю смену ок", outdoor: "Предпочитаю в помещении", heavy: "Да, ок", digital: "Нормально", communication: "Лучше без общения", payModel: "Люблю сдельную", cleaning: "Только зал/офис", training: "Да, особенно если это дает рост дохода", skills: ["Сборка заказов", "Кладовщик"], pay: 5200, tags: ["collector", "Терминал", "Сдельная"] },
  { role: "Выкладка товаров", family: "Торговый зал", city: ["Москва", "Санкт-Петербург", "Екатеринбург"], intensity: "Средняя", standing: "Только часть смены", outdoor: "Предпочитаю в помещении", heavy: "Только иногда", digital: "Нормально", communication: "Нормально", payModel: "Только фикс за смену", cleaning: "Только зал/офис", training: "Только если очень коротко", skills: ["Выкладка товаров", "Мерчендайзер"], pay: 4300, tags: ["rtz", "Планограмма", "Фикс"] },
  { role: "Уборка помещений", family: "Клининг", city: ["Москва", "Казань", "Екатеринбург"], intensity: "Средняя", standing: "Только часть смены", outdoor: "Предпочитаю в помещении", heavy: "Только иногда", digital: "Лучше попроще", communication: "Лучше без общения", payModel: "Только фикс за смену", cleaning: "Да, это ок", training: "Только если очень коротко", skills: ["Уборка помещений"], pay: 3900, tags: ["cleaner", "Простой вход", "Без цифры"] },
  { role: "Уборка территории", family: "Клининг", city: ["Москва", "Санкт-Петербург"], intensity: "Тяжелая", standing: "Всю смену ок", outdoor: "Да, в любую погоду", heavy: "Да, ок", digital: "Лучше попроще", communication: "Лучше без общения", payModel: "Только фикс за смену", cleaning: "Да, это ок", training: "Только если очень коротко", skills: ["Уборка территории"], pay: 4700, tags: ["cleaner", "cold_conditions", "heavy_weight"] },
  { role: "Кассир", family: "Торговый зал", city: ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"], intensity: "Легкая", standing: "Только часть смены", outdoor: "Предпочитаю в помещении", heavy: "Лучше без тяжелого веса", digital: "Нормально", communication: "Люблю общаться", payModel: "Только фикс за смену", cleaning: "Только зал/офис", training: "Да, особенно если это дает рост дохода", skills: ["Касса"], pay: 4400, tags: ["Клиенты", "Стабильность", "Обучение"] },
  { role: "Кухонный работник/повар", family: "Кухня", city: ["Москва", "Санкт-Петербург"], intensity: "Средняя", standing: "Всю смену ок", outdoor: "Предпочитаю в помещении", heavy: "Только иногда", digital: "Лучше попроще", communication: "Лучше без общения", payModel: "Ок, если есть минимум", cleaning: "Да, это ок", training: "Да, особенно если это дает рост дохода", skills: ["Кухня"], pay: 5000, tags: ["Профнавык", "Команда", "Рост"] },
  { role: "Бариста", family: "HoReCa", city: ["Москва", "Санкт-Петербург"], intensity: "Средняя", standing: "Всю смену ок", outdoor: "Предпочитаю в помещении", heavy: "Лучше без тяжелого веса", digital: "Уверенно", communication: "Люблю общаться", payModel: "Ок, если есть минимум", cleaning: "Только зал/офис", training: "Да, особенно если это дает рост дохода", skills: ["Бариста"], pay: 5600, tags: ["Сервис", "Премиальные точки", "Рост дохода"] },
  { role: "Курьер", family: "Логистика", city: ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"], intensity: "Тяжелая", standing: "Всю смену ок", outdoor: "Да, в любую погоду", heavy: "Только иногда", digital: "Нормально", communication: "Нормально", payModel: "Люблю сдельную", cleaning: "Лучше без уборки", training: "Предпочитаю без обучения", skills: ["Курьер"], pay: 6000, tags: ["Сдельная", "Улица", "Максимум дохода"] }
];

const profileMap = [
  { key: "stable_retail", title: "Стабильный помощник в торговле", when: (a) => a.pay_priority === "Стабильный прогнозируемый доход" && a.physical !== "Тяжелая", desc: "Тебе подходят роли с понятным ритмом, умеренной нагрузкой и фиксированным заработком." },
  { key: "dynamic_earner", title: "Охотник за заработком", when: (a) => a.pay_model === "Люблю сдельную" || a.pay_priority === "Максимум заработка", desc: "Ты готов(а) к динамичным сменам, где доход растет вместе с темпом и объемом задач." },
  { key: "quiet_operator", title: "Мастер спокойного порядка", when: (a) => a.communication === "Лучше без общения", desc: "Тебе комфортнее бэк-форматы, где важны аккуратность, темп и меньше клиентского контакта." },
  { key: "growth_track", title: "Потенциал быстрого роста", when: (a) => a.training_ready === "Да, особенно если это дает рост дохода" && (a.interests || []).length >= 2, desc: "Ты готов(а) учиться и расширять профнавыки, чтобы открывать более оплачиваемые роли." }
];

const state = { index: 0, answers: {}, badges: [], selected: [], score: { physical: 50, communication: 50, digital: 50, stability: 50, learning: 50 } };
const ui = {
  startBtn: document.getElementById("startBtn"), learnBtn: document.getElementById("learnBtn"), quizSection: document.getElementById("quizSection"), resultSection: document.getElementById("resultSection"),
  title: document.getElementById("questionTitle"), hint: document.getElementById("questionHint"), options: document.getElementById("options"), badges: document.getElementById("badges"),
  progressText: document.getElementById("progressText"), progressBar: document.getElementById("progressBar"), multiActions: document.getElementById("multiActions"), doneMultiBtn: document.getElementById("doneMultiBtn"),
  profileName: document.getElementById("profileName"), profileDesc: document.getElementById("profileDesc"), incomeForecast: document.getElementById("incomeForecast"), trainReadiness: document.getElementById("trainReadiness"),
  topScore: document.getElementById("topScore"), recommendations: document.getElementById("recommendations"), familyFit: document.getElementById("familyFit"), fallbackBox: document.getElementById("fallbackBox"),
  restartBtn: document.getElementById("restartBtn"), downloadBtn: document.getElementById("downloadBtn"), radar: document.getElementById("radar")
};

ui.startBtn.addEventListener("click", () => { ui.quizSection.classList.remove("hidden"); ui.quizSection.scrollIntoView({ behavior: "smooth", block: "start" }); renderQuestion(); });
if (ui.learnBtn) { ui.learnBtn.addEventListener("click", () => { const about = document.getElementById("about"); if (about) about.scrollIntoView({ behavior: "smooth" }); }); }
ui.restartBtn.addEventListener("click", () => window.location.reload());
ui.downloadBtn.addEventListener("click", downloadProfile);
ui.doneMultiBtn.addEventListener("click", submitMulti);

function renderQuestion() {
  const q = questions[state.index];
  state.selected = [];
  ui.title.textContent = q.text;
  ui.hint.textContent = q.hint;
  ui.progressText.textContent = `${state.index + 1}/${questions.length}`;
  ui.progressBar.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  ui.options.innerHTML = "";
  if (q.multi) { ui.multiActions.classList.remove("hidden"); ui.doneMultiBtn.textContent = `Готово (минимум ${q.minSelected})`; } else { ui.multiActions.classList.add("hidden"); }

  q.options.forEach((option) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = option;
    b.addEventListener("click", () => q.multi ? toggleMulti(option, b) : submitSingle(q.id, option));
    ui.options.appendChild(b);
  });

  ui.badges.innerHTML = state.badges.map((b) => `<span class="badge">${b}</span>`).join("");
}

function toggleMulti(option, btn) {
  if (state.selected.includes(option)) {
    state.selected = state.selected.filter((x) => x !== option);
    btn.classList.remove("selected");
  } else if (state.selected.length < 4) {
    state.selected.push(option);
    btn.classList.add("selected");
  }
}

function submitSingle(id, answer) {
  state.answers[id] = answer;
  adaptScore(id, answer);
  nextStep();
}

function submitMulti() {
  const q = questions[state.index];
  if (state.selected.length < q.minSelected) return;
  state.answers[q.id] = [...state.selected];
  if (q.id === "skills" || q.id === "interests") grantBadge("Исследователь профессий");
  if (q.id === "interests" && state.selected.length >= 3) grantBadge("Открыт(а) новому");
  nextStep();
}

function nextStep() {
  state.index += 1;
  if (state.index < questions.length) renderQuestion(); else finish();
}

function adaptScore(id, answer) {
  if (id === "physical") state.score.physical = answer === "Легкая" ? 25 : answer === "Средняя" ? 60 : 90;
  if (id === "communication") state.score.communication = answer === "Люблю общаться" ? 90 : answer === "Нормально" ? 60 : 20;
  if (id === "digital") state.score.digital = answer === "Уверенно" ? 90 : answer === "Нормально" ? 60 : 30;
  if (id === "pay_priority") state.score.stability = answer === "Стабильный прогнозируемый доход" ? 90 : answer === "Комфорт и меньше стресса" ? 70 : 40;
  if (id === "training_ready") state.score.learning = answer === "Да, особенно если это дает рост дохода" ? 90 : answer === "Только если очень коротко" ? 60 : 30;
  if (id === "digital" && answer === "Уверенно") grantBadge("Цифровой профи");
  if (id === "outdoor" && answer === "Да, в любую погоду") grantBadge("Готов(а) к полевым задачам");
}

function grantBadge(text) { if (!state.badges.includes(text)) state.badges.push(text); }

function finish() {
  const profile = detectProfile();
  const ranked = enforceTopRule(rankRoles(state.answers));
  const top = ranked.slice(0, 3);

  ui.quizSection.classList.add("hidden");
  ui.resultSection.classList.remove("hidden");
  ui.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

  ui.profileName.textContent = profile.title;
  ui.profileDesc.textContent = profile.desc;
  const avg = top.length ? Math.round(top.reduce((s, r) => s + r.pay, 0) / top.length) : 4200;
  ui.incomeForecast.textContent = `${avg * 4} - ${(avg + 900) * 4} ₽`;
  ui.trainReadiness.textContent = `${state.score.learning}/100`;
  ui.topScore.textContent = `${top[0] ? top[0].score : 0}%`;

  renderRecommendations(top);
  renderFamilyFit(ranked);
  renderFallback(top);
  drawRadar();
}

function enforceTopRule(ranked) {
  if (!ranked.length) return ranked;
  if (ranked[0].family !== "Клининг") return ranked;

  const fallbackIdx = ranked.findIndex((r) => r.family !== "Клининг");
  if (fallbackIdx <= 0) return ranked;

  const reordered = [...ranked];
  const first = reordered[0];
  reordered[0] = reordered[fallbackIdx];
  reordered[fallbackIdx] = first;
  return reordered;
}
function detectProfile() {
  for (const p of profileMap) if (p.when(state.answers)) return p;
  return { key: "balanced_explorer", title: "Сбалансированный исследователь", desc: "Ты выбираешь комфортный старт и постепенно открываешь подходящие профессии по мере опыта." };
}

function rankRoles(a) {
  const userSkills = new Set(a.skills || []);
  const userInterests = new Set(a.interests || []);

  return rolesCatalog
    .map((r) => {
      let score = 15;
      if (r.city.includes(a.city)) score += 10;
      if (r.intensity === a.physical) score += 11;
      if (r.standing === a.standing) score += 9;
      if (r.outdoor === a.outdoor) score += 8;
      if (r.heavy === a.heavy_weight) score += 8;
      if (r.digital === a.digital) score += 10;
      if (r.communication === a.communication) score += 10;
      if (r.payModel === a.pay_model) score += 8;
      if (r.cleaning === a.cleaning) score += 6;
      if (r.training === a.training_ready) score += 5;

      for (const s of r.skills) {
        if (userSkills.has(s)) score += 7;
        if (userInterests.has(s)) score += 5;
      }

      if (a.pay_priority === "Максимум заработка" && r.pay >= 5200) score += 8;
      if (a.pay_priority === "Стабильный прогнозируемый доход" && r.pay <= 4600) score += 6;
      if (a.pay_priority === "Комфорт и меньше стресса" && r.communication !== "Люблю общаться") score += 6;

      return { ...r, score: Math.min(100, score) };
    })
    .sort((x, y) => y.score - x.score);
}

function renderRecommendations(items) {
  ui.recommendations.innerHTML = `
    <h3>Топ-3 профессии для тебя</h3>
    ${items.map((it) => `
      <div class="rec-card">
        <h4>${it.role} - match ${it.score}%</h4>
        <p><strong>Семейство:</strong> ${it.family} | <strong>Ориентир по ставке:</strong> ${it.pay} ₽ за смену</p>
        <div>${it.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
    `).join("")}
  `;
}

function renderFamilyFit(ranked) {
  const map = {};
  ranked.forEach((r) => {
    if (!map[r.family]) map[r.family] = [];
    map[r.family].push(r.score);
  });
  const rows = Object.entries(map)
    .map(([family, arr]) => ({ family, fit: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) }))
    .sort((a, b) => b.fit - a.fit);

  ui.familyFit.innerHTML = `
    <h3>Каталог профессий Смены: твой уровень совпадения</h3>
    ${rows.map((r) => `
      <div class="rec-card">
        <p><strong>${r.family}</strong> - ${r.fit}%</p>
        <div class="progress"><span style="width:${r.fit}%"></span></div>
      </div>
    `).join("")}
  `;
}

function renderFallback(top) {
  if (top.some((x) => x.score >= 62)) {
    ui.fallbackBox.classList.add("hidden");
    return;
  }

  const wl = (state.answers.interests || []).slice(0, 3);
  ui.fallbackBox.classList.remove("hidden");
  ui.fallbackBox.classList.add("fallback");
  ui.fallbackBox.innerHTML = `
    <h3>План Б: если сильных совпадений мало</h3>
    <p>Сейчас у профиля мало ролей выше порога 62%. Это нормальная рыночная ситуация.</p>
    <p><strong>Умный вишлист:</strong> ${wl.length ? wl.join(", ") : "Касса, Выкладка товаров, Сборка заказов"}.</p>
  `;
}

function drawRadar() {
  const c = ui.radar;
  const ctx = c.getContext("2d");
  const labels = ["Физика", "Общение", "Цифра", "Стабильность", "Обучение"];
  const vals = [state.score.physical, state.score.communication, state.score.digital, state.score.stability, state.score.learning];
  const cx = 160;
  const cy = 130;
  const r = 90;
  const angle = (Math.PI * 2) / labels.length;

  ctx.clearRect(0, 0, c.width, c.height);

  for (let level = 1; level <= 5; level++) {
    ctx.beginPath();
    for (let i = 0; i < labels.length; i++) {
      const rr = (r / 5) * level;
      const x = cx + rr * Math.cos(-Math.PI / 2 + i * angle);
      const y = cy + rr * Math.sin(-Math.PI / 2 + i * angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#dbe4ee";
    ctx.stroke();
  }

  labels.forEach((label, i) => {
    const x = cx + (r + 16) * Math.cos(-Math.PI / 2 + i * angle);
    const y = cy + (r + 16) * Math.sin(-Math.PI / 2 + i * angle);
    ctx.fillStyle = "#334155";
    ctx.font = "12px Segoe UI";
    ctx.fillText(label, x - 24, y);
  });

  ctx.beginPath();
  vals.forEach((v, i) => {
    const rr = (v / 100) * r;
    const x = cx + rr * Math.cos(-Math.PI / 2 + i * angle);
    const y = cy + rr * Math.sin(-Math.PI / 2 + i * angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(15, 118, 110, 0.25)";
  ctx.strokeStyle = "#0f766e";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function downloadProfile() {
  const payload = {
    profile: state.answers,
    game_score: state.score,
    badges: state.badges,
    saved_at: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smena-profile.json";
  a.click();
  URL.revokeObjectURL(url);
}