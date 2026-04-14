import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  CheckCircle2,
  Circle,
  ClipboardList,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "../components/ui/EmptyState";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useToggleTask,
  useUpdateTask,
} from "../hooks/use-tasks";
import type { Task } from "../types/task";

type FilterType = "all" | "active" | "done";

interface TaskFormValues {
  title: string;
  description: string;
}

/* ─── Task Skeleton ─── */
function TaskSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
      <Skeleton className="h-5 w-5 rounded mt-0.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

/* ─── Task Card ─── */
function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const toggle = useToggleTask();

  const dateLabel = new Date(
    Number(task.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      data-ocid="task-card"
      className="task-card group flex items-start gap-3"
    >
      {/* Checkbox */}
      <button
        type="button"
        data-ocid="task-toggle"
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        onClick={() => toggle.mutate(task.id)}
        disabled={toggle.isPending}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          task.completed
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        }`}
      >
        {task.completed ? (
          <Check className="h-3 w-3 text-primary-foreground" />
        ) : (
          <Circle className="h-3 w-3 opacity-0 group-hover:opacity-30 text-primary transition-opacity" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug break-words ${
            task.completed ? "task-completed" : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 break-words leading-relaxed">
            {task.description}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/60">
            {dateLabel}
          </span>
          {task.completed && (
            <Badge
              variant="secondary"
              className="text-[9px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
            >
              Done
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-primary"
          aria-label="Edit task"
          data-ocid="task-edit-btn"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-destructive"
          aria-label="Delete task"
          data-ocid="task-delete-btn"
          onClick={() => onDelete(task)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

/* ─── Quick Add Form ─── */
function QuickAddForm({ onOpen }: { onOpen: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const createTask = useCreateTask();
  const [quickTitle, setQuickTitle] = useState("");

  const handleQuickAdd = async () => {
    const trimmed = quickTitle.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    try {
      await createTask.mutateAsync({ title: trimmed, description: "" });
      setQuickTitle("");
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    }
  };

  return (
    <div className="flex gap-2" data-ocid="quick-add-form">
      <Input
        ref={inputRef}
        data-ocid="quick-add-input"
        placeholder="Add a task…"
        value={quickTitle}
        onChange={(e) => setQuickTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleQuickAdd();
        }}
        className="flex-1 bg-card border-border"
      />
      <Button
        onClick={() => void handleQuickAdd()}
        disabled={!quickTitle.trim() || createTask.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20 shrink-0"
        data-ocid="quick-add-btn"
      >
        {createTask.isPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Add</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 border-dashed"
        aria-label="Add with description"
        onClick={onOpen}
        data-ocid="add-with-desc-btn"
        title="Add task with description"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ─── Stats Bar ─── */
function StatsBar({
  active,
  done,
  total,
}: { active: number; done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="bg-card border border-border rounded-xl p-4 space-y-3"
      data-ocid="stats-bar"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {done === total && total > 0 ? (
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" />
              All done! Great work.
            </span>
          ) : (
            <>
              <span className="font-semibold text-foreground">{done}</span>
              <span className="text-muted-foreground"> of </span>
              <span className="font-semibold text-foreground">{total}</span>
              <span className="text-muted-foreground"> completed</span>
            </>
          )}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{pct}%</span>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{active}</span> active
        </span>
        <span>
          <span className="font-semibold text-foreground">{done}</span> done
        </span>
      </div>
    </div>
  );
}

/* ─── Filter Tabs ─── */
function FilterTabs({
  filter,
  onChange,
  counts,
}: {
  filter: FilterType;
  onChange: (f: FilterType) => void;
  counts: { all: number; active: number; done: number };
}) {
  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "done", label: "Done" },
  ];

  return (
    <div
      className="flex gap-1 bg-muted/50 rounded-lg p-1 border border-border/50"
      data-ocid="task-filter-tabs"
    >
      {tabs.map(({ key, label }) => (
        <button
          type="button"
          key={key}
          onClick={() => onChange(key)}
          data-ocid={`filter-${key}`}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center gap-1.5 ${
            filter === key
              ? "bg-card shadow-xs text-foreground border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
          <span
            className={`tabular-nums ${
              filter === key
                ? "text-primary font-semibold"
                : "text-muted-foreground/60"
            }`}
          >
            {counts[key]}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Task Dialog ─── */
function TaskDialog({
  open,
  onOpenChange,
  title,
  form,
  onChange,
  onSubmit,
  isPending,
  submitLabel,
  ocidPrefix,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  form: TaskFormValues;
  onChange: (f: TaskFormValues) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
  ocidPrefix: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <label
              htmlFor={`${ocidPrefix}-title`}
              className="text-sm font-medium text-foreground"
            >
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id={`${ocidPrefix}-title`}
              data-ocid={`${ocidPrefix}-title-input`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && form.title.trim()) onSubmit();
              }}
              autoFocus
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor={`${ocidPrefix}-desc`}
              className="text-sm font-medium text-foreground"
            >
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Textarea
              id={`${ocidPrefix}-desc`}
              data-ocid={`${ocidPrefix}-desc-input`}
              placeholder="Add some details…"
              value={form.description}
              onChange={(e) =>
                onChange({ ...form, description: e.target.value })
              }
              rows={3}
              className="bg-background resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid={`${ocidPrefix}-cancel-btn`}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
            onClick={onSubmit}
            disabled={!form.title.trim() || isPending}
            data-ocid={`${ocidPrefix}-submit-btn`}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Saving…
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Page ─── */
export default function TasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskFormValues>({
    title: "",
    description: "",
  });
  const [filter, setFilter] = useState<FilterType>("all");

  const openCreate = () => {
    setForm({ title: "", description: "" });
    setIsCreateOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description });
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    try {
      await createTask.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setIsCreateOpen(false);
      setForm({ title: "", description: "" });
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleUpdate = async () => {
    if (!editingTask || !form.title.trim()) return;
    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setEditingTask(null);
      toast.success("Task updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask.mutateAsync(deletingTask.id);
      setDeletingTask(null);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const allTasks = tasks ?? [];
  const activeCnt = allTasks.filter((t) => !t.completed).length;
  const doneCnt = allTasks.filter((t) => t.completed).length;

  const filteredTasks = allTasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const today = new Date();
  const dateHeading = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="space-y-5">
      {/* Date heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
          {dayName}
        </p>
        <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
          {dateHeading}
        </h1>
      </motion.div>

      {/* Quick add form */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
      >
        <QuickAddForm onOpen={openCreate} />
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-2" data-ocid="tasks-loading">
          {(["s1", "s2", "s3"] as const).map((k) => (
            <TaskSkeleton key={k} />
          ))}
        </div>
      )}

      {/* Stats + filter (only when tasks exist) */}
      {!isLoading && allTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="space-y-3"
        >
          <StatsBar active={activeCnt} done={doneCnt} total={allTasks.length} />
          <FilterTabs
            filter={filter}
            onChange={setFilter}
            counts={{ all: allTasks.length, active: activeCnt, done: doneCnt }}
          />
        </motion.div>
      )}

      {/* Task list */}
      {!isLoading && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {/* Filter empty state (tasks exist but filter has none) */}
            {filteredTasks.length === 0 && allTasks.length > 0 && (
              <motion.div
                key="filter-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  title={
                    filter === "active"
                      ? "No active tasks"
                      : "No completed tasks"
                  }
                  description={
                    filter === "active"
                      ? "All caught up! Every task is done."
                      : "Complete a task to see it here."
                  }
                />
              </motion.div>
            )}

            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.2 }}
              >
                <TaskCard
                  task={task}
                  onEdit={openEdit}
                  onDelete={setDeletingTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* No tasks at all */}
          {allTasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              <EmptyState
                icon={<ClipboardList className="h-7 w-7" />}
                title="No tasks yet"
                description="Add your first task above and start getting things done."
                action={
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
                    onClick={openCreate}
                    data-ocid="empty-add-task-btn"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first task
                  </Button>
                }
              />
            </motion.div>
          )}
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-30">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-smooth"
          onClick={openCreate}
          aria-label="Add task"
          data-ocid="fab-add-task"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom padding for FAB */}
      <div className="h-20" />

      {/* Create Dialog */}
      <TaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="New task"
        form={form}
        onChange={setForm}
        onSubmit={() => void handleCreate()}
        isPending={createTask.isPending}
        submitLabel="Create task"
        ocidPrefix="create"
      />

      {/* Edit Dialog */}
      <TaskDialog
        open={!!editingTask}
        onOpenChange={(o) => !o && setEditingTask(null)}
        title="Edit task"
        form={form}
        onChange={setForm}
        onSubmit={() => void handleUpdate()}
        isPending={updateTask.isPending}
        submitLabel="Save changes"
        ocidPrefix="edit"
      />

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deletingTask}
        onOpenChange={(o) => !o && setDeletingTask(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-1">
            <span className="font-medium text-foreground">
              &ldquo;{deletingTask?.title}&rdquo;
            </span>{" "}
            will be permanently deleted. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingTask(null)}
              data-ocid="delete-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              onClick={() => void handleDelete()}
              disabled={deleteTask.isPending}
              data-ocid="delete-confirm-btn"
            >
              {deleteTask.isPending ? "Deleting…" : "Delete task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
