import { Category, Priority } from "../backend";
import type { Task as BackendTask, TaskId } from "../backend";

export { Category, Priority };
export type { TaskId };

export interface Task extends BackendTask {
  id: TaskId;
  title: string;
  description: string;
  completed: boolean;
  createdAt: bigint;
  updatedAt: bigint;
  category?: Category;
  priority?: Priority;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  category?: Category;
  priority?: Priority;
}

export interface UpdateTaskInput {
  id: TaskId;
  title: string;
  description: string;
  category?: Category;
  priority?: Priority;
}
