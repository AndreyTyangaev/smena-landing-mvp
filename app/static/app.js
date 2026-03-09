let sessionId = null;
let answers = [];
let currentQuestion = null;

const startBtn = document.getElementById("startBtn");
const chatCard = document.getElementById("chatCard");
const resultCard = document.getElementById("resultCard");
const questionText = document.getElementById("questionText");
const options = document.getElementById("options");
const progressLabel = document.getElementById("progressLabel");
const progressBar = document.getElementById("progressBar");

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  const startRes = await fetch("/api/session/start", { method: "POST" });
  const startJson = await startRes.json();
  sessionId = startJson.session_id;
  chatCard.classList.remove("hidden");
  await loadNextQuestion();
});

async function loadNextQuestion() {
  const res = await fetch("/api/interview/next", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, answers })
  });

  if (!res.ok) {
    await completeInterview();
    return;
  }

  currentQuestion = await res.json();
  renderQuestion(currentQuestion);
}

function renderQuestion(q) {
  questionText.textContent = q.text;
  progressLabel.textContent = `${q.progress}/${q.total}`;
  progressBar.style.width = `${Math.round((q.progress / q.total) * 100)}%`;

  options.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => submitAnswer(opt));
    options.appendChild(btn);
  });
}

async function submitAnswer(answer) {
  answers.push({ question_id: currentQuestion.question_id, answer });
  await loadNextQuestion();
}

async function completeInterview() {
  const res = await fetch("/api/interview/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, answers })
  });

  const summary = await res.json();
  chatCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  renderSummary(summary);
}

function renderSummary(summary) {
  const p = summary.profile;

  let html = `
    <h2>Твой профиль: ${p.profile_type}</h2>
    <p><strong>Цель:</strong> ${p.work_goal} | <strong>Цифровые навыки:</strong> ${p.digital_skill_self} | <strong>Коммуникация:</strong> ${p.communication_pref}</p>
  `;

  if (summary.fallback_mode) {
    html += `
      <div class="fallback">
        <strong>Пока мало идеальных совпадений.</strong>
        <p>${summary.fallback_reason || "Причина уточняется"}</p>
        <p>${summary.wishlist_prompt || "Включите уведомления по интересующим направлениям."}</p>
      </div>
    `;
  }

  html += `<h3>Лучшие варианты смен</h3>`;

  if (!summary.top_matches || summary.top_matches.length === 0) {
    html += `<p>Пока нет доступных смен в этом демо-наборе.</p>`;
  } else {
    summary.top_matches.forEach((m) => {
      html += `<div class="match-item"><strong>${m.shift_id}</strong> - score: ${m.match_score}</br>`;
      if (m.badges && m.badges.length) {
        html += m.badges.map((b) => `<span class="badge">${b}</span>`).join("");
      }
      if (m.reasons && m.reasons.length) {
        html += `<p>${m.reasons.join(" • ")}</p>`;
      }
      html += `</div>`;
    });
  }

  html += `<button class="btn-primary" onclick="location.reload()">Пройти еще раз</button>`;
  resultCard.innerHTML = html;
}
