import { useEffect, useMemo, useState } from 'react';
import type { Filter, Task } from './types';
import { createId, loadTasks, saveTasks } from './types';
import { isHuntMode } from './bugHunt';
import BugHuntPanel from './BugHuntPanel';
import './App.css';

function App() {
  const huntMode = isHuntMode();
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visible = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') {
      // BH-01: в hunt-режиме фильтр «Готовые» сломан
      if (huntMode) return tasks;
      return tasks.filter((t) => t.completed);
    }
    return tasks;
  }, [tasks, filter, huntMode]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  // BH-02: в hunt-режиме показываем общее количество
  const displayCount = huntMode ? tasks.length : activeCount;

  function addTask() {
    const title = huntMode ? input : input.trim();
    if (!title || (!huntMode && !title.trim())) {
      setError('Введите название задачи');
      return;
    }
    setError('');
    setTasks((prev) => [...prev, { id: createId(), title, completed: false }]);
    setInput('');
  }

  function toggle(id: string) {
    setTasks((prev) => {
      if (huntMode) {
        const idx = prev.findIndex((t) => t.id === id);
        // BH-04: переключается предыдущая задача в списке
        const targetId = idx > 0 ? prev[idx - 1].id : id;
        return prev.map((t) =>
          t.id === targetId ? { ...t, completed: !t.completed } : t,
        );
      }
      return prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    });
  }

  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  return (
    <div className={`app ${huntMode ? 'hunt-layout' : ''}`}>
      <div className="app-main">
        <header className="header">
          <h1>TaskFlow</h1>
          <p className="subtitle">
            {huntMode ? 'Режим Bug Hunt — ищите баги' : 'Управление задачами'}
          </p>
        </header>

        <main className="card">
          <div className="input-row">
            <input
              data-testid="task-input"
              type="text"
              placeholder="Что нужно сделать?"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button data-testid="add-btn" type="button" onClick={addTask}>
              Добавить
            </button>
          </div>
          {error && (
            <p data-testid="input-error" className="error" role="alert">
              {error}
            </p>
          )}

          <ul data-testid="task-list" className="task-list">
            {visible.map((task) => (
              <li key={task.id} data-testid="task-item" className={task.completed ? 'done' : ''}>
                <label>
                  <input
                    data-testid="task-checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggle(task.id)}
                  />
                  <span data-testid="task-title">{task.title}</span>
                </label>
                <button
                  data-testid="delete-btn"
                  type="button"
                  className="delete"
                  aria-label="Удалить"
                  onClick={() => remove(task.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {tasks.length > 0 && (
            <footer className="footer">
              <span data-testid="items-left">
                {displayCount}{' '}
                {displayCount === 1 ? 'задача' : displayCount < 5 ? 'задачи' : 'задач'}
              </span>
              <nav className="filters">
                {(['all', 'active', 'completed'] as Filter[]).map((f) => (
                  <button
                    key={f}
                    data-testid={`filter-${f}`}
                    type="button"
                    className={filter === f ? 'active' : ''}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Готовые'}
                  </button>
                ))}
              </nav>
              {tasks.some((t) => t.completed) && (
                <button data-testid="clear-completed" type="button" onClick={clearCompleted}>
                  Очистить готовые
                </button>
              )}
            </footer>
          )}
        </main>
      </div>

      {huntMode && <BugHuntPanel />}
    </div>
  );
}

export default App;
