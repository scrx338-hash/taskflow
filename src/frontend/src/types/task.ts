import type { Task as BackendTask, TaskId } from "../backend";

export type { TaskId };

export interface Task extends BackendTask {
  id: TaskId;
  title: string;
  description: string;
  completed: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export interface UpdateTaskInput {
  id: TaskId;
  title: string;
  description: string;
}
