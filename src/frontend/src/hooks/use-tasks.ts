import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateTaskInput,
  Task,
  TaskId,
  UpdateTaskInput,
} from "../types/task";

const TASKS_KEY = ["tasks"] as const;

export function useTasks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Task[]>({
    queryKey: TASKS_KEY,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useCreateTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      priority,
    }: CreateTaskInput) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.createTask({
        title,
        description,
        category,
        priority,
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      category,
      priority,
    }: UpdateTaskInput) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.updateTask(id, {
        title,
        description,
        category,
        priority,
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: TaskId) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.deleteTask(id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useToggleTask() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: TaskId) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.toggleTask(id);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: async (id: TaskId) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);
      queryClient.setQueryData<Task[]>(
        TASKS_KEY,
        (old) =>
          old?.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(TASKS_KEY, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}
