# TaskFlow Mini API

Минимальный REST API для управления задачами. Используется в [api-tests](../api-tests/).

## Эндпоинты

| Method | Path | Описание |
|--------|------|----------|
| GET | `/api/tasks` | Список задач |
| GET | `/api/tasks/:id` | Одна задача |
| POST | `/api/tasks` | Создать `{ "title": "..." }` |
| PATCH | `/api/tasks/:id` | Обновить `{ "completed": true }` |
| DELETE | `/api/tasks/:id` | Удалить |

## Запуск

```bash
npm install
npm start
```

Сервер: `http://localhost:3001`

## Документация

- [openapi.yaml](./openapi.yaml) — OpenAPI 3.0
- [docs.html](./docs.html) — Swagger UI (открыть локально после `npm start`)

## Пример

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Тестовая задача"}'
```
