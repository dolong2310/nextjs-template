export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

type UpdateTaskInput = Partial<Pick<Task, "title" | "description" | "status">>;

export type TaskState = {
  tasks: Record<string, Task>;
  selectedTaskId: string | null;

  actions: {
    createTask: (input: CreateTaskInput) => Task;
    updateTask: (taskId: string, input: UpdateTaskInput) => void;
    deleteTask: (taskId: string) => void;
    deleteManyTasks: (taskIds: string[]) => void;
    selectTask: (taskId: string | null) => void;
    clearCompletedTasks: () => void;
    resetTasks: () => void;
  };
};

export type PersistedTaskState = Pick<TaskState, "tasks" | "selectedTaskId">;
