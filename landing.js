let CITY_OPTIONS = [];
let CITY_MATCHERS = [];
let CITIES_LOADED = false;
let ACTIVE_CITY_INPUT = null;
let speechRecognition = null;
let speechActive = false;
let speechKeepAlive = false;
let speechCommittedText = "";
let speechInterimText = "";

const DIGITAL_CATEGORIES = [
  { key: "computer", label: "Компьютерные программы" },
  { key: "cashbox", label: "Кассовые аппараты" },
  { key: "tsd", label: "Терминалы сбора данных" },
  { key: "apps", label: "Мобильные приложения" }
];

const DIGITAL_LEVELS = [
  "Лучше если без них",
  "Нормально, вопрос привычки",
  "Поначалу вызывает, но я быстро учусь",
  "Никаких трудностей не вызывает"
];

const SKILL_OPTIONS = [
  "Терминалы сбора данных",
  "Работа в пункте выдачи заказов",
  "Сборка заказов на время",
  "Комплектовка товаров",
  "Мерчендайзинг",
  "Бариста",
  "Работа в копировальном центре",
  "Погрузка с устройствами (рохля, дебаркадер)",
  "Работа с планограммой",
  "Консультации покупателей",
  "Товароведение",
  "Сложная уборка с бытовой химией",
  "Администратор/ хостес",
  "Приготовление пищи",
  "Обслуживание гостей в общепите",
  "Работа в отделе гастрономия",
  "Складские услуги",
  "Обслуживание в магазинах одежды или косметики",
  "Консультант в магазинах техники",
  "Работа с кассой (нал и безнал расчеты)",
  "Техобслуживание автомобилей",
  "Мойка автомобилей",
  "Заправка автомобилей",
  "Хелпер на ивентах",
  "Раннер или официант",
  "Приготовление фастфуда",
  "Работа на линии, конвейере",
  "Строительство",
  "Ремонт и отделка квартир",
  "Бытовой ремонт",
  "Монтаж (конструкции, мебель, оборудование)",
  "СТО, шиномонтаж",
  "Промоутеры",
  "Call-центр",
  "Домашний персонал",
  "Аниматоры, ведущие",
  "Салоны красоты",
  "Электровелосипед",
  "Водительские права категории B",
  "Приложения или программы для работы со складом/ ПВЗ",
  "Логистика",
  "Медицинская книжка для ритейла",
  "Медицинская книжка для общепита",
  "Управление погрузчиком / штабелёром / электрокаром",
  "Текстильная промышленность",
  "Пищевое производство",
  "Массовые мероприятия",
  "Текстильное производство",
  "Пошив одежды"
];

const QUESTIONS = [
  {
    id: "interest_primary",
    text: "Что вас интересует?",
    hint: "Выберите вариант, который лучше всего описывает вашу ситуацию",
    type: "single",
    options: [
      "У меня уже есть основной доход, ищу доп заработок",
      "Хочу получать основной доход от заданий в Смене",
      "Я в поиске основной работы, но пока ищу - хочу зарабатывать",
      "Хочу попробовать новую сферу",
      "Другое"
    ]
  },
  {
    id: "interest_primary_details",
    text: "Расскажите, что именно вас сейчас интересует",
    hint: "Можно написать или надиктовать свой вариант",
    type: "text_voice_optional",
    placeholder: "Напишите или расскажите, что вы хотите получить от Смены",
    showIf: (answers) => answers.interest_primary === "Другое"
  },
  {
    id: "hours_week",
    text: "Сколько часов в неделю вы готовы уделять сменам?",
    hint: "Оцените комфортный для себя объем времени",
    type: "single",
    options: ["до 5", "до 10", "до 20", "до 40", "более 40"]
  },
  {
    id: "hours_week_details",
    text: "Какой формат по времени был бы вам удобен?",
    hint: "Можно написать про выходные, лето, учебу, ночные смены или любой другой режим",
    type: "text_voice_optional",
    placeholder: "Напишите или расскажите, какой формат вам удобен"
  },
  {
    id: "priority_now",
    text: "Что сейчас для вас наиболее важно?",
    hint: "Это поможет понять, как лучше ранжировать подходящие форматы",
    type: "single",
    options: [
      "Стабильный прогнозируемый доход",
      "Максимум заработка",
      "Баланс работы с личными делами и графиком",
      "Что-то еще"
    ]
  },
  {
    id: "priority_now_details",
    text: "Расскажите, что еще для вас важно",
    hint: "Можно коротко описать свой критерий или ожидание от смен",
    type: "text_voice_optional",
    placeholder: "Напишите или расскажите, что для вас сейчас в приоритете",
    showIf: (answers) => answers.priority_now === "Что-то еще"
  },
  {
    id: "section_transition",
    text: "Спасибо, что поделились своими целями.",
    hint: "Давайте теперь посмотрим, какие задания вам нравятся.",
    type: "message",
    countInProgress: false,
    ctaLabel: "Продолжить"
  },
  {
    id: "physical_load",
    text: "Какая физическая нагрузка вам подходит?",
    hint: "Выберите самый комфортный для вас вариант",
    type: "single",
    options: [
      "Очень легкая (выполнять задания сидя)",
      "Легкая (без тяжестей и долгих перемещений)",
      "Средняя (активные перемещения и задания на скорость)",
      "Тяжелая (интенсивно, как в спортзале, тяжести больше 15 кг)"
    ]
  },
  {
    id: "physical_load_limits",
    text: "Какие виды нагрузки вам не подходят?",
    hint: "Можно указать тяжести, долгую ходьбу, скорость или любые другие ограничения",
    type: "text_voice_optional",
    placeholder: "Напишите или расскажите, какие виды нагрузки лучше исключить"
  },
  {
    id: "standing_format",
    text: "Как относитесь к работе на ногах?",
    hint: "Это поможет отделить более подвижные роли от спокойных форматов",
    type: "single",
    options: [
      "Люблю гулять, поэтому положительно",
      "В целом подходят такие задания",
      "Могу только с перерывами",
      "Мне подходит только сидячая работа"
    ]
  },
  {
    id: "outdoor_format",
    text: "Вам комфортно работать на улице?",
    hint: "Это важно для части городских, выездных и событийных задач",
    type: "single",
    options: [
      "Да, в любую погоду",
      "Только в теплый сезон",
      "Можно изредка попробовать",
      "Не комфортно, могу только в помещении"
    ]
  },
  {
    id: "movement_preference",
    text: "Любите работу, на которой нужно постоянно быть в движении - пешком или на транспорте?",
    hint: "Покажем этот вопрос только если вам в целом подходят подвижные и уличные форматы",
    type: "single",
    options: [
      "Да, люблю быть за рулем, ездить на дальние расстояния",
      "Да, люблю гулять и ездить на общественном транспорте",
      "Предпочитаю перемещаться немного"
    ],
    showIf: (answers) => isPositiveMovementBase(answers)
  },
  {
    id: "digital_matrix",
    text: "Вызывает ли у вас трудности работа с компьютерными программами, терминалами сбора данных, кассовыми аппаратами и мобильными приложениями?",
    hint: "Под каждой категорией выберите свой уровень комфорта: чем правее ползунок, тем увереннее вы себя чувствуете",
    type: "digital_matrix"
  },
  {
    id: "customer_contact",
    text: "Вам нравится общаться с клиентами, покупателями?",
    hint: "Так мы разделим более сервисные роли и более спокойные форматы",
    type: "single",
    options: [
      "Люблю общаться, меня это заряжает",
      "Если надо - пообщаемся",
      "Если только не целый день, я устаю",
      "Стараюсь избегать такую работу, где нужно много общаться"
    ]
  },
  {
    id: "team_contact",
    text: "А с коллегами нравится общаться?",
    hint: "Посмотрим, комфортнее ли вам большая команда, маленькая группа или самостоятельный формат",
    type: "single",
    options: [
      "Да, люблю большие коллективы, есть шансы расширить круг общения и найти друзей",
      "Если нужно, я готов подстроиться",
      "Не люблю большие компании, предпочитаю небольшие команды (2-3 человека)",
      "Я люблю быть сам по себе: работать без начальника и коллег",
      "Мне все равно, какие коллеги, я могу работать с любыми"
    ]
  },
  {
    id: "pay_format",
    text: "Какой формат оплаты предпочитаете?",
    hint: "Выберите тот вариант, с которым вам спокойнее и понятнее работать",
    type: "single_cards",
    options: [
      "Люблю сдельную оплату - можно получать повышенный доход за высокую производительность",
      "Сдельная оплата подходит, но если есть гарантированный минимум",
      "Нравится оплата за результат без ограничений, сколько его делать",
      "Мне подходит только почасовая оплата"
    ]
  },
  {
    id: "shift_duration",
    text: "Выберите оптимальную длительность заданий для вас",
    hint: "Передвиньте ползунок: так мы поймем, какой формат смены вам комфортнее",
    type: "range",
    min: 1,
    max: 12
  },
  {
    id: "skills_multi",
    text: "Отметьте все навыки, которые у вас есть",
    hint: "Можно выбрать любое количество навыков",
    type: "multi_tiles",
    options: SKILL_OPTIONS
  },
  {
    id: "experience_details",
    text: "Напишите или расскажите о своем опыте, в какой сфере, что умеете, любите, на что учились",
    hint: "Если хочется ответить подробно - мы только за. Это поможет учесть весь ваш опыт, знания и навыки для поиска заданий.",
    type: "text_voice_optional",
    placeholder: "Расскажите, где вы работали, что умеете и в чем чувствуете себя уверенно"
  },
  {
    id: "new_jobs_city",
    text: "Какие задания вы бы добавили в своем городе?",
    hint: "Можно написать или надиктовать идею новых смен и направлений",
    type: "text_voice_optional",
    placeholder: "Напишите или расскажите, каких заданий вам не хватает в вашем городе"
  },
  {
    id: "age_text",
    text: "И последнее: сколько вам лет?",
    hint: "Можно указать возраст числом",
    type: "text_optional",
    placeholder: "Например: 27"
  },
  {
    id: "city",
    text: "Из какого вы города?",
    hint: "Начните вводить город и выберите его из списка",
    type: "text",
    placeholder: "Например: Санкт-Петербург"
  },
  {
    id: "results_prep",
    text: "Спасибо! Уже готовим результаты :)",
    hint: "Остался один клик, и покажем ваш профиль и подходящие направления.",
    type: "message",
    countInProgress: false,
    ctaLabel: "Показать результаты"
  }
];

