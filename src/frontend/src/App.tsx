import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { AuthGuard } from "./components/AuthGuard";
import { Layout } from "./components/Layout";
import { PageLoader } from "./components/ui/LoadingSpinner";
import { ToastProvider } from "./components/ui/Toast";

const LoginPage = lazy(() => import("./pages/Login"));
const TasksPage = lazy(() => import("./pages/Tasks"));

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
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <TasksPage />
          </Suspense>
        </Layout>
      </AuthGuard>
    </ThemeProvider>
  );
}
