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
    'interest_primary_details',
    'hours_week',
    'hours_week_details',
    'priority_now',
    'priority_now_details',
    'physical_load',
    'physical_load_limits',
    'standing_format',
    'outdoor_format',
    'movement_preference',
    'digital_computer',
    'digital_cashbox',
    'digital_tsd',
    'digital_apps',
    'customer_contact',
    'team_contact',
    'pay_format',
    'shift_duration_hours',
    'skills_multi',
    'experience_details',
    'new_jobs_city',
    'age_text',
    'city_raw',
    'rec_1_role',
    'rec_1_score',
    'rec_2_role',
    'rec_2_score',
    'rec_3_role',
    'rec_3_score',
    'page_url',
    'user_agent'
  ];
}

function buildRow(payload) {
  const answers = payload.answers || {};
  const digital = answers.digital_matrix || {};
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
    answers.interest_primary_details || '',
    answers.hours_week || '',
    answers.hours_week_details || '',
    answers.priority_now || '',
    answers.priority_now_details || '',
    answers.physical_load || '',
    answers.physical_load_limits || '',
    answers.standing_format || '',
    answers.outdoor_format || '',
    answers.movement_preference || '',
    digital.computer ?? '',
    digital.cashbox ?? '',
    digital.tsd ?? '',
    digital.apps ?? '',
    answers.customer_contact || '',
    answers.team_contact || '',
    answers.pay_format || '',
    answers.shift_duration ?? '',
    joinList(answers.skills_multi),
    answers.experience_details || '',
    answers.new_jobs_city || '',
    answers.age_text || '',
    answers.city || '',
    value(rec[0], ['role']),
    value(rec[0], ['score']),
    value(rec[1], ['role']),
    value(rec[1], ['score']),
    value(rec[2], ['role']),
    value(rec[2], ['score']),
    payload.pageUrl || '',
    payload.userAgent || ''
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
