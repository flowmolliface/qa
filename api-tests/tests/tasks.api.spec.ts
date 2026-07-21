import { test, expect } from '@playwright/test';

test.describe('GET /api/tasks', () => {
  test('returns 200 and array', async ({ request }) => {
    const res = await request.get('/api/tasks');
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(expect.any(Array));
  });
});

test.describe('POST /api/tasks', () => {
  test('creates task with valid title', async ({ request }) => {
    const res = await request.post('/api/tasks', {
      headers: { 'Content-Type': 'application/json' },
      data: { title: 'API test task' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe('API test task');
    expect(body.completed).toBe(false);
    expect(body.id).toBeTruthy();
  });

  test('rejects empty title', async ({ request }) => {
    const res = await request.post('/api/tasks', {
      headers: { 'Content-Type': 'application/json' },
      data: { title: '   ' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('title');
  });

  test('rejects missing title', async ({ request }) => {
    const res = await request.post('/api/tasks', {
      headers: { 'Content-Type': 'application/json' },
      data: {},
    });
    expect(res.status()).toBe(400);
  });

  test('requires application/json', async ({ request }) => {
    const res = await request.post('/api/tasks', {
      headers: { 'Content-Type': 'text/plain' },
      data: '{"title":"test"}',
    });
    expect(res.status()).toBe(400);
  });
});

test.describe('PATCH /api/tasks/:id', () => {
  test('updates completed flag', async ({ request }) => {
    const create = await request.post('/api/tasks', {
      headers: { 'Content-Type': 'application/json' },
      data: { title: 'Patch me' },
    });
    const { id } = await create.json();

    const patch = await request.patch(`/api/tasks/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      data: { completed: true },
    });
    expect(patch.status()).toBe(200);
    expect((await patch.json()).completed).toBe(true);
  });

  test('returns 404 for unknown id', async ({ request }) => {
    const res = await request.patch('/api/tasks/00000000-0000-0000-0000-000000000000', {
      headers: { 'Content-Type': 'application/json' },
      data: { completed: true },
    });
    expect(res.status()).toBe(404);
  });
});

test.describe('DELETE /api/tasks/:id', () => {
  test('deletes existing task', async ({ request }) => {
    const create = await request.post('/api/tasks', {
      headers: { 'Content-Type': 'application/json' },
      data: { title: 'Delete me' },
    });
    const { id } = await create.json();

    const del = await request.delete(`/api/tasks/${id}`);
    expect(del.status()).toBe(200);

    const get = await request.get(`/api/tasks/${id}`);
    expect(get.status()).toBe(404);
  });

  test('returns 404 for unknown id', async ({ request }) => {
    const res = await request.delete('/api/tasks/nonexistent-id');
    expect(res.status()).toBe(404);
  });
});

test('health check', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ status: 'ok' });
});