const ROLE_FAMILIES = {
  kitchen: "Кухня",
  retail: "Ритейл",
  collector: "Сборка и даркстор",
  service: "Кофе и сервис",
  delivery: "Доставка",
  warehouse: "Склад",
  promo: "Промо и события"
};

const ROLES = [
  {
    code: "kitchen",
    role: "Кухонный работник / повар",
    family: ROLE_FAMILIES.kitchen,
    pay: 5000,
    lead: "Подходит тем, кто любит процессы, понятный ритм и аккуратную работу руками.",
    tags: ["Кухня", "Команда", "Стабильность"],
    skillMatches: ["Приготовление пищи", "Обслуживание гостей в общепите", "Работа в отделе гастрономия", "Приготовление фастфуда", "Медицинская книжка для общепита"]
  },
  {
    code: "cashier",
    role: "Кассир",
    family: ROLE_FAMILIES.retail,
    pay: 4400,
    lead: "Хороший вариант, если вам важны стабильный доход, понятные процессы и контакт с людьми.",
    tags: ["Касса", "Покупатели", "Почасовая оплата"],
    skillMatches: ["Работа с кассой (нал и безнал расчеты)", "Консультации покупателей", "Обслуживание в магазинах одежды или косметики", "Консультант в магазинах техники"]
  },
  {
    code: "collector",
    role: "Сборщик заказов",
    family: ROLE_FAMILIES.collector,
    pay: 4700,
    lead: "Подходит тем, кто любит темп, точность и не боится цифровых инструментов.",
    tags: ["Темп", "Точность", "ТСД"],
    skillMatches: ["Терминалы сбора данных", "Сборка заказов на время", "Комплектовка товаров", "Работа в пункте выдачи заказов", "Приложения или программы для работы со складом/ ПВЗ"]
  },
  {
    code: "retail_floor",
    role: "Работник торгового зала",
    family: ROLE_FAMILIES.retail,
    pay: 4100,
    lead: "Подходит, если вам нравится порядок, понятная структура задач и спокойный вход в работу.",
    tags: ["Полки", "Планограмма", "Магазин"],
    skillMatches: ["Мерчендайзинг", "Работа с планограммой", "Товароведение", "Консультации покупателей", "Медицинская книжка для ритейла"]
  },
  {
    code: "barista",
    role: "Бариста",
    family: ROLE_FAMILIES.service,
    pay: 4800,
    lead: "Идеально для тех, кто любит сервис, динамику и общение в небольших командах.",
    tags: ["Кофе", "Сервис", "Обучение"],
    skillMatches: ["Бариста", "Обслуживание гостей в общепите", "Раннер или официант"]
  },
  {
    code: "courier",
    role: "Курьер",
    family: ROLE_FAMILIES.delivery,
    pay: 5600,
    lead: "Подходит, если вам нравится движение, свобода графика и оплата за результат.",
    tags: ["Движение", "Гибкость", "Сдельность"],
    skillMatches: ["Электровелосипед", "Водительские права категории B", "Логистика"]
  },
  {
    code: "warehouse",
    role: "Кладовщик",
    family: ROLE_FAMILIES.warehouse,
    pay: 4900,
    lead: "Подходит тем, кто спокойно чувствует себя в операционной среде и любит четкий процесс.",
    tags: ["Склад", "Процессы", "Физнагрузка"],
    skillMatches: ["Складские услуги", "Погрузка с устройствами (рохля, дебаркадер)", "Управление погрузчиком / штабелёром / электрокаром", "Логистика", "Терминалы сбора данных"]
  },
  {
    code: "promoter",
    role: "Промоутер / хелпер на ивентах",
    family: ROLE_FAMILIES.promo,
    pay: 3900,
    lead: "Хороший вход, если вам нравится движение, новые люди и гибкие короткие задания.",
    tags: ["Люди", "События", "Гибкий график"],
    skillMatches: ["Промоутеры", "Хелпер на ивентах", "Массовые мероприятия", "Аниматоры, ведущие", "Администратор/ хостес"]
  }
];

