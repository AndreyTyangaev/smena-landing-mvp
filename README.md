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
