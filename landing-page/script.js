const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const todoBase = isLocal ? 'http://localhost:5173/' : './todo-app/';

document.querySelectorAll('[data-todo-link]').forEach((el) => {
  if (el instanceof HTMLAnchorElement) {
    el.href = todoBase + (el.dataset.todoLink ?? '');
  }
});

const toggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('portfolio-theme');

if (saved === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
}

toggle?.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('portfolio-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('portfolio-theme', 'light');
  }
});

const lines = [
  '$ cd todo-app && npm run dev',
  '  ➜  Local: http://localhost:5173/?hunt=1',
  '',
  '$ cd e2e-tests && npm test',
  '  7 passed (4.0s)',
  '',
  '$ cd api-tests && npm test',
  '  10 passed (834ms)',
];

const terminal = document.getElementById('terminal-text');
let lineIndex = 0;
let charIndex = 0;

function typeTerminal() {
  if (!terminal || lineIndex >= lines.length) return;

  const line = lines[lineIndex];
  if (charIndex <= line.length) {
    terminal.textContent = lines.slice(0, lineIndex).join('\n') +
      (lineIndex > 0 ? '\n' : '') +
      line.slice(0, charIndex);
    charIndex++;
    setTimeout(typeTerminal, line.startsWith('$') ? 35 : 12);
  } else {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeTerminal, 400);
  }
}

typeTerminal();

document.querySelectorAll('[data-count]').forEach((el) => {
  const target = Number(el.getAttribute('data-count'));
  if (Number.isNaN(target)) return;

  let current = 0;
  const step = Math.max(1, Math.floor(target / 20));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = String(current);
  }, 40);
});
