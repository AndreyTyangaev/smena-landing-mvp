from __future__ import annotations

from typing import Dict, List, Optional

from .models import (
    BehaviorScores,
    InterviewAnswer,
    InterviewQuestion,
    InterviewSummary,
    ShiftProfile,
    SkillEntry,
    UserProfile,
)
from .matching import rank_matches


QUESTION_FLOW = [
    {
        "id": "work_goal",
        "text": "Для чего ты сейчас ищешь смены?",
        "options": ["Подработка", "Основной доход", "Временная работа", "Изучаю варианты"],
    },
    {
        "id": "desired_shifts_per_week",
        "text": "Сколько смен в неделю комфортно?",
        "options": ["1-2", "3-4", "5+"],
    },
    {
        "id": "city",
        "text": "В каком городе ты чаще всего бываешь?",
        "options": ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург"],
    },
    {
        "id": "age_group",
        "text": "Твой возрастной диапазон?",
        "options": ["18-24", "25-34", "35-44", "45-54", "55+"],
    },
    {
        "id": "physical_intensity_pref",
        "text": "Какой уровень физнагрузки комфортен?",
        "options": ["Легкая", "Средняя", "Тяжелая"],
    },
    {
        "id": "standing_tolerance",
        "text": "Как относишься к стоячей работе?",
        "options": ["Всю смену могу", "Только часть", "Предпочитаю сидячую"],
    },
    {
        "id": "digital_skill_self",
        "text": "Как тебе работать с приложениями и техникой?",
        "options": ["Уверенно", "Нормально", "Лучше попроще"],
    },
    {
        "id": "communication_pref",
        "text": "Насколько комфортно общаться с клиентами?",
        "options": ["Люблю общаться", "Нормально", "Лучше без общения"],
    },
    {
        "id": "preferred_dayparts",
        "text": "Когда удобнее работать?",
        "options": ["Утро", "День", "Вечер", "Ночь"],
    },
    {
        "id": "skills",
        "text": "Отметь опыт: выбери 1-3 варианта",
        "options": ["Курьер", "Кладовщик", "Мерчендайзер", "Кассир", "Повар", "Бариста"],
    },
    {
        "id": "desired_skills",
        "text": "Что хочешь попробовать в будущем?",
        "options": ["Кассир", "Мерчендайзер", "Бариста", "Повар", "Склад"],
    },
    {
        "id": "mini_game_1",
        "text": "Ситуация: очередь, клиент нервничает. Твое действие?",
        "options": [
            "Спокойно объясню и предложу решение",
            "Быстро позову старшего",
            "Сфокусируюсь на скорости обслуживания",
        ],
    },
    {
        "id": "mini_game_2",
        "text": "3 задачи одновременно: раскладка, приемка, помощь коллеге. Что первым?",
        "options": [
            "То, что критично по регламенту",
            "То, где очередь/клиенты",
            "То, что быстрее закрыть",
        ],
    },
]


def _normalize(answer: str) -> str:
    return answer.strip().lower()


def next_question(answers: List[InterviewAnswer]) -> Optional[InterviewQuestion]:
    idx = len(answers)
    if idx >= len(QUESTION_FLOW):
        return None

    row = QUESTION_FLOW[idx]
    return InterviewQuestion(
        question_id=row["id"],
        text=row["text"],
        options=row["options"],
        progress=idx + 1,
        total=len(QUESTION_FLOW),
    )


def _profile_type(communication: str, physical: str, digital: str) -> str:
    if communication == "high" and physical in ("low", "mid"):
        return "friendly_frontliner"
    if physical == "high":
        return "dynamic_operator"
    if digital == "high":
        return "digital_universal"
    return "stable_helper_retail"


def _map_skills(raw: str) -> List[SkillEntry]:
    mapper = {
        "курьер": "courier",
        "кладовщик": "warehouse",
        "мерчендайзер": "merchandiser",
        "кассир": "cashier",
        "повар": "cook",
        "бариста": "barista",
        "склад": "warehouse",
    }
    result: List[SkillEntry] = []
    for token in [x.strip().lower() for x in raw.split(",") if x.strip()]:
        code = mapper.get(token)
        if code:
            result.append(SkillEntry(skill_code=code, level=2))
    return result


def _map_desired(raw: str) -> List[str]:
    mapper = {
        "кассир": "cashier",
        "мерчендайзер": "merchandiser",
        "бариста": "barista",
        "повар": "cook",
        "склад": "warehouse",
    }
    desired: List[str] = []
    for token in [x.strip().lower() for x in raw.split(",") if x.strip()]:
        code = mapper.get(token)
        if code:
            desired.append(code)
    return desired