const UI = {
  hero: document.querySelector(".hero"),
  startBtn: document.getElementById("startBtn"),
  quiz: document.getElementById("quizSection"),
  result: document.getElementById("resultSection"),
  title: document.getElementById("questionTitle"),
  hint: document.getElementById("questionHint"),
  options: document.getElementById("options"),
  inputWrap: document.getElementById("inputWrap"),
  textAnswer: document.getElementById("textAnswer"),
  textNextBtn: document.getElementById("textNextBtn"),
  skipTextBtn: document.getElementById("skipTextBtn"),
  voiceControls: document.getElementById("voiceControls"),
  voiceBtn: document.getElementById("voiceBtn"),
  voiceStatus: document.getElementById("voiceStatus"),
  cityAutocomplete: document.getElementById("cityAutocomplete"),
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
  editLocationBtn: document.getElementById("editLocationBtn"),
  locationEditor: document.getElementById("locationEditor"),
  resultCityInput: document.getElementById("resultCityInput"),
  resultCityAutocomplete: document.getElementById("resultCityAutocomplete"),
  saveLocationBtn: document.getElementById("saveLocationBtn"),
  cancelLocationBtn: document.getElementById("cancelLocationBtn"),
  restartBtn: document.getElementById("restartBtn"),
  radar: document.getElementById("radar")
};

const STATE = {
  index: 0,
  answers: {},
  lastRecommendations: [],
  citySource: null,
  score: {
    physical: 50,
    communication: 50,
    digital: 50,
    stability: 50,
    learning: 50
  }
};

bindEvents();
loadCitiesConfig();
startQuizPreview();
function bindEvents() {
  UI.startBtn.addEventListener("click", startQuiz);
  UI.doneMultiBtn.addEventListener("click", submitDynamicScreen);
  UI.textNextBtn.addEventListener("click", submitText);
  UI.skipTextBtn.addEventListener("click", skipTextQuestion);
  UI.voiceBtn.addEventListener("click", toggleVoiceInput);
  UI.editLocationBtn.addEventListener("click", openLocationEditor);
  UI.saveLocationBtn.addEventListener("click", applyLocationChanges);
  UI.cancelLocationBtn.addEventListener("click", closeLocationEditor);
  UI.restartBtn.addEventListener("click", startQuiz);

  UI.textAnswer.addEventListener("input", () => {
    autoResizeTextAnswer();
    if (getCurrentQuestion()?.id === "city") handleCityInput(UI.textAnswer, UI.cityAutocomplete);
  });
  UI.textAnswer.addEventListener("focus", () => {
    if (getCurrentQuestion()?.id === "city") handleCityInput(UI.textAnswer, UI.cityAutocomplete);
  });
  UI.textAnswer.addEventListener("keydown", (event) => {
    const question = getCurrentQuestion();
    if (!question) return;
    if (event.key === "Enter" && !event.shiftKey && !allowsMultiline(question)) {
      event.preventDefault();
      submitText();
    }
  });

  UI.resultCityInput.addEventListener("input", () => handleCityInput(UI.resultCityInput, UI.resultCityAutocomplete));
  UI.resultCityInput.addEventListener("focus", () => handleCityInput(UI.resultCityInput, UI.resultCityAutocomplete));
  document.addEventListener("click", handleOutsideAutocompleteClick);
}

function startQuizPreview() {
  stopVoiceInput(true);
  UI.hero.classList.remove("hidden");
  UI.result.classList.add("hidden");
  UI.quiz.classList.add("hidden");
  resetState();
}

function startQuiz() {
  stopVoiceInput(true);
  resetState();
  UI.hero.classList.add("hidden");
  UI.result.classList.add("hidden");
  UI.quiz.classList.remove("hidden");
  UI.locationEditor.classList.add("hidden");
  render();
}

function resetState() {
  STATE.index = 0;
  STATE.answers = {};
  STATE.lastRecommendations = [];
  STATE.citySource = null;
  STATE.score = {
    physical: 50,
    communication: 50,
    digital: 50,
    stability: 50,
    learning: 50
  };
  UI.textAnswer.value = "";
  UI.resultCityInput.value = "";
  autoResizeTextAnswer();
  hideAutocomplete(UI.cityAutocomplete);
  hideAutocomplete(UI.resultCityAutocomplete);
}

function getVisibleQuestions() {
  return QUESTIONS.filter((question) => isQuestionVisible(question));
}

function getCurrentQuestion() {
  return getVisibleQuestions()[STATE.index] || null;
}

function isQuestionVisible(question) {
  return typeof question.showIf !== "function" ? true : Boolean(question.showIf(STATE.answers));
}

function render() {
  const question = getCurrentQuestion();
  if (!question) {
    showResults();
    return;
  }

  stopVoiceInput(true);
  UI.title.textContent = question.text;
  UI.hint.textContent = question.hint || "";
  UI.options.className = "options";
  UI.options.innerHTML = "";
  UI.badges.innerHTML = renderBadges(question);
  UI.inputWrap.classList.add("hidden");
  UI.multiActions.classList.add("hidden");
  UI.cityAutocomplete.classList.add("hidden");
  UI.textAnswer.value = readTextValue(question.id);
  autoResizeTextAnswer();
  updateProgress();

  switch (question.type) {
    case "single":
      renderSingle(question, false);
      break;
    case "single_cards":
      renderSingle(question, true);
      break;
    case "multi_tiles":
      renderMultiTiles(question);
      break;
    case "text":
    case "text_optional":
    case "text_voice_optional":
      renderTextQuestion(question);
      break;
    case "message":
      renderMessageQuestion(question);
      break;
    case "digital_matrix":
      renderDigitalMatrix(question);
      break;
    case "range":
      renderRangeQuestion(question);
      break;
    default:
      renderSingle(question, false);
      break;
  }
}

function renderBadges(question) {
  const chips = [];
  if (question.id === "skills_multi" && Array.isArray(STATE.answers.skills_multi) && STATE.answers.skills_multi.length) {
    chips.push(`${STATE.answers.skills_multi.length} навыков уже отмечено`);
  }
  if (question.id === "digital_matrix") chips.push("Оцените 4 инструмента отдельно");
  if (question.id === "shift_duration") chips.push("Передвиньте ползунок от 1 до 12 часов");
  return chips.map((item) => `<span class="badge">${escapeHtml(item)}</span>`).join("");
}

function renderSingle(question, cardMode) {
  const selectedValue = STATE.answers[question.id] || "";
  if (cardMode) UI.options.classList.add("options-cards-grid");
  question.options.forEach((optionText) => {
    const button = makeOption(optionText, selectedValue === optionText, cardMode);
    button.addEventListener("click", () => {
      STATE.answers[question.id] = optionText;
      goNext();
    });
    UI.options.appendChild(button);
  });
}

