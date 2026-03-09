# ТЗ: Универсальный ИИ-интервьюер-квест Смены

## 1. Цель

Создать отдельный инструмент (web/чат-бот), который:
- помогает исполнителю понять, какие смены ему подходят;
- повышает конверсию в активных пользователей;
- формирует структурные данные о навыках, ограничениях и карьерных интересах;
- дает Смене основу для запуска новых профессий и точного матчинга.

## 2. Продуктовый сценарий (MVP)

1. Пользователь запускает интервью по deep-link или из рекламы.
2. Проходит 7-10 минутный квест (12-16 шагов):
- быстрый портрет (цель, график, физика, цифровые навыки, коммуникация);
- навыки и интересы (skills + desired_skills);
- 2-3 ситуационные мини-игры (SJT);
- финальный "портрет исполнителя".
3. Система считает `match_score` по активным сменам.
4. Если есть совпадения - показывает top-N с объяснением "почему это вам".
5. Если совпадений нет/мало - запускает fallback:
- объяснение причины;
- подписка на wishlist;
- мягкое расширение критериев и/или микро-обучение.

## 3. Нефункциональные требования

- Время до первой ценности: <= 30 секунд.
- Completion интервью: >= 60% (MVP), целевой >= 70%.
- P95 ответа API матчинга: <= 500 ms.
- Отказоустойчивость API: 99.5%+
- Поддержка мобильных экранов 360px+.

## 4. Архитектура

Компоненты:
- `Interview UI` (web/telegram frontend)
- `Interview Orchestrator` (вопросы, адаптивные ветки)
- `Profile Service` (сборка user_profile)
- `Matching Service` (score + сортировка)
- `Shift Catalog Adapter` (получение shift_profile)
- `Event Gateway` (BI/CDC/streaming)

Поток:
1. `session_started`
2. `question_answered` (много раз)
3. `profile_completed`
4. `matching_computed`
5. `wishlist_updated` (fallback)

## 5. Схема данных

### 5.1 user_profile

- `user_id: string`
- `work_goal: enum(side_income, main_income, temporary, explore)`
- `desired_shifts_per_week: enum(1_2, 3_4, 5_plus)`
- `city: string`
- `region: string`
- `age_group: enum(18_24, 25_34, 35_44, 45_54, 55_plus)`
- `smena_experience_level: enum(new, few_shifts, experienced)`
- `physical_intensity_pref: enum(low, mid, high)`
- `standing_tolerance: enum(full, partial, seated_only)`
- `digital_skill_self: enum(low, mid, high)`
- `communication_pref: enum(low, mid, high)`
- `preferred_dayparts: array(enum(morning, day, evening, night))`
- `health_constraints: array(enum(no_heavy_lifting, no_long_standing, no_night, other))`
- `skills: array({skill_code, level})`
- `desired_skills: array(skill_code)`
- `behavior_scores: object(1..5)`
- `profile_type: string`
- `readiness_for_training: int(1..5)`
- `profile_version: int`
- `profile_completed_at: timestamp`

### 5.2 shift_profile

- `shift_id: string`
- `title: string`
- `city, region`
- `dayparts: array`
- `physical_intensity: enum(low, mid, high)`
- `standing_level: enum(full, partial, seated)`
- `digital_complexity: enum(none, basic, advanced)`
- `communication_level: enum(low, mid, high)`
- `required_skills: array(skill_code)`
- `optional_skills: array(skill_code)`
- `health_requirements: array(enum)`
- `pay_per_shift_rub: int`

### 5.3 user_shift_match

- `user_id`
- `shift_id`
- `match_score: float(0..100)`
- `score_location`
- `score_schedule`
- `score_physical`
- `score_digital`
- `score_communication`
- `score_skills`
- `score_behavior`
- `badges: array(string)`
- `reasons: array(string)`

## 6. Формула матчинга (MVP)

`match_score = sum(component_score * weight)`

Весы:
- location: 0.25
- schedule: 0.20
- physical: 0.15
- digital: 0.10
- communication: 0.10
- skills: 0.15
- behavior: 0.05

Правила:
- жесткий конфликт по health constraints = score 0;
- обязательный `required_skill`, если задан, должен быть в профиле;
- top-рекомендации: `match_score >= 60`.

## 7. Логика fallback (нет подходящих смен)

Триггер:
- нет смен с `match_score >= 60`.

Действия:
1. Показать причину: локация / график / требования / редкий skill.
2. Предложить wishlist (desired roles, dayparts, radius, бренды).
3. Предложить "расширить рамки" одним безопасным шагом:
- увеличить радиус;
- добавить еще один daypart;
- рассмотреть `mid` физнагрузку.
4. Записать событие `wishlist_updated`.

## 8. API контракт (MVP)

- `POST /api/session/start` -> `{ session_id }`
- `POST /api/interview/next` -> `InterviewQuestion`
- `POST /api/interview/answer` -> `InterviewQuestion`
- `POST /api/interview/complete` -> `InterviewSummary`

### Пример `profile_completed`

```json
{
  "event": "profile_completed",
  "source": "smena_ai_interview_bot",
  "timestamp": "2026-03-08T17:20:00Z",
  "user_id": "123456789",
  "session_id": "abcde-12345",
  "user_profile": {
    "work_goal": "side_income",
    "desired_shifts_per_week": "3_4",
    "city": "Москва",
    "region": "Москва",
    "age_group": "25_34",
    "physical_intensity_pref": "mid",
    "standing_tolerance": "partial",
    "digital_skill_self": "mid",
    "communication_pref": "high",
    "preferred_dayparts": ["day", "evening"],
    "skills": [{ "skill_code": "courier", "level": 2 }],
    "desired_skills": ["merchandiser"]
  }
}
```

## 9. Игровые механики

- шкала прогресса интервью;
- бейджи по итогам матчинга;
- мини-симуляции поведения (SJT);
- финальный тип исполнителя;
- "карта роста": какие навыки открыть, чтобы поднять доход/варианты.

## 10. Метрики и A/B

События:
- `session_started`
- `question_answered`
- `profile_completed`
- `recommendations_viewed`
- `shift_clicked`
- `shift_applied`
- `wishlist_updated`
- `interview_dropped`

KPI MVP:
- completion rate
- conversion to active (first accepted shift)
- share of users with >=1 high match
- fallback-to-wishlist conversion
- 7/30 day retention

A/B гипотезы:
- тон интервью (дружелюбный vs нейтральный);
- длина сценария (10 vs 14 вопросов);
- порог рекомендаций (55 vs 60);
- порядок блоков (skills раньше/позже).

## 11. План внедрения

Этап 1 (2-3 недели):
- web MVP + API + базовый матчинг + события.

Этап 2 (3-5 недель):
- интеграция с реальным shift-каталогом;
- BI-дашборд сегментов и незакрытого спроса;
- wishlist уведомления.

Этап 3 (5-8 недель):
- voice mode;
- адаптивные ветки по сегментам;
- модель предикта `risk_of_dropout`.

## 12. Риски

- Смещение данных самооценки навыков -> решается валидацией фактом выхода/рейтинга.
- Длинное интервью -> адаптивное сокращение по confidence.
- Нехватка размеченных тегов на сменах -> ввод минимального стандарта shift_profile.
- Этические риски по возрасту/ограничениям -> только для персонализации, без дискриминации.

## 13. Что уже реализовано в этом репозитории

- Базовая версия API интервью и матчинга.
- Демо UI квеста.
- Fallback логика и wishlist prompt.
- Эталонные модели данных и payloads для интеграции.
