from __future__ import annotations

from typing import Dict, List

from .models import MatchBreakdown, MatchResult, ShiftProfile, UserProfile


INTENSITY_ORDER = {"low": 1, "mid": 2, "high": 3}
DIGITAL_ORDER = {"none": 0, "basic": 1, "advanced": 2}
USER_DIGITAL_ORDER = {"low": 0, "mid": 1, "high": 2}
COMM_ORDER = {"low": 1, "mid": 2, "high": 3}


def _score_location(user: UserProfile, shift: ShiftProfile) -> float:
    return 1.0 if user.city.lower() == shift.city.lower() else 0.3


def _score_schedule(user: UserProfile, shift: ShiftProfile) -> float:
    overlap = set(user.preferred_dayparts).intersection(set(shift.dayparts))
    return len(overlap) / max(1, len(set(shift.dayparts)))


def _score_physical(user: UserProfile, shift: ShiftProfile) -> float:
    user_level = INTENSITY_ORDER[user.physical_intensity_pref]
    shift_level = INTENSITY_ORDER[shift.physical_intensity]
    if shift_level <= user_level:
        return 1.0
    return 0.1


def _score_digital(user: UserProfile, shift: ShiftProfile) -> float:
    user_level = USER_DIGITAL_ORDER[user.digital_skill_self]
    shift_level = DIGITAL_ORDER[shift.digital_complexity]
    if user_level >= shift_level:
        return 1.0
    if user_level + 1 == shift_level:
        return 0.4
    return 0.1


def _score_communication(user: UserProfile, shift: ShiftProfile) -> float:
    diff = abs(COMM_ORDER[user.communication_pref] - COMM_ORDER[shift.communication_level])
    if diff == 0:
        return 1.0
    if diff == 1:
        return 0.6
    return 0.2


def _score_skills(user: UserProfile, shift: ShiftProfile) -> float:
    user_skills: Dict[str, int] = {s.skill_code: int(s.level) for s in user.skills}

    for req in shift.required_skills:
        if user_skills.get(req, 0) == 0:
            return 0.0

    base = 0.5
    if shift.required_skills:
        base += 0.3
    optional_hit = sum(1 for s in shift.optional_skills if user_skills.get(s, 0) > 0)
    optional_total = max(1, len(shift.optional_skills))
    base += 0.2 * (optional_hit / optional_total)
    return min(1.0, base)


def _score_behavior(user: UserProfile, shift: ShiftProfile) -> float:
    scores = user.behavior_scores
    if shift.communication_level == "high":
        return (scores.customer_orientation + scores.stress_handling + scores.teamwork) / 15
    if shift.communication_level == "mid":
        return (scores.teamwork + scores.rule_orientation + scores.self_reliance) / 15
    return (scores.rule_orientation + scores.self_reliance + scores.digital_problem_solving) / 15


def _has_health_conflict(user: UserProfile, shift: ShiftProfile) -> bool:
    user_set = set(user.health_constraints)
    shift_set = set(shift.health_requirements)
    return len(user_set.intersection(shift_set)) > 0


def _build_badges(user: UserProfile, shift: ShiftProfile) -> List[str]:
    badges: List[str] = []
    if INTENSITY_ORDER[shift.physical_intensity] <= INTENSITY_ORDER[user.physical_intensity_pref]:
        badges.append("Комфортная нагрузка")
    if shift.communication_level == "low":
        badges.append("Минимум общения")
    if shift.digital_complexity in ("none", "basic"):
        badges.append("Простой цифровой порог")
    if user.smena_experience_level == "new":
        badges.append("Подходит новичкам")
    return badges


def _reasons(user: UserProfile, shift: ShiftProfile) -> List[str]:
    reasons: List[str] = []
    if user.city.lower() == shift.city.lower():
        reasons.append("Совпадает город")
    if set(user.preferred_dayparts).intersection(set(shift.dayparts)):
        reasons.append("Подходит по времени")
    if shift.optional_skills:
        reasons.append("Учитывает ваш опыт")
    return reasons


def calculate_match(user: UserProfile, shift: ShiftProfile) -> MatchResult:
    if _has_health_conflict(user, shift):
        zero = MatchBreakdown(
            score_location=0,
            score_schedule=0,
            score_physical=0,
            score_digital=0,
            score_communication=0,
            score_skills=0,
            score_behavior=0,
        )
        return MatchResult(
            user_id=user.user_id,
            shift_id=shift.shift_id,
            match_score=0,
            breakdown=zero,
            badges=[],
            reasons=["Ограничения по условиям здоровья"],
        )

    breakdown = MatchBreakdown(
        score_location=_score_location(user, shift),
        score_schedule=_score_schedule(user, shift),
        score_physical=_score_physical(user, shift),
        score_digital=_score_digital(user, shift),
        score_communication=_score_communication(user, shift),
        score_skills=_score_skills(user, shift),
        score_behavior=_score_behavior(user, shift),
    )

    weights = {
        "score_location": 0.25,
        "score_schedule": 0.2,
        "score_physical": 0.15,
        "score_digital": 0.1,
        "score_communication": 0.1,
        "score_skills": 0.15,
        "score_behavior": 0.05,
    }

    score = (
        breakdown.score_location * weights["score_location"]
        + breakdown.score_schedule * weights["score_schedule"]
        + breakdown.score_physical * weights["score_physical"]
        + breakdown.score_digital * weights["score_digital"]
        + breakdown.score_communication * weights["score_communication"]
        + breakdown.score_skills * weights["score_skills"]
        + breakdown.score_behavior * weights["score_behavior"]
    )

    return MatchResult(
        user_id=user.user_id,
        shift_id=shift.shift_id,
        match_score=round(score * 100, 1),
        breakdown=breakdown,
        badges=_build_badges(user, shift),
        reasons=_reasons(user, shift),
    )


def rank_matches(user: UserProfile, shifts: List[ShiftProfile]) -> List[MatchResult]:
    results = [calculate_match(user, s) for s in shifts]
    return sorted(results, key=lambda r: r.match_score, reverse=True)
