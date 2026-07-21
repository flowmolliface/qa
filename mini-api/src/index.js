const http = require('http');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3001;
let tasks = [];

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  if (req.method === 'GET' && path === '/health') {
    return send(res, 200, { status: 'ok' });
  }

  if (req.method === 'GET' && path === '/api/tasks') {
    return send(res, 200, tasks);
  }

  const taskMatch = path.match(/^\/api\/tasks\/([^/]+)$/);
  const taskId = taskMatch?.[1];

  if (req.method === 'GET' && taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return send(res, 404, { error: 'Task not found' });
    return send(res, 200, task);
  }

  if (req.method === 'POST' && path === '/api/tasks') {
    if (req.headers['content-type'] !== 'application/json') {
      return send(res, 400, { error: 'Content-Type must be application/json' });
    }
    try {
      const body = await parseBody(req);
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title) return send(res, 400, { error: 'title is required' });
      const task = { id: randomUUID(), title, completed: false, createdAt: new Date().toISOString() };
      tasks.push(task);
      return send(res, 201, task);
    } catch {
      return send(res, 400, { error: 'Invalid JSON body' });
    }
  }

  if (req.method === 'PATCH' && taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return send(res, 404, { error: 'Task not found' });
    try {
      const body = await parseBody(req);
      if (typeof body.completed === 'boolean') task.completed = body.completed;
      if (typeof body.title === 'string' && body.title.trim()) task.title = body.title.trim();
      return send(res, 200, task);
    } catch {
      return send(res, 400, { error: 'Invalid JSON body' });
    }
  }

  if (req.method === 'DELETE' && taskId) {
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return send(res, 404, { error: 'Task not found' });
    tasks.splice(idx, 1);
    return send(res, 200, { success: true });
  }

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`TaskFlow API listening on http://localhost:${PORT}`);
});
