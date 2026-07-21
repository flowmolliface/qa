# Портфолио — QA-тестировщик / Web-разработчик

Репозиторий с практическими работами: документация по тестированию, веб-приложения и автотесты.

## Live demo

| | Ссылка |
|---|--------|
| **Портфолио** | https://flowmolliface.github.io/qa/ |
| **Bug Hunt** | https://flowmolliface.github.io/qa/todo-app/?hunt=1 |
| **API Docs** | https://flowmolliface.github.io/qa/mini-api/docs.html |

## Проекты

| Проект | Описание | Стек |
|--------|----------|------|
| [bug-hunt](./bug-hunt/) | Интерактивный поиск багов в TaskFlow | QA, Exploratory |
| [landing-page](./landing-page/) | Одностраничное портфолио | HTML, CSS, JS |
| [todo-app](./todo-app/) | SPA для управления задачами | React, TypeScript, Vite |
| [mini-api](./mini-api/) | REST API для задач | Node.js, Express |
| [api-tests](./api-tests/) | Автотесты API | Playwright |
| [e2e-tests](./e2e-tests/) | E2E-тесты UI | Playwright |
| [bug-report-samples](./bug-report-samples/) | Примеры баг-репортов и чек-листов | Markdown |

## Быстрый старт

```bash
# Todo-приложение
cd todo-app && npm install && npm run dev

# API
cd mini-api && npm install && npm start

# API-тесты (API должен быть запущен на :3001)
cd api-tests && npm install && npm test

# E2E (сначала запустить todo-app на :5173)
cd e2e-tests && npm install && npx playwright install && npm test
```

## CI / Deploy

- **CI** — API-тесты, E2E и build при push
- **GitHub Pages** — landing + todo-app + swagger (workflow `pages.yml`)

После первого push: Settings → Pages → Source: **GitHub Actions**.