def build_profile(user_id: str, answers: List[InterviewAnswer]) -> UserProfile:
    by_id: Dict[str, str] = {a.question_id: a.answer for a in answers}

    work_goal = {
        "подработка": "side_income",
        "основной доход": "main_income",
        "временная работа": "temporary",
        "изучаю варианты": "explore",
    }.get(_normalize(by_id.get("work_goal", "")), "explore")

    desired_shifts_per_week = {
        "1-2": "1_2",
        "3-4": "3_4",
        "5+": "5_plus",
    }.get(_normalize(by_id.get("desired_shifts_per_week", "")), "3_4")

    age_group = {
        "18-24": "18_24",
        "25-34": "25_34",
        "35-44": "35_44",
        "45-54": "45_54",
        "55+": "55_plus",
    }.get(_normalize(by_id.get("age_group", "")), "25_34")

    physical = {
        "легкая": "low",
        "средняя": "mid",
        "тяжелая": "high",
    }.get(_normalize(by_id.get("physical_intensity_pref", "")), "mid")

    standing = {
        "всю смену могу": "full",
        "только часть": "partial",
        "предпочитаю сидячую": "seated_only",
    }.get(_normalize(by_id.get("standing_tolerance", "")), "partial")

    digital = {
        "уверенно": "high",
        "нормально": "mid",
        "лучше попроще": "low",
    }.get(_normalize(by_id.get("digital_skill_self", "")), "mid")

    communication = {
        "люблю общаться": "high",
        "нормально": "mid",
        "лучше без общения": "low",
    }.get(_normalize(by_id.get("communication_pref", "")), "mid")

    daypart_map = {
        "утро": "morning",
        "день": "day",
        "вечер": "evening",
        "ночь": "night",
    }
    preferred_dayparts = [
        daypart_map.get(x.strip().lower(), "day")
        for x in by_id.get("preferred_dayparts", "День").split(",")
        if x.strip()
    ]

    behavior = BehaviorScores()
    mg1 = _normalize(by_id.get("mini_game_1", ""))
    if "спокойно" in mg1:
        behavior.customer_orientation = 5
        behavior.stress_handling = 4
    elif "старшего" in mg1:
        behavior.teamwork = 4
        behavior.self_reliance = 2
    else:
        behavior.rule_orientation = 4

    mg2 = _normalize(by_id.get("mini_game_2", ""))
    if "регламент" in mg2:
        behavior.rule_orientation = 5
    elif "клиенты" in mg2:
        behavior.customer_orientation = max(behavior.customer_orientation, 4)
    else:
        behavior.self_reliance = 4

    skills = _map_skills(by_id.get("skills", ""))
    desired_skills = _map_desired(by_id.get("desired_skills", ""))

    return UserProfile(
        user_id=user_id,
        work_goal=work_goal,
        desired_shifts_per_week=desired_shifts_per_week,
        city=by_id.get("city", "Москва"),
        region=by_id.get("city", "Москва"),
        age_group=age_group,
        smena_experience_level="new",
        physical_intensity_pref=physical,
        standing_tolerance=standing,
        digital_skill_self=digital,
        communication_pref=communication,
        preferred_dayparts=preferred_dayparts,
        skills=skills,
        desired_skills=desired_skills,
        behavior_scores=behavior,
        profile_type=_profile_type(communication, physical, digital),
        readiness_for_training=4 if desired_skills else 2,
        profile_version=1,
    )


def generate_summary(user_profile: UserProfile, shifts: List[ShiftProfile]) -> InterviewSummary:
    ranked = rank_matches(user_profile, shifts)
    top = ranked[:5]
    enough = [m for m in top if m.match_score >= 60]

    if enough:
        return InterviewSummary(profile=user_profile, top_matches=enough, fallback_mode=False)

    if not top:
        reason = "Сейчас нет смен в вашем городе"
    elif all(m.match_score < 35 for m in top):
        reason = "Пока мало совпадений по графику и ограничениям"
    else:
        reason = "Нет смен с высоким совпадением прямо сейчас"

    wishlist_prompt = (
        "Добавим вас в умный вишлист: выберите 2 направления, и мы отправим приоритетное уведомление, "
        "как только появятся подходящие смены."
    )

    return InterviewSummary(
        profile=user_profile,
        top_matches=top,
        fallback_mode=True,
        fallback_reason=reason,
        wishlist_prompt=wishlist_prompt,
    )