function renderMultiTiles(question) {
  const selectedSet = new Set(Array.isArray(STATE.answers[question.id]) ? STATE.answers[question.id] : []);
  UI.options.classList.add("options-tiled", "options-skills-grid");
  UI.options.innerHTML = "";
  question.options.forEach((optionText) => {
    const button = makeOption(optionText, selectedSet.has(optionText), true);
    button.addEventListener("click", () => {
      if (selectedSet.has(optionText)) selectedSet.delete(optionText);
      else selectedSet.add(optionText);
      STATE.answers[question.id] = [...selectedSet];
      renderMultiTiles(question);
    });
    UI.options.appendChild(button);
  });
  UI.multiActions.classList.remove("hidden");
  UI.doneMultiBtn.textContent = "Продолжить";
}

function renderTextQuestion(question) {
  UI.inputWrap.classList.remove("hidden");
  UI.textAnswer.placeholder = question.placeholder || "";
  UI.textAnswer.value = readTextValue(question.id);
  UI.textAnswer.rows = allowsMultiline(question) ? 5 : 1;
  autoResizeTextAnswer();
  UI.skipTextBtn.classList.toggle("hidden", question.type === "text");
  UI.textNextBtn.textContent = "Продолжить";
  configureVoiceControls(question);
  if (question.id === "city") handleCityInput(UI.textAnswer, UI.cityAutocomplete);
}

function renderMessageQuestion(question) {
  UI.options.innerHTML = `
    <div class="message-card">
      <h3>${escapeHtml(question.text)}</h3>
      <p>${escapeHtml(question.hint || "")}</p>
    </div>
  `;
  UI.multiActions.classList.remove("hidden");
  UI.doneMultiBtn.textContent = question.ctaLabel || "Продолжить";
}

function renderDigitalMatrix(question) {
  const current = STATE.answers[question.id] || createDefaultDigitalMatrix();
  UI.options.classList.add("options-matrix");
  UI.options.innerHTML = "";

  DIGITAL_CATEGORIES.forEach((category) => {
    const value = clamp(Number(current[category.key]), 0, 3);
    const card = document.createElement("div");
    card.className = "matrix-card";
    card.innerHTML = `
      <div class="matrix-card-head">
        <strong>${escapeHtml(category.label)}</strong>
        <span class="matrix-level">${escapeHtml(DIGITAL_LEVELS[value])}</span>
      </div>
      <input class="matrix-slider" type="range" min="0" max="3" step="1" value="${value}" data-key="${category.key}" />
      <div class="matrix-scale">
        ${DIGITAL_LEVELS.map((label) => `<span>${escapeHtml(shortDigitalLabel(label))}</span>`).join("")}
      </div>
    `;
    const slider = card.querySelector(".matrix-slider");
    slider.addEventListener("input", () => {
      const next = { ...(STATE.answers[question.id] || createDefaultDigitalMatrix()) };
      next[category.key] = Number(slider.value);
      STATE.answers[question.id] = next;
      renderDigitalMatrix(question);
    });
    UI.options.appendChild(card);
  });

  STATE.answers[question.id] = current;
  UI.multiActions.classList.remove("hidden");
  UI.doneMultiBtn.textContent = "Продолжить";
}

function renderRangeQuestion(question) {
  const currentValue = Number(STATE.answers[question.id] || 6);
  UI.options.classList.add("options-range");
  UI.options.innerHTML = `
    <div class="range-card">
      <div class="range-card-head">
        <strong>Комфортная длительность смены</strong>
        <span class="range-output">${formatHours(currentValue)}</span>
      </div>
      <input class="range-slider" type="range" min="${question.min}" max="${question.max}" step="1" value="${currentValue}" />
      <div class="range-scale range-scale-hours">
        ${Array.from({ length: question.max - question.min + 1 }, (_, index) => `<span>${question.min + index}</span>`).join("")}
      </div>
    </div>
  `;
  const slider = UI.options.querySelector(".range-slider");
  slider.addEventListener("input", () => {
    STATE.answers[question.id] = Number(slider.value);
    renderRangeQuestion(question);
  });
  STATE.answers[question.id] = currentValue;
  UI.multiActions.classList.remove("hidden");
  UI.doneMultiBtn.textContent = "Продолжить";
}

function submitText() {
  const question = getCurrentQuestion();
  if (!question) return;
  const value = UI.textAnswer.value.trim();
  if (question.type === "text" && !value) {
    UI.textAnswer.focus();
    return;
  }
  STATE.answers[question.id] = value;
  if (question.id === "city") STATE.citySource = lookupCityMeta(value)?.label || value;
  goNext();
}

function skipTextQuestion() {
  const question = getCurrentQuestion();
  if (!question) return;
  STATE.answers[question.id] = "";
  goNext();
}

function submitDynamicScreen() {
  const question = getCurrentQuestion();
  if (!question) return;
  if (question.type === "message" && question.id === "results_prep") {
    showResults();
    return;
  }
  goNext();
}

function goNext() {
  stopVoiceInput(true);
  STATE.index += 1;
  if (STATE.index >= getVisibleQuestions().length) {
    showResults();
    return;
  }
  render();
}

function updateProgress() {
  const visible = getVisibleQuestions();
  const counted = visible.filter((item) => item.countInProgress !== false);
  const total = counted.length || 1;
  const current = visible[STATE.index];
  const passed = visible.slice(0, STATE.index + 1).filter((item) => item.countInProgress !== false).length;
  const currentNumber = current?.countInProgress === false ? Math.max(1, passed - 1) : Math.max(1, passed);
  UI.progressText.textContent = `${currentNumber}/${total}`;
  UI.progressBar.style.width = `${Math.max(6, Math.round((currentNumber / total) * 100))}%`;
}

function makeOption(label, selected, compact) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `option${selected ? " selected" : ""}${compact ? " option-card" : ""}`;
  button.textContent = label;
  return button;
}

function readTextValue(questionId) {
  const value = STATE.answers[questionId];
  return typeof value === "string" ? value : "";
}

function configureVoiceControls(question) {
  const shouldShow = question.type === "text_voice_optional";
  UI.voiceControls.classList.toggle("hidden", !shouldShow);
  UI.voiceBtn.textContent = speechActive ? "Остановить запись" : "Голосовой ответ";
  UI.voiceStatus.textContent = shouldShow ? "Можно надиктовать ответ голосом" : "";
}

function allowsMultiline(question) {
  return ["text_optional", "text_voice_optional"].includes(question.type);
}

