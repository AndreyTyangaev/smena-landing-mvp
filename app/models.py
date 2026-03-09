from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


WorkGoal = Literal["side_income", "main_income", "temporary", "explore"]
ShiftsPerWeek = Literal["1_2", "3_4", "5_plus"]
AgeGroup = Literal["18_24", "25_34", "35_44", "45_54", "55_plus"]
ExperienceLevel = Literal["new", "few_shifts", "experienced"]
Intensity = Literal["low", "mid", "high"]
Standing = Literal["full", "partial", "seated_only"]
Daypart = Literal["morning", "day", "evening", "night"]
Digital = Literal["low", "mid", "high"]
SkillLevel = Literal[0, 1, 2]


class SkillEntry(BaseModel):
    skill_code: str
    level: SkillLevel = 0


class BehaviorScores(BaseModel):
    customer_orientation: int = Field(3, ge=1, le=5)
    stress_handling: int = Field(3, ge=1, le=5)
    teamwork: int = Field(3, ge=1, le=5)
    rule_orientation: int = Field(3, ge=1, le=5)
    visual_merch_focus: int = Field(3, ge=1, le=5)
    digital_problem_solving: int = Field(3, ge=1, le=5)
    self_reliance: int = Field(3, ge=1, le=5)


class UserProfile(BaseModel):
    user_id: str
    work_goal: WorkGoal
    desired_shifts_per_week: ShiftsPerWeek
    city: str
    region: str
    age_group: AgeGroup
    smena_experience_level: ExperienceLevel

    physical_intensity_pref: Intensity
    standing_tolerance: Standing
    digital_skill_self: Digital
    communication_pref: Digital
    preferred_dayparts: List[Daypart]
    health_constraints: List[str] = Field(default_factory=list)

    skills: List[SkillEntry] = Field(default_factory=list)
    desired_skills: List[str] = Field(default_factory=list)

    behavior_scores: BehaviorScores = Field(default_factory=BehaviorScores)

    profile_type: str = "unclassified"
    readiness_for_training: int = Field(3, ge=1, le=5)
    profile_completed_at: datetime = Field(default_factory=datetime.utcnow)
    profile_version: int = 1


class ShiftProfile(BaseModel):
    shift_id: str
    title: str
    city: str
    region: str
    dayparts: List[Daypart]

    physical_intensity: Intensity
    standing_level: Literal["full", "partial", "seated"]
    digital_complexity: Literal["none", "basic", "advanced"]
    communication_level: Digital

    required_skills: List[str] = Field(default_factory=list)
    optional_skills: List[str] = Field(default_factory=list)
    health_requirements: List[str] = Field(default_factory=list)

    pay_per_shift_rub: int


class MatchBreakdown(BaseModel):
    score_location: float
    score_schedule: float
    score_physical: float
    score_digital: float
    score_communication: float
    score_skills: float
    score_behavior: float


class MatchResult(BaseModel):
    user_id: str
    shift_id: str
    match_score: float
    breakdown: MatchBreakdown
    badges: List[str] = Field(default_factory=list)
    reasons: List[str] = Field(default_factory=list)


class InterviewAnswer(BaseModel):
    question_id: str
    answer: str


class InterviewRequest(BaseModel):
    session_id: str
    user_id: Optional[str] = None
    channel: Literal["chat", "voice"] = "chat"
    answers: List[InterviewAnswer] = Field(default_factory=list)


class InterviewQuestion(BaseModel):
    question_id: str
    text: str
    options: List[str]
    progress: int
    total: int


class InterviewSummary(BaseModel):
    profile: UserProfile
    top_matches: List[MatchResult]
    fallback_mode: bool
    fallback_reason: Optional[str] = None
    wishlist_prompt: Optional[str] = None
