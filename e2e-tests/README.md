# E2E Tests — TaskFlow

Playwright-тесты для [todo-app](../todo-app/).

## Запуск

```bash
# Терминал 1
cd ../todo-app && npm run dev

# Терминал 2
npm install
npx playwright install chromium
npm test
```

`BASE_URL` по умолчанию: `http://localhost:5173`