function autoResizeTextAnswer() {
  UI.textAnswer.style.height = "auto";
  UI.textAnswer.style.height = `${Math.max(UI.textAnswer.scrollHeight, 58)}px`;
}
function toggleVoiceInput() {
  const question = getCurrentQuestion();
  if (!question || question.type !== "text_voice_optional") return;

  const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!RecognitionCtor) {
    UI.voiceStatus.textContent = "Голосовой ввод не поддерживается в этом браузере";
    return;
  }

  if (!speechRecognition) {
    speechRecognition = new RecognitionCtor();
    speechRecognition.lang = "ru-RU";
    speechRecognition.interimResults = true;
    speechRecognition.continuous = true;
    speechRecognition.onresult = handleSpeechResult;
    speechRecognition.onstart = () => {
      speechActive = true;
      UI.voiceControls.classList.add("is-recording");
      UI.voiceBtn.textContent = "Остановить запись";
      UI.voiceStatus.textContent = "Слушаем вас...";
    };
    speechRecognition.onend = () => {
      speechActive = false;
      UI.voiceControls.classList.remove("is-recording");
      UI.voiceBtn.textContent = "Голосовой ответ";
      if (speechKeepAlive && getCurrentQuestion()?.type === "text_voice_optional") {
        setTimeout(() => {
          try { speechRecognition.start(); } catch {}
        }, 250);
      } else if (!UI.voiceControls.classList.contains("hidden")) {
        UI.voiceStatus.textContent = "Можно надиктовать ответ голосом";
      }
    };
    speechRecognition.onerror = () => {
      speechKeepAlive = false;
      speechActive = false;
      UI.voiceControls.classList.remove("is-recording");
      UI.voiceBtn.textContent = "Голосовой ответ";
      UI.voiceStatus.textContent = "Не удалось распознать речь, можно попробовать еще раз";
    };
  }

  if (speechActive) {
    stopVoiceInput(false);
    return;
  }

  speechCommittedText = UI.textAnswer.value.trim();
  speechInterimText = "";
  speechKeepAlive = true;
  try { speechRecognition.start(); } catch {}
}

function handleSpeechResult(event) {
  let finalText = "";
  let interimText = "";
  for (let index = event.resultIndex; index < event.results.length; index += 1) {
    const transcript = event.results[index][0].transcript.trim();
    if (!transcript) continue;
    if (event.results[index].isFinal) finalText += `${transcript} `;
    else interimText += `${transcript} `;
  }
  if (finalText) speechCommittedText = [speechCommittedText, finalText.trim()].filter(Boolean).join(" ").trim();
  speechInterimText = interimText.trim();
  UI.textAnswer.value = [speechCommittedText, speechInterimText].filter(Boolean).join(" ").trim();
  autoResizeTextAnswer();
}

function stopVoiceInput(forceSilent) {
  speechKeepAlive = false;
  speechInterimText = "";
  if (speechRecognition && speechActive) {
    try { speechRecognition.stop(); } catch {}
  }
  speechActive = false;
  UI.voiceControls.classList.remove("is-recording");
  UI.voiceBtn.textContent = "Голосовой ответ";
  if (!forceSilent && !UI.voiceControls.classList.contains("hidden")) {
    UI.voiceStatus.textContent = "Можно надиктовать ответ голосом";
  }
}

async function loadCitiesConfig() {
  const fallback = [
    { label: "Москва", aliases: ["Москва", "Moscow", "moscow", "мск", "msk"], offersUrl: "https://offers.smena.yandex.ru/location-213-moscow/podrabotka" },
    { label: "Санкт-Петербург", aliases: ["Санкт-Петербург", "Санкт Петербург", "Питер", "СПб", "spb", "saint petersburg", "saint-petersburg"], offersUrl: "https://offers.smena.yandex.ru/location-2/podrabotka" },
    { label: "Екатеринбург", aliases: ["Екатеринбург", "ekaterinburg", "yekaterinburg", "екб"], offersUrl: "https://offers.smena.yandex.ru/location-54-yekaterinburg/podrabotka" },
    { label: "Нижний Новгород", aliases: ["Нижний Новгород", "Нижний", "nizhny novgorod", "nizhny-novgorod"], offersUrl: "https://offers.smena.yandex.ru/location-47-nizhny-novgorod/podrabotka" }
  ];

  try {
    const response = await fetch(`./api/cities?ts=${Date.now()}`);
    const payload = await response.json();
    CITY_OPTIONS = Array.isArray(payload.cities) && payload.cities.length
      ? payload.cities.map((city) => ({ label: city.label, aliases: city.aliases || [city.label], offersUrl: city.offersUrl || "" }))
      : fallback;
  } catch {
    CITY_OPTIONS = fallback;
  }

  CITY_OPTIONS = CITY_OPTIONS.filter((city) => city.label).sort((a, b) => a.label.localeCompare(b.label, "ru"));
  CITY_MATCHERS = CITY_OPTIONS.flatMap((city) => {
    const aliases = [...new Set([city.label, ...(city.aliases || [])])];
    return aliases.map((alias) => ({ key: normalizeCity(alias), label: city.label, offersUrl: city.offersUrl || "" }));
  });
  CITIES_LOADED = true;
}

function handleCityInput(inputEl, panelEl) {
  ACTIVE_CITY_INPUT = inputEl;
  const raw = inputEl.value.trim();
  const key = normalizeCity(raw);
  if (!CITIES_LOADED) {
    showAutocomplete(panelEl, [], "Загружаем список городов...");
    return;
  }
  if (!key) {
    hideAutocomplete(panelEl);
    return;
  }
  const matches = CITY_OPTIONS.filter((item) => {
    const keys = [item.label, ...(item.aliases || [])].map(normalizeCity);
    return keys.some((candidate) => candidate.includes(key) || key.includes(candidate));
  }).slice(0, 8);
  showAutocomplete(panelEl, matches, matches.length ? "" : "Город не найден в доступном списке", inputEl);
}

function showAutocomplete(panelEl, matches, emptyText, inputEl) {
  if (!matches.length) {
    panelEl.innerHTML = `<div class="autocomplete-empty">${escapeHtml(emptyText)}</div>`;
    panelEl.classList.remove("hidden");
    return;
  }
  panelEl.innerHTML = matches.map((item) => `<button type="button" class="autocomplete-item" data-city="${escapeHtmlAttr(item.label)}">${escapeHtml(item.label)}</button>`).join("");
  panelEl.classList.remove("hidden");
  panelEl.querySelectorAll(".autocomplete-item").forEach((button) => {
    button.addEventListener("click", () => {
      inputEl.value = button.dataset.city || "";
      if (inputEl === UI.textAnswer) STATE.answers.city = inputEl.value;
      hideAutocomplete(panelEl);
      inputEl.focus();
    });
  });
}

function hideAutocomplete(panelEl) {
  panelEl.classList.add("hidden");
  panelEl.innerHTML = "";
}

function handleOutsideAutocompleteClick(event) {
  const insidePrimary = UI.cityAutocomplete.contains(event.target) || event.target === UI.textAnswer;
  const insideSecondary = UI.resultCityAutocomplete.contains(event.target) || event.target === UI.resultCityInput;
  if (!insidePrimary) hideAutocomplete(UI.cityAutocomplete);
  if (!insideSecondary) hideAutocomplete(UI.resultCityAutocomplete);
}

function normalizeCity(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/^г\.\s*/g, "")
    .replace(/^город\s+/g, "")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lookupCityMeta(value) {
  const key = normalizeCity(value);
  if (!key) return null;
  const exact = CITY_MATCHERS.find((item) => item.key === key);
  if (exact) return exact;
  return CITY_MATCHERS.find((item) => item.key.includes(key) || key.includes(item.key)) || null;
}

