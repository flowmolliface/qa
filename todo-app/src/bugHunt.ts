export interface HuntBug {
  id: string;
  hint: string;
  title: string;
}

export const HUNT_BUGS: HuntBug[] = [
  {
    id: 'BH-01',
    title: 'Фильтр «Готовые» показывает лишние задачи',
    hint: 'Отметьте одну задачу выполненной и переключите фильтр.',
  },
  {
    id: 'BH-02',
    title: 'Счётчик активных задач считает неправильно',
    hint: 'Создайте 2 активные и 1 готовую — сравните число в футере.',
  },
  {
    id: 'BH-03',
    title: 'Можно создать «пустую» задачу из пробелов',
    hint: 'Введите несколько пробелов и нажмите «Добавить».',
  },
  {
    id: 'BH-04',
    title: 'Checkbox меняет статус не той задачи',
    hint: 'Создайте 2–3 задачи. Отметьте вторую — посмотрите на первую.',
  },
];

const STORAGE_KEY = 'taskflow-hunt-found';

export function isHuntMode(): boolean {
  return new URLSearchParams(window.location.search).get('hunt') === '1';
}

export function loadFoundBugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFoundBug(id: string): string[] {
  const found = loadFoundBugs();
  if (!found.includes(id)) found.push(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  return found;
}

export function resetHuntProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
