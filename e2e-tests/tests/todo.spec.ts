import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test.describe('TaskFlow UI', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  test('adds a new task', async ({ page }) => {
    await todo.addTask('Купить молоко');
    await todo.expectTaskVisible('Купить молоко');
    await expect(page.getByTestId('task-input')).toHaveValue('');
  });

  test('shows error for empty title', async ({ page }) => {
    await page.getByTestId('add-btn').click();
    await expect(page.getByTestId('input-error')).toHaveText('Введите название задачи');
    await expect(todo.taskItems()).toHaveCount(0);
  });

  test('marks task as completed', async ({ page }) => {
    await todo.addTask('Сделать домашку');
    await page.getByTestId('task-checkbox').first().check();
    await expect(page.getByTestId('task-item').first()).toHaveClass(/done/);
  });

  test('deletes a task', async ({ page }) => {
    await todo.addTask('Удалить меня');
    await page.getByTestId('delete-btn').first().click();
    await expect(todo.taskItems()).toHaveCount(0);
  });

  test('filters active and completed', async ({ page }) => {
    await todo.addTask('Активная');
    await todo.addTask('Готовая');
    await page.getByTestId('task-checkbox').nth(1).check();

    await page.getByTestId('filter-active').click();
    await expect(todo.taskItems()).toHaveCount(1);
    await expect(page.getByTestId('task-title')).toHaveText('Активная');

    await page.getByTestId('filter-completed').click();
    await expect(todo.taskItems()).toHaveCount(1);
    await expect(page.getByTestId('task-title')).toHaveText('Готовая');
  });

  test('persists tasks after reload', async ({ page }) => {
    await todo.addTask('После перезагрузки');
    await page.reload();
    await todo.expectTaskVisible('После перезагрузки');
  });

  test('clear completed removes done tasks', async ({ page }) => {
    await todo.addTask('Останется');
    await todo.addTask('Уйдёт');
    await page.getByTestId('task-checkbox').nth(1).check();
    await page.getByTestId('clear-completed').click();
    await expect(todo.taskItems()).toHaveCount(1);
    await expect(page.getByTestId('task-title')).toHaveText('Останется');
  });
});
