import { ApiSuggestion } from '../types';

type DummyJsonTodo = {
  id: number;
  todo: string;
  completed: boolean;
};

type DummyJsonTodoResponse = {
  todos: DummyJsonTodo[];
};

export async function fetchTaskSuggestions(): Promise<ApiSuggestion[]> {
  const response = await fetch('https://dummyjson.com/todos?limit=5&skip=10');

  if (!response.ok) {
    throw new Error('Could not load task suggestions.');
  }

  const data = (await response.json()) as DummyJsonTodoResponse;

  return data.todos.map((todo) => ({
    id: todo.id,
    title: todo.todo,
    description: `Suggested task from DummyJSON. API status: ${
      todo.completed ? 'completed' : 'active'
    }.`,
  }));
}
