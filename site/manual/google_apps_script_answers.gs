const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Answers';
const SHARED_TOKEN = ''; // optional: set same value as GOOGLE_SHEETS_WEBHOOK_TOKEN in Vercel

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    if (SHARED_TOKEN && String(payload.__token || '') !== SHARED_TOKEN) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet(ss, SHEET_NAME);
    ensureHeaders(sheet);

    const row = buildRow(payload);
    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: 'smena-answers-webhook' });
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(getHeaders());
}

function getHeaders() {
  return [
    'received_at',
    'submitted_at',
    'city',
    'profile_name',
    'learning_readiness',
    'top_role_code',
    'top_role_name',
    'top_role_family',
    'top_role_score',
    'top_role_pay',
    'interest_primary',
    'hours_week',
    'hours_week_details',
    'priority_now',
    'physical_load',
    'outdoor_format',
    'customer_contact',
    'team_contact',
    'skills_multi',
    'additional_skills_multi',
    'other_skills_details',
    'new_jobs_city',
    'rec_1_role',
    'rec_1_score',
    'rec_2_role',
    'rec_2_score',
    'rec_3_role',
    'rec_3_score',
    'page_url',
    'user_agent',
    'answers_json'
  ];
}

function buildRow(payload) {
  const answers = payload.answers || {};
  const rec = Array.isArray(payload.recommendations) ? payload.recommendations : [];

  return [
    new Date(),
    payload.submittedAt || '',
    payload.city || '',
    value(payload, ['profile', 'name']),
    value(payload, ['profile', 'learningReadiness']),
    value(payload, ['topRole', 'code']),
    value(payload, ['topRole', 'role']),
    value(payload, ['topRole', 'family']),
    value(payload, ['topRole', 'score']),
    value(payload, ['topRole', 'pay']),
    answers.interest_primary || '',
    answers.hours_week || '',
    answers.hours_week_details || '',
    answers.priority_now || '',
    answers.physical_load || '',
    answers.outdoor_format || '',
    answers.customer_contact || '',
    answers.team_contact || '',
    joinList(answers.skills_multi),
    joinList(answers.additional_skills_multi),
    answers.other_skills_details || '',
    answers.new_jobs_city || '',
    value(rec[0], ['role']),
    value(rec[0], ['score']),
    value(rec[1], ['role']),
    value(rec[1], ['score']),
    value(rec[2], ['role']),
    value(rec[2], ['score']),
    payload.pageUrl || '',
    payload.userAgent || '',
    JSON.stringify(answers)
  ];
}

function joinList(value) {
  if (!Array.isArray(value)) return '';
  return value.join(' | ');
}

function value(obj, path) {
  let current = obj;
  for (var i = 0; i < path.length; i++) {
    if (!current || typeof current !== 'object') return '';
    current = current[path[i]];
  }
  return current == null ? '' : current;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
