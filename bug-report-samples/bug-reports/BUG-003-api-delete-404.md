# BUG-003: DELETE /api/tasks/:id возвращает 200 для несуществующей задачи

| Поле | Значение |
|------|----------|
| **ID** | BUG-003 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Компонент** | API / Tasks |
| **Окружение** | Postman, local :3001 |
| **Статус** | Fixed |

## Шаги воспроизведения

1. `DELETE http://localhost:3001/api/tasks/nonexistent-id`

## Ожидаемый результат

HTTP 404, тело `{ "error": "Task not found" }`.

## Фактический результат

HTTP 200, `{ "success": true }`.

## Fix verification

DELETE несуществующего id → 404 (см. [mini-api](../../mini-api/) и [api-tests](../../api-tests/)).
