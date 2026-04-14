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
import { Category, Priority } from "../types/task";
import type { Task } from "../types/task";

type FilterType = "all" | "active" | "done";

interface TaskFormValues {
  title: string;
  description: string;
  category?: Category;
  priority?: Priority;
}

/* ─── Priority badge config ─── */
const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> =
  {
    [Priority.High]: {
      label: "High",
      className:
        "bg-red-500/20 border-red-500/30 text-red-400 backdrop-blur-sm",
    },
    [Priority.Medium]: {
      label: "Medium",
      className:
        "bg-amber-500/20 border-amber-500/30 text-amber-400 backdrop-blur-sm",
    },
    [Priority.Low]: {
      label: "Low",
      className:
        "bg-green-500/20 border-green-500/30 text-green-400 backdrop-blur-sm",
    },
  };

const CATEGORY_CONFIG: Record<Category, { label: string; className: string }> =
  {
    [Category.Work]: {
      label: "Work",
      className: "bg-blue-500/15 border-blue-500/25 text-blue-400",
    },
    [Category.Personal]: {
      label: "Personal",
      className: "bg-purple-500/15 border-purple-500/25 text-purple-400",
    },
    [Category.Urgent]: {
      label: "Urgent",
      className: "bg-orange-500/15 border-orange-500/25 text-orange-400",
    },
  };

