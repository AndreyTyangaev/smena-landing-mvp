# Подключение конкретной Google Таблицы к лендингу

Ниже инструкция именно для вашего проекта.  
`/api/answers` уже готов и отправляет ответы в Google webhook.

## 1) Создайте таблицу

1. Откройте [Google Sheets](https://docs.google.com/spreadsheets/).
2. Создайте новую таблицу, например: `Smena Quiz Answers`.
3. Скопируйте `Spreadsheet ID` из адреса:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
```

Нужна часть между `/d/` и `/edit`.

## 2) Создайте Apps Script webhook

1. Откройте [script.new](https://script.new/) (создастся отдельный Apps Script проект).
2. В `Code.gs` вставьте код из файла:
   - [google_apps_script_answers.gs](C:\Users\andre\OneDrive\Документы\New project 2\site\manual\google_apps_script_answers.gs)
3. В коде заполните:
   - `SPREADSHEET_ID = '...ваш id...'`
   - `SHEET_NAME = 'Answers'` (можно оставить)
   - `SHARED_TOKEN = ''` (опционально, шаг 5)
4. Нажмите `Save`.

## 3) Опубликуйте webhook

1. Нажмите `Deploy` -> `New deployment`.
2. Тип: `Web app`.
3. `Execute as`: `Me`.
4. `Who has access`: `Anyone`.
5. Нажмите `Deploy` и подтвердите доступы.
6. Скопируйте `Web app URL`.

## 4) Подключите URL в Vercel

1. Откройте Vercel -> ваш проект -> `Settings` -> `Environment Variables`.
2. Добавьте переменную:
   - `GOOGLE_SHEETS_WEBHOOK_URL` = `Web app URL` из шага 3.
3. Сохраните.
4. Сделайте `Redeploy` (или новый push в `main`).

## 5) Опционально: защита токеном

Если хотите принимать данные только от вашего лендинга:

1. Придумайте секрет, например: `my-super-secret-2026`.
2. В Apps Script:
   - `SHARED_TOKEN = 'my-super-secret-2026'`
3. В Vercel:
   - `GOOGLE_SHEETS_WEBHOOK_TOKEN = my-super-secret-2026`
4. Redeploy.

Сервер будет добавлять `__token` в payload, Apps Script его проверит.

## 6) Проверка

1. Пройдите квест до финального экрана.
2. Откройте таблицу, лист `Answers`.
3. Должна появиться новая строка:
   - город
   - профиль
   - топ-роль
   - ответы по отдельным колонкам
   - топ-3 рекомендации

## 7) Если строки не появляются

1. Vercel -> `Functions` -> `/api/answers`: проверьте 4xx/5xx.
2. Apps Script -> `Executions`: проверьте ошибки запуска.
3. Убедитесь, что:
   - верный `SPREADSHEET_ID`
   - Apps Script задеплоен как `Web app`
   - доступ выставлен `Anyone`
