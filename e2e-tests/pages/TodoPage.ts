import { Page, expect } from '@playwright/test';

export class TodoPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
  }

  async addTask(title: string) {
    await this.page.getByTestId('task-input').fill(title);
    await this.page.getByTestId('add-btn').click();
  }

  taskItems() {
    return this.page.getByTestId('task-item');
  }

  async expectTaskVisible(title: string) {
    await expect(this.page.getByTestId('task-title').filter({ hasText: title })).toBeVisible();
  }
}