function openLocationEditor() {
  UI.locationEditor.classList.remove("hidden");
  UI.resultCityInput.value = STATE.answers.city || "";
}

function closeLocationEditor() {
  UI.locationEditor.classList.add("hidden");
  hideAutocomplete(UI.resultCityAutocomplete);
}

function applyLocationChanges() {
  const value = UI.resultCityInput.value.trim();
  STATE.answers.city = value;
  STATE.citySource = lookupCityMeta(value)?.label || value;
  closeLocationEditor();
  renderCityOffersLink();
}

function showResults() {
  stopVoiceInput(true);
  UI.quiz.classList.add("hidden");
  UI.result.classList.remove("hidden");
  UI.locationEditor.classList.add("hidden");

  const recommendations = computeRecommendations();
  STATE.lastRecommendations = recommendations;
  const topRole = recommendations[0];
  const profile = computeProfileNarrative(topRole);

  UI.profileName.textContent = profile.name;
  UI.profileDesc.textContent = profile.description;
  UI.incomeForecast.textContent = formatCurrency(topRole.pay * 4);
  UI.trainReadiness.textContent = profile.learningReadiness;
  UI.topScore.textContent = `${topRole.score}%`;

  renderRecommendations(recommendations.slice(0, 3));
  renderFamilyFit(recommendations);
  renderCityOffersLink();
  renderFallback();
}
function computeRecommendations() {
  const scored = ROLES.map((role) => ({ ...role, score: scoreRole(role) }))
    .sort((a, b) => b.score - a.score || b.pay - a.pay);
  return scored;
}

function scoreRole(role) {
  let score = 42;
  const selectedSkills = new Set(STATE.answers.skills_multi || []);
  const matchedSkills = role.skillMatches.filter((skill) => selectedSkills.has(skill)).length;
  score += Math.min(30, matchedSkills * 8);

  const interest = STATE.answers.interest_primary;
  if (interest === "У меня уже есть основной доход, ищу доп заработок") {
    if (["courier", "promoter", "collector"].includes(role.code)) score += 8;
    if (["cashier", "barista"].includes(role.code)) score += 4;
  }
  if (interest === "Хочу получать основной доход от заданий в Смене") {
    if (["warehouse", "kitchen", "cashier", "collector"].includes(role.code)) score += 8;
  }
  if (interest === "Я в поиске основной работы, но пока ищу - хочу зарабатывать") {
    if (["retail_floor", "cashier", "warehouse", "kitchen"].includes(role.code)) score += 7;
  }
  if (interest === "Хочу попробовать новую сферу") {
    if (["promoter", "retail_floor", "barista"].includes(role.code)) score += 6;
  }

  const priority = STATE.answers.priority_now;
  if (priority === "Стабильный прогнозируемый доход") {
    if (["cashier", "retail_floor", "kitchen", "cleaner_indoor"].includes(role.code)) score += 9;
    if (["courier"].includes(role.code)) score -= 6;
  }
  if (priority === "Максимум заработка") {
    if (["courier", "collector", "warehouse"].includes(role.code)) score += 9;
  }
  if (priority === "Баланс работы с личными делами и графиком") {
    if (["promoter", "courier", "cleaner_indoor", "barista"].includes(role.code)) score += 7;
  }

  const physical = STATE.answers.physical_load;
  if (physical === "Очень легкая (выполнять задания сидя)") {
    if (["cashier", "cleaner_indoor", "barista"].includes(role.code)) score += 6;
    if (["warehouse", "courier", "cleaner_outdoor"].includes(role.code)) score -= 14;
  }
  if (physical === "Легкая (без тяжестей и долгих перемещений)") {
    if (["cashier", "retail_floor", "barista", "cleaner_indoor"].includes(role.code)) score += 8;
    if (["warehouse", "cleaner_outdoor"].includes(role.code)) score -= 8;
  }
  if (physical === "Средняя (активные перемещения и задания на скорость)") {
    if (["collector", "retail_floor", "courier", "promoter"].includes(role.code)) score += 8;
  }
  if (physical === "Тяжелая (интенсивно, как в спортзале, тяжести больше 15 кг)") {
    if (["warehouse", "cleaner_outdoor", "courier"].includes(role.code)) score += 10;
    if (["cashier", "barista"].includes(role.code)) score -= 5;
  }

  const standing = STATE.answers.standing_format;
  if (standing === "Люблю гулять, поэтому положительно") {
    if (["courier", "promoter", "retail_floor", "collector"].includes(role.code)) score += 8;
  }
  if (standing === "В целом подходят такие задания") {
    if (["cashier", "retail_floor", "barista", "collector"].includes(role.code)) score += 5;
  }
  if (standing === "Могу только с перерывами") {
    if (["cashier", "barista", "retail_floor", "cleaner_indoor"].includes(role.code)) score += 4;
    if (["courier", "cleaner_outdoor", "warehouse"].includes(role.code)) score -= 6;
  }
  if (standing === "Мне подходит только сидячая работа") {
    if (["cashier"].includes(role.code)) score += 3;
    if (["courier", "warehouse", "collector", "cleaner_outdoor"].includes(role.code)) score -= 12;
  }

  const outdoor = STATE.answers.outdoor_format;
  if (outdoor === "Да, в любую погоду") {
    if (["courier", "cleaner_outdoor", "promoter"].includes(role.code)) score += 9;
  }
  if (outdoor === "Только в теплый сезон") {
    if (["courier", "promoter"].includes(role.code)) score += 4;
    if (["cleaner_outdoor"].includes(role.code)) score -= 3;
  }
  if (outdoor === "Можно изредка попробовать") {
    if (["promoter", "courier"].includes(role.code)) score += 3;
  }
  if (outdoor === "Не комфортно, могу только в помещении") {
    if (["cashier", "retail_floor", "collector", "kitchen", "barista", "cleaner_indoor"].includes(role.code)) score += 6;
    if (["courier", "cleaner_outdoor"].includes(role.code)) score -= 14;
  }

  const movement = STATE.answers.movement_preference;
  if (movement === "Да, люблю быть за рулем, ездить на дальние расстояния") {
    if (["courier"].includes(role.code)) score += 12;
  }
  if (movement === "Да, люблю гулять и ездить на общественном транспорте") {
    if (["courier", "promoter"].includes(role.code)) score += 9;
  }
  if (movement === "Предпочитаю перемещаться немного") {
    if (["cashier", "barista", "cleaner_indoor"].includes(role.code)) score += 5;
    if (["courier"].includes(role.code)) score -= 6;
  }

  const digital = STATE.answers.digital_matrix || createDefaultDigitalMatrix();
  const digitalAvg = average(Object.values(digital));
  if (["collector", "warehouse"].includes(role.code)) score += digital.tsd * 4;
  if (["cashier"].includes(role.code)) score += digital.cashbox * 4 + digital.computer * 2;
  if (["courier"].includes(role.code)) score += digital.apps * 4;
  if (["retail_floor", "barista"].includes(role.code)) score += digital.apps * 2 + digital.computer * 2;
  if (digitalAvg <= 1 && ["collector", "warehouse", "cashier"].includes(role.code)) score -= 6;

  const customer = STATE.answers.customer_contact;
  if (customer === "Люблю общаться, меня это заряжает") {
    if (["cashier", "barista", "promoter", "retail_floor"].includes(role.code)) score += 10;
  }
  if (customer === "Если надо - пообщаемся") {
    if (["cashier", "retail_floor", "barista"].includes(role.code)) score += 5;
  }
  if (customer === "Если только не целый день, я устаю") {
    if (["collector", "warehouse", "kitchen"].includes(role.code)) score += 5;
    if (["promoter"].includes(role.code)) score -= 4;
  }
  if (customer === "Стараюсь избегать такую работу, где нужно много общаться") {
    if (["collector", "warehouse", "kitchen", "cleaner_indoor", "cleaner_outdoor"].includes(role.code)) score += 7;
    if (["cashier", "barista", "promoter"].includes(role.code)) score -= 10;
  }

  const team = STATE.answers.team_contact;
  if (team === "Да, люблю большие коллективы, есть шансы расширить круг общения и найти друзей") {
    if (["kitchen", "cashier", "promoter", "retail_floor"].includes(role.code)) score += 8;
  }
  if (team === "Если нужно, я готов подстроиться") score += 3;
  if (team === "Не люблю большие компании, предпочитаю небольшие команды (2-3 человека)") {
    if (["barista", "courier", "cleaner_indoor"].includes(role.code)) score += 5;
  }
  if (team === "Я люблю быть сам по себе: работать без начальника и коллег") {
    if (["courier"].includes(role.code)) score += 8;
    if (["kitchen", "cashier", "promoter"].includes(role.code)) score -= 6;
  }

  const pay = STATE.answers.pay_format;
  if (pay === "Люблю сдельную оплату - можно получать повышенный доход за высокую производительность") {
    if (["courier", "collector", "warehouse", "promoter"].includes(role.code)) score += 10;
  }
  if (pay === "Сдельная оплата подходит, но если есть гарантированный минимум") {
    if (["courier", "collector", "warehouse", "promoter"].includes(role.code)) score += 5;
    if (["cashier", "retail_floor"].includes(role.code)) score += 3;
  }
  if (pay === "Нравится оплата за результат без ограничений, сколько его делать") {
    if (["courier", "collector"].includes(role.code)) score += 11;
  }
  if (pay === "Мне подходит только почасовая оплата") {
    if (["cashier", "retail_floor", "kitchen", "cleaner_indoor", "barista"].includes(role.code)) score += 10;
    if (["courier"].includes(role.code)) score -= 6;
  }

  const duration = Number(STATE.answers.shift_duration || 6);
  if (duration <= 4) {
    if (["promoter", "courier", "barista"].includes(role.code)) score += 7;
  } else if (duration <= 8) {
    if (["cashier", "retail_floor", "barista", "kitchen", "collector"].includes(role.code)) score += 6;
  } else {
    if (["warehouse", "cleaner_outdoor", "cleaner_indoor", "collector"].includes(role.code)) score += 6;
  }

  const experienceText = [
    STATE.answers.experience_details,
    STATE.answers.interest_primary_details,
    STATE.answers.hours_week_details,
    STATE.answers.priority_now_details,
    STATE.answers.physical_load_limits,
    STATE.answers.new_jobs_city
  ].join(" ").toLowerCase();

  role.skillMatches.forEach((skill) => {
    if (experienceText.includes(skill.toLowerCase().slice(0, 8))) score += 2;
  });

  return clamp(Math.round(score), 35, 98);
}

