import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type TaskId = string;
export type CreateTaskResult = {
    __kind__: "ok";
    ok: Task;
} | {
    __kind__: "err";
    err: string;
};
export interface Task {
    id: TaskId;
    title: string;
    owner: Principal;
    createdAt: bigint;
    completed: boolean;
    description: string;
    updatedAt: bigint;
    category?: Category;
    priority?: Priority;
}
export type ToggleTaskResult = {
    __kind__: "ok";
    ok: Task;
} | {
    __kind__: "err";
    err: string;
};
export interface CreateTaskInput {
    title: string;
    description: string;
    category?: Category;
    priority?: Priority;
}
export type UpdateTaskResult = {
    __kind__: "ok";
    ok: Task;
} | {
    __kind__: "err";
    err: string;
};
export interface UpdateTaskInput {
    title: string;
    description: string;
    category?: Category;
    priority?: Priority;
}
export type DeleteTaskResult = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export enum Category {
    Work = "Work",
    Personal = "Personal",
    Urgent = "Urgent"
}
export enum Priority {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export interface backendInterface {
    createTask(input: CreateTaskInput): Promise<CreateTaskResult>;
    deleteTask(id: TaskId): Promise<DeleteTaskResult>;
    getTasks(): Promise<Array<Task>>;
    toggleTask(id: TaskId): Promise<ToggleTaskResult>;
    updateTask(id: TaskId, input: UpdateTaskInput): Promise<UpdateTaskResult>;
}
