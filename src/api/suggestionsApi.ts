import { ApiSuggestion } from '../types';

type JsonPlaceholderTodo = {
  id: number;
  title: string;
};

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export async function fetchTaskSuggestions(): Promise<ApiSuggestion[]> {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=5',
  );

  if (!response.ok) {
    throw new Error('Could not load task suggestions.');
  }

  const data = (await response.json()) as JsonPlaceholderTodo[];

  return data.map((todo) => ({
    id: todo.id,
    title: titleCase(todo.title),
    description: `Imported suggestion from JSONPlaceholder todo #${todo.id}.`,
  }));
}

