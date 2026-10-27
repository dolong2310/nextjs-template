"use client";

import type {
  PersistedTaskState,
  Task,
  TaskState,
} from "@/stores/sample/sample.type";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialState: PersistedTaskState = {
  tasks: {},
  selectedTaskId: null,
};

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        actions: {
          createTask: (input) => {
            const timestamp = now();

            const task: Task = {
              id: createTaskId(),
              title: input.title,
              description: input.description,
              status: input.status ?? "todo",
              createdAt: timestamp,
              updatedAt: timestamp,
            };

            set(
              (state) => {
                state.tasks[task.id] = task;
              },
              false,
              "tasks/createTask",
            );

            return task;
          },

          updateTask: (taskId, input) => {
            set(
              (state) => {
                const task = state.tasks[taskId];

                if (!task) return;

                if (input.title !== undefined) {
                  task.title = input.title;
                }

                if (input.description !== undefined) {
                  task.description = input.description;
                }

                if (input.status !== undefined) {
                  task.status = input.status;
                }

                task.updatedAt = now();
              },
              false,
              "tasks/updateTask",
            );
          },

          deleteTask: (taskId) => {
            set(
              (state) => {
                delete state.tasks[taskId];

                if (state.selectedTaskId === taskId) {
                  state.selectedTaskId = null;
                }
              },
              false,
              "tasks/deleteTask",
            );
          },

          deleteManyTasks: (taskIds) => {
            set(
              (state) => {
                for (const taskId of taskIds) {
                  delete state.tasks[taskId];
                }

                if (
                  state.selectedTaskId &&
                  taskIds.includes(state.selectedTaskId)
                ) {
                  state.selectedTaskId = null;
                }
              },
              false,
              "tasks/deleteManyTasks",
            );
          },

          selectTask: (taskId) => {
            set(
              (state) => {
                state.selectedTaskId = taskId;
              },
              false,
              "tasks/selectTask",
            );
          },

          clearCompletedTasks: () => {
            set(
              (state) => {
                for (const taskId of Object.keys(state.tasks)) {
                  if (state.tasks[taskId].status === "done") {
                    delete state.tasks[taskId];
                  }
                }

                if (
                  state.selectedTaskId &&
                  !state.tasks[state.selectedTaskId]
                ) {
                  state.selectedTaskId = null;
                }
              },
              false,
              "tasks/clearCompletedTasks",
            );
          },

          resetTasks: () => {
            set(
              (state) => {
                state.tasks = initialState.tasks;
                state.selectedTaskId = initialState.selectedTaskId;
              },
              false,
              "tasks/resetTasks",
            );
          },
        },
      })),
      {
        name: "task-store",
        storage: createJSONStorage(() => localStorage),
        version: 1,

        partialize: (state): PersistedTaskState => ({
          tasks: state.tasks,
          selectedTaskId: state.selectedTaskId,
        }),

        migrate: (persistedState, version) => {
          if (version === 0) {
            return {
              ...initialState,
              ...(persistedState as Partial<PersistedTaskState>),
            };
          }

          return persistedState as PersistedTaskState;
        },
      },
    ),
    {
      name: "TaskStore",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);

function createTaskId() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}
