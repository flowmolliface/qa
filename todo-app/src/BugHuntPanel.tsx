import { useState } from 'react';
import { HUNT_BUGS, loadFoundBugs, resetHuntProgress, saveFoundBug } from './bugHunt';

export default function BugHuntPanel() {
  const [found, setFound] = useState<string[]>(() => loadFoundBugs());
  const [showHints, setShowHints] = useState(false);

  function markFound(id: string) {
    setFound(saveFoundBug(id));
  }

  function reset() {
    resetHuntProgress();
    setFound([]);
  }

  const total = HUNT_BUGS.length;
  const done = found.length;

  return (
    <aside className="hunt-panel" data-testid="bug-hunt-panel">
      <div className="hunt-header">
        <span className="hunt-badge">Bug Hunt</span>
        <span className="hunt-score" data-testid="hunt-score">
          {done}/{total}
        </span>
      </div>
      <p className="hunt-desc">
        В этом режиме приложение намеренно сломано. Найдите все баги и отметьте их.
      </p>
      <ul className="hunt-list">
        {HUNT_BUGS.map((bug) => (
          <li key={bug.id} className={found.includes(bug.id) ? 'found' : ''}>
            <label>
              <input
                type="checkbox"
                checked={found.includes(bug.id)}
                onChange={() => markFound(bug.id)}
                data-testid={`hunt-check-${bug.id}`}
              />
              <span>
                <strong>{bug.id}</strong> — {bug.title}
              </span>
            </label>
            {showHints && !found.includes(bug.id) && (
              <p className="hunt-hint">{bug.hint}</p>
            )}
          </li>
        ))}
      </ul>
      <div className="hunt-actions">
        <button type="button" className="hunt-btn ghost" onClick={() => setShowHints((v) => !v)}>
          {showHints ? 'Скрыть подсказки' : 'Подсказки'}
        </button>
        <button type="button" className="hunt-btn ghost" onClick={reset}>
          Сбросить
        </button>
      </div>
      {done === total && (
        <p className="hunt-win" data-testid="hunt-complete">
          Все баги найдены. Можете описать их в формате из bug-report-samples.
        </p>
      )}
    </aside>
  );
}
