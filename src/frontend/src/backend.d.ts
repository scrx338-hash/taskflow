import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: TaskId;
    title: string;
    owner: Principal;
    createdAt: bigint;
    completed: boolean;
    description: string;
    updatedAt: bigint;
}
export type ToggleTaskResult = {
    __kind__: "ok";
    ok: Task;
} | {
    __kind__: "err";
    err: string;
};
export type UpdateTaskResult = {
    __kind__: "ok";
    ok: Task;
} | {
    __kind__: "err";
    err: string;
};
export type DeleteTaskResult = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export type TaskId = string;
export type CreateTaskResult = {
    __kind__: "ok";
    ok: Task;
} | {
    __kind__: "err";
    err: string;
};
export interface backendInterface {
    createTask(title: string, description: string): Promise<CreateTaskResult>;
    deleteTask(id: TaskId): Promise<DeleteTaskResult>;
    getTasks(): Promise<Array<Task>>;
    toggleTask(id: TaskId): Promise<ToggleTaskResult>;
    updateTask(id: TaskId, title: string, description: string): Promise<UpdateTaskResult>;
}
