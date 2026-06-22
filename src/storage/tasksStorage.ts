import AsyncStorage from '@react-native-async-storage/async-storage';

import { Task } from '../types';

const TASKS_STORAGE_KEY = '@pritech-task-manager/tasks';

export async function loadTasks(): Promise<Task[]> {
  const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  return JSON.parse(storedTasks) as Task[];
}

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