function computeProfileNarrative(topRole) {
  const family = topRole.family;
  let name = "Гибкий профи подработки";
  if (family === ROLE_FAMILIES.kitchen) name = "Практичный гастро-профиль";
  if (family === ROLE_FAMILIES.retail) name = "Уверенный фронт-линейный профиль";
  if (family === ROLE_FAMILIES.collector) name = "Темповый операционный профиль";
  if (family === ROLE_FAMILIES.service) name = "Сервисный профиль с человеческим контактом";
  if (family === ROLE_FAMILIES.delivery) name = "Подвижный профиль с гибким графиком";
  if (family === ROLE_FAMILIES.warehouse) name = "Сильный операционный профиль";
  if (family === ROLE_FAMILIES.promo) name = "Коммуникационный профиль быстрого старта";
  return {
    name,
    learningReadiness: computeLearningReadiness(),
    description: `Судя по ответам, вам лучше всего подходят роли семейства «${family}»: по сочетанию нагрузки, графика, формата оплаты и уже отмеченных навыков.`
  };
}

function computeLearningReadiness() {
  const interest = STATE.answers.interest_primary;
  const digitalAvg = average(Object.values(STATE.answers.digital_matrix || createDefaultDigitalMatrix()));
  if (interest === "Хочу попробовать новую сферу" || digitalAvg >= 2.5) return "Высокая";
  if (digitalAvg >= 1.5) return "Средняя";
  return "Базовая";
}

function computeRadarScore(topRole) {
  const digital = average(Object.values(STATE.answers.digital_matrix || createDefaultDigitalMatrix()));
  STATE.score.physical = mapPhysicalToScore(STATE.answers.physical_load, STATE.answers.standing_format, STATE.answers.outdoor_format);
  STATE.score.communication = mapCommunicationToScore(STATE.answers.customer_contact, STATE.answers.team_contact);
  STATE.score.digital = clamp(Math.round(20 + digital * 25), 10, 100);
  STATE.score.stability = mapStabilityToScore(STATE.answers.priority_now, STATE.answers.pay_format, Number(STATE.answers.shift_duration || 6));
  STATE.score.learning = mapLearningToScore(topRole);
}

