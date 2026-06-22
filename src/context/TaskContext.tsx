import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { loadTasks, saveTasks } from '../storage/tasksStorage';
import { NewTaskInput, Task } from '../types';

type TaskContextValue = {
  tasks: Task[];
  isLoading: boolean;
  addTask: (input: NewTaskInput) => Task;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const createTask = (input: NewTaskInput): Task => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: input.title.trim(),
  description: input.description.trim(),
  completed: false,
  createdAt: new Date().toISOString(),
});

export function TaskProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadTasks()
      .then((storedTasks) => {
        if (isMounted) {
          setTasks(storedTasks);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks).catch(() => undefined);
    }
  }, [isLoading, tasks]);

  const addTask = useCallback((input: NewTaskInput) => {
    const task = createTask(input);
    setTasks((currentTasks) => [task, ...currentTasks]);
    return task;
  }, []);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  }, []);

  const getTaskById = useCallback(
    (taskId: string) => tasks.find((task) => task.id === taskId),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      isLoading,
      addTask,
      toggleTask,
      deleteTask,
      getTaskById,
    }),
    [addTask, deleteTask, getTaskById, isLoading, tasks, toggleTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider');
  }

  return context;
}

