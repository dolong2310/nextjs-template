import { useTaskStore } from "@/stores/sample/sample.store";

export const useTasks = () => {
  return useTaskStore((state) => Object.values(state.tasks));
};

export const useTaskMap = () => {
  return useTaskStore((state) => state.tasks);
};

export const useTaskById = (taskId: string | null) => {
  return useTaskStore((state) => {
    if (!taskId) return null;
    return state.tasks[taskId] ?? null;
  });
};

export const useSelectedTaskId = () => {
  return useTaskStore((state) => state.selectedTaskId);
};

export const useSelectedTask = () => {
  return useTaskStore((state) => {
    if (!state.selectedTaskId) return null;
    return state.tasks[state.selectedTaskId] ?? null;
  });
};

export const useTodoTasks = () => {
  return useTaskStore((state) =>
    Object.values(state.tasks).filter((task) => task.status === "todo"),
  );
};

export const useInProgressTasks = () => {
  return useTaskStore((state) =>
    Object.values(state.tasks).filter((task) => task.status === "in_progress"),
  );
};

export const useDoneTasks = () => {
  return useTaskStore((state) =>
    Object.values(state.tasks).filter((task) => task.status === "done"),
  );
};

export const useTaskActions = () => {
  return useTaskStore((state) => state.actions);
};
