import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router";
import { LoginForm } from "./components/loginForm";
import AuthLayout from "./layouts/AuthLayout";

import FileUploaderPage from "./pages/FileUploaderPage";
import { ThemeProvider } from "./context/theme-provider";
import KanbanPage from "./pages/KanbanPage";
import SettingsAccount from "./pages/Settings-account";
import SignupForm from "./components/signupForm";
import AuthProvider from "./context/authContext";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="kanban" element={<KanbanPage />} />
              <Route path="fileuploader" element={<FileUploaderPage />} />
              <Route path="settings">
                <Route path="account" element={<SettingsAccount />} />
              </Route>
            </Route>

            <Route path="authenticate" element={<AuthLayout />}>
              <Route path="login" element={<LoginForm />} />
              <Route path="signup" element={<SignupForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
