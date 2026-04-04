# MVP лендинга "Смена Профайлер"

Автономный лендинг-квест без интеграции с базой пользователей.

## Как запустить

- Откройте `landing.html` в браузере.

## Как обновлять города

- Бизнес-источник городов: `cities.csv`
- Продовый источник для сайта: `site/data/cities.generated.json`
- После любого изменения `cities.csv` запустите `sync-cities.bat`
- Скрипт сам:
  - читает корневой `cities.csv`
  - чинит возможную битую кириллицу
  - пересобирает `site/data/cities.generated.json` в UTF-8
- После синхронизации запушьте изменения в репозиторий, чтобы Vercel забрал новый список городов

## Как выкатить обновление городов

- Измените `cities.csv`
- Запустите `sync-cities.bat`
- Выполните:

```powershell
git add cities.csv site/data/cities.generated.json sync-cities.ps1 sync-cities.bat
git commit -m "Update cities config"
git push origin main
```

## Выгрузка ответов в Google Таблицу

Сейчас фронт отправляет ответы после завершения квеста в `POST /api/answers`.
Этот endpoint проксирует данные в Google Sheets webhook.

Что нужно сделать:

1. Создать Google Таблицу (например: `Smena Quiz Answers`).
2. В Google Apps Script у таблицы вставить вебхук:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = JSON.parse(e.postData.contents || '{}');
  sheet.appendRow([
    new Date(),
    data.city || '',
    data.profile?.name || '',
    data.topRole?.role || '',
    data.topRole?.score || '',
    JSON.stringify(data.answers || {})
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Опубликовать Apps Script как Web App (`Anyone with the link`).
4. В Vercel добавить переменную окружения:
   - `GOOGLE_SHEETS_WEBHOOK_URL` = URL вашего Apps Script web app.
5. (Опционально) Добавить секрет:
   - `GOOGLE_SHEETS_WEBHOOK_TOKEN`
   - и проверить `x-sheets-token` в Apps Script.
6. Задеплоить обновление (`git push origin main`).

После этого каждый завершенный квест автоматически уходит в таблицу.

## Как проверить, что сайт видит правильные города

- Откройте `cities-debug.html` локально или `/cities-debug.html` на проде
- Страница запросит `/api/cities` и покажет:
  - фактический список городов
  - алиасы
  - `offersUrl`
  - сырой JSON-ответ API

## Что обновлено под матрицу профессий

- Добавлены семейства ролей: `collector`, `rtz`, `cleaner`, `cashier`, `kitchen`, `barista`, `courier`, `promoter`.
- Добавлены спец-вопросы профилирования:
  - готовность к работе на улице/в холоде;
  - перенос тяжестей (`heavy_weight`);
  - предпочтение по оплате (сдельная/фикс);
  - отношение к уборке/санитарии;
  - готовность к короткому обучению.
- Добавлен каталог совпадений по семействам профессий на финальном экране.

## Что внутри MVP

- Игровой многошаговый квест (17 шагов).
- Бейджи по ходу прохождения.
- Финальный "портрет исполнителя".
- "Кружок самопознания" (radar chart).
- Топ рекомендаций по ролям с `match %`.
- Fallback "план Б", если релевантных ролей мало.
- Экспорт профиля в JSON.
- Локальное сохранение последнего результата в `localStorage`.

## Файлы

- `landing.html`
- `landing.css`
- `landing.js`
- `index.html` (зеркало `landing.html`)
- `cities.csv`
- `sync-cities.ps1`
- `sync-cities.bat`
- `site/data/cities.generated.json`