function renderRecommendations(items) {
  UI.recommendations.innerHTML = `
    <div class="section-head">
      <div class="section-head-copy">
        <p class="section-overline">Топ-3 роли</p>
        <h3>Лучшие направления под ваш профиль</h3>
      </div>
    </div>
    <div class="role-list">
      ${items.map((item) => `
        <article class="rec-card hero-rec role-card">
          <div class="role-card-top">
            <span class="role-family-pill">${escapeHtml(item.family)}</span>
            <span class="role-score">${item.score}%</span>
          </div>
          <h4>${escapeHtml(item.role)}</h4>
          <p class="role-lead">${escapeHtml(item.lead)}</p>
          <div class="role-meta">
            <div class="role-stat"><span>Ориентир по ставке</span><strong>${formatCurrency(item.pay)} за смену</strong></div>
            <div class="role-stat"><span>Почему подходит</span><strong>${escapeHtml(item.tags.slice(0, 2).join(" • "))}</strong></div>
          </div>
          <div class="role-tags">${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderFamilyFit(items) {
  UI.familyFit.innerHTML = `
    <div class="section-head">
      <div class="section-head-copy">
        <p class="section-overline">Каталог профессий</p>
        <h3>Твой уровень совпадения по направлениям</h3>
      </div>
    </div>
    <div class="family-columns">
      ${items.map((item) => `
        <article class="rec-card compact-family-card family-card">
          <div class="family-row">
            <strong>${escapeHtml(item.family)}</strong>
            <span class="score-chip">${item.score}%</span>
          </div>
          <div class="family-copy">${escapeHtml(item.role)}</div>
          <div class="family-progress compact-family-progress"><span style="width:${item.score}%"></span></div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCityOffersLink() {
  const cityValue = String(STATE.answers.city || "").trim();
  const cityMeta = lookupCityMeta(cityValue);
  const cityLabel = cityMeta?.label || cityValue;
  const offersUrl = cityMeta?.offersUrl || "";

  if (!cityLabel) {
    UI.realShifts.innerHTML = `
      <div class="section-head">
        <div class="section-head-copy">
          <p class="section-overline">Следующий шаг</p>
          <h3>Смены в вашем городе</h3>
        </div>
      </div>
      <div class="city-link-card">
        <p class="family-copy">Выберите город, и мы откроем актуальную витрину смен именно для него.</p>
      </div>
    `;
    return;
  }

  UI.realShifts.innerHTML = `
    <div class="section-head">
      <div class="section-head-copy">
        <p class="section-overline">Следующий шаг</p>
        <h3>Смены в вашем городе</h3>
      </div>
    </div>
    <div class="city-link-card">
      <p class="family-copy">Открываем городскую витрину Смены для города ${escapeHtml(cityLabel)}.</p>
      ${offersUrl ? `<a class="shift-cta" href="${escapeHtmlAttr(offersUrl)}" target="_blank" rel="noopener noreferrer">Открыть смены в городе ${escapeHtml(cityLabel)}</a>` : `<p class="family-copy">Для этого города пока нет прямой ссылки в конфиге.</p>`}
    </div>
  `;
}

function renderFallback() {
  UI.fallbackBox.classList.add("hidden");
  UI.fallbackBox.innerHTML = "";
}
function drawRadar() {
  const canvas = UI.radar;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2 + 8;
  const radius = Math.min(width, height) * 0.32;
  const labels = ["Нагрузка", "Общение", "Цифра", "Стабильность", "Обучение"];
  const values = [STATE.score.physical, STATE.score.communication, STATE.score.digital, STATE.score.stability, STATE.score.learning];

  ctx.strokeStyle = "rgba(47,108,229,0.12)";
  ctx.fillStyle = "rgba(47,108,229,0.02)";
  for (let layer = 1; layer <= 4; layer += 1) {
    const layerRadius = (radius / 4) * layer;
    ctx.beginPath();
    labels.forEach((_, index) => {
      const angle = (-Math.PI / 2) + (Math.PI * 2 * index / labels.length);
      const x = cx + Math.cos(angle) * layerRadius;
      const y = cy + Math.sin(angle) * layerRadius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  labels.forEach((label, index) => {
    const angle = (-Math.PI / 2) + (Math.PI * 2 * index / labels.length);
    const x = cx + Math.cos(angle) * (radius + 28);
    const y = cy + Math.sin(angle) * (radius + 28);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = "rgba(47,108,229,0.12)";
    ctx.stroke();
    ctx.fillStyle = "#6b7e99";
    ctx.font = "600 12px Arial";
    ctx.textAlign = x < cx - 4 ? "right" : x > cx + 4 ? "left" : "center";
    ctx.fillText(label, x, y);
  });

  ctx.beginPath();
  values.forEach((value, index) => {
    const angle = (-Math.PI / 2) + (Math.PI * 2 * index / values.length);
    const pointRadius = radius * (value / 100);
    const x = cx + Math.cos(angle) * pointRadius;
    const y = cy + Math.sin(angle) * pointRadius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(255,177,41,0.28)";
  ctx.strokeStyle = "#ff8b29";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
}

function isPositiveMovementBase(answers) {
  const standingOk = ["Люблю гулять, поэтому положительно", "В целом подходят такие задания"].includes(answers.standing_format);
  const outdoorOk = ["Да, в любую погоду", "Только в теплый сезон"].includes(answers.outdoor_format);
  return standingOk && outdoorOk;
}

function createDefaultDigitalMatrix() {
  return { computer: 2, cashbox: 2, tsd: 2, apps: 2 };
}

function shortDigitalLabel(label) {
  if (label.startsWith("Лучше")) return "Без";
  if (label.startsWith("Нормально")) return "Норм";
  if (label.startsWith("Поначалу")) return "Учусь";
  return "Уверенно";
}

function average(values) {
  const list = values.map(Number);
  return list.reduce((sum, value) => sum + value, 0) / (list.length || 1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
}

function formatHours(value) {
  const safe = Number(value) || 1;
  const suffix = safe % 10 === 1 && safe % 100 !== 11
    ? "час"
    : (safe % 10 >= 2 && safe % 10 <= 4 && (safe % 100 < 10 || safe % 100 >= 20) ? "часа" : "часов");
  return `${safe} ${suffix}`;
}

function mapPhysicalToScore(physical, standing, outdoor) {
  let base = 40;
  if (physical?.startsWith("Очень")) base = 20;
  if (physical?.startsWith("Легкая")) base = 40;
  if (physical?.startsWith("Средняя")) base = 65;
  if (physical?.startsWith("Тяжелая")) base = 90;
  if (standing === "Люблю гулять, поэтому положительно") base += 6;
  if (standing === "Мне подходит только сидячая работа") base -= 8;
  if (outdoor === "Да, в любую погоду") base += 6;
  if (outdoor === "Не комфортно, могу только в помещении") base -= 6;
  return clamp(base, 10, 100);
}

function mapCommunicationToScore(customer, team) {
  const customerMap = {
    "Люблю общаться, меня это заряжает": 90,
    "Если надо - пообщаемся": 65,
    "Если только не целый день, я устаю": 45,
    "Стараюсь избегать такую работу, где нужно много общаться": 20
  };
  const teamMap = {
    "Да, люблю большие коллективы, есть шансы расширить круг общения и найти друзей": 88,
    "Если нужно, я готов подстроиться": 62,
    "Не люблю большие компании, предпочитаю небольшие команды (2-3 человека)": 48,
    "Я люблю быть сам по себе: работать без начальника и коллег": 18,
    "Мне все равно, какие коллеги, я могу работать с любыми": 58
  };
  return clamp(Math.round(((customerMap[customer] || 50) + (teamMap[team] || 50)) / 2), 10, 100);
}

function mapStabilityToScore(priority, pay, duration) {
  let value = 55;
  if (priority === "Стабильный прогнозируемый доход") value += 20;
  if (priority === "Максимум заработка") value -= 6;
  if (pay === "Мне подходит только почасовая оплата") value += 16;
  if (pay === "Люблю сдельную оплату - можно получать повышенный доход за высокую производительность") value -= 10;
  if (duration >= 8) value += 6;
  if (duration <= 4) value -= 4;
  return clamp(value, 10, 100);
}

function mapLearningToScore(topRole) {
  const readiness = computeLearningReadiness();
  let value = readiness === "Высокая" ? 88 : readiness === "Средняя" ? 63 : 40;
  if (["barista", "cashier", "collector"].includes(topRole.code)) value += 4;
  return clamp(value, 10, 100);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlAttr(value) {
  return escapeHtml(value);
}
