import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import {
  Article,
  Auth,
  Dashboard,
  ForgotPassword,
  Home,
  Profile,
  Stories,
  Topics,
  Write,
} from "./pages/Pages";

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/login" element={<Auth type="login" />} />
            <Route path="/signup" element={<Auth type="signup" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/write" element={<Write />} />
            <Route path="/write/:id" element={<Write />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