/* ─── Priority Selector ─── */
function PrioritySelector({
  value,
  onChange,
}: {
  value?: Priority;
  onChange: (p: Priority) => void;
}) {
  return (
    <div className="flex gap-2">
      {[Priority.High, Priority.Medium, Priority.Low].map((p) => {
        const cfg = PRIORITY_CONFIG[p];
        const isActive = value === p;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? `${cfg.className} ring-1 ring-offset-0 scale-[1.03]`
                : "border-white/10 text-muted-foreground hover:border-white/20 bg-white/5"
            }`}
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Category Selector ─── */
function CategorySelector({
  value,
  onChange,
}: {
  value?: Category;
  onChange: (c: Category | undefined) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[Category.Work, Category.Personal, Category.Urgent].map((c) => {
        const cfg = CATEGORY_CONFIG[c];
        const isActive = value === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(isActive ? undefined : c)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? `${cfg.className} ring-1`
                : "border-white/10 text-muted-foreground hover:border-white/20 bg-white/5"
            }`}
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Task Skeleton ─── */
function TaskSkeleton() {
  return (
    <div className="glass rounded-xl p-4 flex items-start gap-3">
      <Skeleton className="h-5 w-5 rounded mt-0.5 shrink-0 bg-white/10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
        <Skeleton className="h-3 w-1/2 rounded bg-white/5" />
      </div>
    </div>
  );
}

/* ─── Task Card ─── */
function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
}: {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const toggle = useToggleTask();
  const priorityCfg = task.priority ? PRIORITY_CONFIG[task.priority] : null;
  const categoryCfg = task.category ? CATEGORY_CONFIG[task.category] : null;

  const dateLabel = new Date(
    Number(task.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      data-ocid={`task.item.${index + 1}`}
      className={`group relative rounded-xl border backdrop-blur-md p-4 flex items-start gap-3 transition-smooth hover:border-white/20 hover:shadow-lg hover:shadow-black/20 ${
        task.completed
          ? "bg-white/[0.02] border-white/5"
          : "bg-white/[0.06] border-white/10 shadow-md shadow-black/10"
      }`}
    >
      {/* Priority accent strip */}
      {task.priority && !task.completed && (
        <div
          className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${
            task.priority === Priority.High
              ? "bg-red-400/70"
              : task.priority === Priority.Medium
                ? "bg-amber-400/70"
                : "bg-green-400/70"
          }`}
        />
      )}

      {/* Checkbox */}
      <button
        type="button"
        data-ocid={`task.toggle.${index + 1}`}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        onClick={() => toggle.mutate(task.id)}
        disabled={toggle.isPending}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          task.completed
            ? "bg-primary border-primary"
            : "border-white/20 hover:border-primary bg-white/5"
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
        <div className="flex items-start justify-between gap-2 mb-1">
          <p
            className={`text-sm font-medium leading-snug break-words ${
              task.completed
                ? "line-through text-muted-foreground/60"
                : "text-foreground"
            }`}
          >
            {task.title}
          </p>
          {/* Priority badge - prominent placement */}
          {priorityCfg && (
            <span
              className={`shrink-0 inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold ${priorityCfg.className}`}
            >
              {priorityCfg.label}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground/70 line-clamp-2 break-words leading-relaxed mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-muted-foreground/50">
            {dateLabel}
          </span>
          {categoryCfg && (
            <span
              className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${categoryCfg.className}`}
            >
              {categoryCfg.label}
            </span>
          )}
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
          className="h-7 w-7 hover:text-primary hover:bg-white/10"
          aria-label="Edit task"
          data-ocid={`task.edit_button.${index + 1}`}
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
          aria-label="Delete task"
          data-ocid={`task.delete_button.${index + 1}`}
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
      await createTask.mutateAsync({
        title: trimmed,
        description: "",
        priority: Priority.Medium,
      });
      setQuickTitle("");
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    }
  };

  return (
    <div
      className="glass rounded-xl p-3 flex gap-2 border border-white/10"
      data-ocid="quick-add-form"
    >
      <Input
        ref={inputRef}
        data-ocid="task.input"
        placeholder="Quick add a task…"
        value={quickTitle}
        onChange={(e) => setQuickTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void handleQuickAdd();
        }}
        className="flex-1 bg-white/5 border-white/10 focus:border-primary/50 placeholder:text-muted-foreground/50 text-sm"
      />
      <Button
        onClick={() => void handleQuickAdd()}
        disabled={!quickTitle.trim() || createTask.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20 shrink-0"
        data-ocid="task.add_button"
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
        className="shrink-0 border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
        aria-label="Add task with details"
        onClick={onOpen}
        data-ocid="task.open_modal_button"
        title="Add task with details"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ─── Progress Bar ─── */
function ProgressBar({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isAllDone = total > 0 && done === total;

  return (
    <div
      className="glass rounded-xl p-4 border border-white/10"
      data-ocid="progress-bar"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Task Completion
          </span>
          {isAllDone && (
            <CheckCircle2 className="h-3.5 w-3.5 text-primary animate-pulse" />
          )}
        </div>
        <span className="font-display text-2xl font-semibold text-foreground tabular-nums">
          {pct}%
        </span>
      </div>

      {/* Gradient track */}
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-violet-400 to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <p className="text-xs text-muted-foreground">
          {isAllDone ? (
            <span className="text-primary font-medium">
              All {total} tasks complete 🎉
            </span>
          ) : (
            <>
              <span className="font-semibold text-foreground">{done}</span> of{" "}
              <span className="font-semibold text-foreground">{total}</span>{" "}
              tasks complete
            </>
          )}
        </p>
        <span className="text-xs text-muted-foreground/60">
          {total - done} remaining
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
      className="flex gap-1 bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10"
      data-ocid="task.filter.tab"
    >
      {tabs.map(({ key, label }) => (
        <button
          type="button"
          key={key}
          onClick={() => onChange(key)}
          data-ocid={`filter-${key}`}
          className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center gap-1.5 ${
            filter === key
              ? "bg-white/10 backdrop-blur-sm shadow-sm text-foreground border border-white/15"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
          <span
            className={`tabular-nums text-[10px] ${
              filter === key
                ? "text-primary font-semibold"
                : "text-muted-foreground/50"
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
      <DialogContent
        className="bg-card/80 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/40"
        data-ocid={`${ocidPrefix}.dialog`}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor={`${ocidPrefix}-title`}
              className="text-sm font-medium text-foreground"
            >
              Title <span className="text-destructive">*</span>
            </label>
            <Input
              id={`${ocidPrefix}-title`}
              data-ocid={`${ocidPrefix}.input`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={(e) => onChange({ ...form, title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && form.title.trim()) onSubmit();
              }}
              autoFocus
              className="bg-white/5 border-white/15 focus:border-primary/50"
            />
          </div>

          {/* Description */}
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
              data-ocid={`${ocidPrefix}.textarea`}
              placeholder="Add some details…"
              value={form.description}
              onChange={(e) =>
                onChange({ ...form, description: e.target.value })
              }
              rows={3}
              className="bg-white/5 border-white/15 focus:border-primary/50 resize-none"
            />
          </div>

          {/* Priority */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">Priority</p>
            <PrioritySelector
              value={form.priority}
              onChange={(p) => onChange({ ...form, priority: p })}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">
              Category{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </p>
            <CategorySelector
              value={form.category}
              onChange={(c) => onChange({ ...form, category: c })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/15 hover:bg-white/5"
            data-ocid={`${ocidPrefix}.cancel_button`}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
            onClick={onSubmit}
            disabled={!form.title.trim() || isPending}
            data-ocid={`${ocidPrefix}.submit_button`}
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
export default function TasksPage({
  activeCategory,
}: {
  activeCategory: string;
}) {
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
    priority: Priority.Medium,
  });
  const [filter, setFilter] = useState<FilterType>("all");

  const openCreate = () => {
    setForm({ title: "", description: "", priority: Priority.Medium });
    setIsCreateOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
    });
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    try {
      await createTask.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        priority: form.priority ?? Priority.Medium,
      });
      setIsCreateOpen(false);
      setForm({ title: "", description: "", priority: Priority.Medium });
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
        category: form.category,
        priority: form.priority,
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
  const categoryFiltered =
    activeCategory === "all"
      ? allTasks
      : allTasks.filter((t) => t.category === activeCategory);

  const activeCnt = categoryFiltered.filter((t) => !t.completed).length;
  const doneCnt = categoryFiltered.filter((t) => t.completed).length;

  const filteredTasks = categoryFiltered.filter((t) => {
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

  const categoryLabel = activeCategory === "all" ? "My Day" : activeCategory;

  return (
    <div className="space-y-5">
      {/* Date heading */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
          {dayName} · {dateHeading}
        </p>
        <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
          {categoryLabel}
        </h1>
      </motion.div>

      {/* Progress bar (only when there are tasks) */}
      {!isLoading && allTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
        >
          <ProgressBar done={doneCnt} total={categoryFiltered.length} />
        </motion.div>
      )}

      {/* Quick add */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <QuickAddForm onOpen={openCreate} />
      </motion.div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-2.5" data-ocid="tasks.loading_state">
          {(["s1", "s2", "s3"] as const).map((k) => (
            <TaskSkeleton key={k} />
          ))}
        </div>
      )}

      {/* Filter tabs (only when tasks exist) */}
      {!isLoading && categoryFiltered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <FilterTabs
            filter={filter}
            onChange={setFilter}
            counts={{
              all: categoryFiltered.length,
              active: activeCnt,
              done: doneCnt,
            }}
          />
        </motion.div>
      )}

      {/* Task list */}
      {!isLoading && (
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 && categoryFiltered.length > 0 && (
              <motion.div
                key="filter-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                data-ocid="tasks.empty_state"
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
                  index={index}
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
              data-ocid="tasks.empty_state"
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
                    data-ocid="task.add_button"
                  >
                    <Plus className="h-4 w-4" />
                    Add your first task
                  </Button>
                }
              />
            </motion.div>
          )}

          {/* Category empty state */}
          {allTasks.length > 0 && categoryFiltered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              data-ocid="tasks.empty_state"
            >
              <EmptyState
                icon={<ClipboardList className="h-7 w-7" />}
                title={`No ${categoryLabel} tasks`}
                description={`Add a task and assign it to ${categoryLabel} to see it here.`}
                action={
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
                    onClick={openCreate}
                    data-ocid="task.add_button"
                  >
                    <Plus className="h-4 w-4" />
                    Add {categoryLabel} task
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
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-smooth border border-primary/30"
          onClick={openCreate}
          aria-label="Add task"
          data-ocid="fab.primary_button"
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
        title="New Task"
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
        title="Edit Task"
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
        <DialogContent
          className="bg-card/80 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/40"
          data-ocid="delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Delete task?
            </DialogTitle>
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
              className="border-white/15 hover:bg-white/5"
              data-ocid="delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
              onClick={() => void handleDelete()}
              disabled={deleteTask.isPending}
              data-ocid="delete.confirm_button"
            >
              {deleteTask.isPending ? "Deleting…" : "Delete task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
