export type RootStackParamList = {
  Tasks: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
};

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
};

export type NewTaskInput = {
  title: string;
  description: string;
};

export type TaskFilter = 'all' | 'active' | 'completed';

export type ApiSuggestion = {
  id: number;
  title: string;
  description: string;
};

