import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useState } from "react";
import { AuthGuard } from "./components/AuthGuard";
import { Layout } from "./components/Layout";
import { PageLoader } from "./components/ui/LoadingSpinner";
import { ToastProvider } from "./components/ui/Toast";
import { useTasks } from "./hooks/use-tasks";
import { Category } from "./types/task";

const LoginPage = lazy(() => import("./pages/Login"));
const TasksPage = lazy(() => import("./pages/Tasks"));

function AppShell() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: tasks } = useTasks();
  const allTasks = tasks ?? [];

  const categoryCounts: Record<string, number> = {
    all: allTasks.filter((t) => !t.completed).length,
    [Category.Work]: allTasks.filter(
      (t) => t.category === Category.Work && !t.completed,
    ).length,
    [Category.Personal]: allTasks.filter(
      (t) => t.category === Category.Personal && !t.completed,
    ).length,
    [Category.Urgent]: allTasks.filter(
      (t) => t.category === Category.Urgent && !t.completed,
    ).length,
  };

  return (
    <Layout
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      categoryCounts={categoryCounts}
    >
      <Suspense fallback={<PageLoader />}>
        <TasksPage activeCategory={activeCategory} />
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ToastProvider />
      <AuthGuard
        fallback={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        }
      >
        <AppShell />
      </AuthGuard>
    </ThemeProvider>
  );
}
