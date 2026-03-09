from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, List
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request

from .interview import build_profile, generate_summary, next_question
from .models import InterviewAnswer, InterviewQuestion, InterviewRequest, InterviewSummary, ShiftProfile


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "sample_shifts.json"

app = FastAPI(title="Smena AI Interviewer MVP", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

SESSIONS: Dict[str, List[InterviewAnswer]] = {}


def _load_shifts() -> List[ShiftProfile]:
    payload = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return [ShiftProfile(**item) for item in payload]


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/session/start")
def start_session() -> Dict[str, str]:
    session_id = str(uuid4())
    SESSIONS[session_id] = []
    return {"session_id": session_id}


@app.post("/api/interview/next", response_model=InterviewQuestion)
def interview_next(payload: InterviewRequest):
    if payload.session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")

    if payload.answers:
        SESSIONS[payload.session_id] = payload.answers

    question = next_question(SESSIONS[payload.session_id])
    if question is None:
        raise HTTPException(status_code=409, detail="Interview already completed")
    return question


@app.post("/api/interview/answer", response_model=InterviewQuestion)
def interview_answer(payload: InterviewRequest):
    if payload.session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")

    if not payload.answers:
        raise HTTPException(status_code=400, detail="No answers provided")

    SESSIONS[payload.session_id] = payload.answers
    question = next_question(payload.answers)
    if question is None:
        raise HTTPException(status_code=204, detail="Completed")
    return question


@app.post("/api/interview/complete", response_model=InterviewSummary)
def interview_complete(payload: InterviewRequest):
    if payload.session_id not in SESSIONS:
        raise HTTPException(status_code=404, detail="Session not found")

    answers = payload.answers or SESSIONS[payload.session_id]
    if len(answers) == 0:
        raise HTTPException(status_code=400, detail="No interview answers")

    user_id = payload.user_id or f"guest-{payload.session_id[:8]}"
    profile = build_profile(user_id, answers)
    summary = generate_summary(profile, _load_shifts())
    return summary
