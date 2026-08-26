import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client, { getError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Field, Notice } from "./PageHelpers";

export function Auth({ type }) {
  const { login, logout } = useAuth();
  const nav = useNavigate();
  const [step, setStep] = useState("form"),
    [error, setError] = useState(""),
    [email, setEmail] = useState(""),
    [signupDetails, setSignupDetails] = useState({ name: "", password: "" });
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const f = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (type === "login") {
        const { data } = await client.post("/auth/login", f);
        login(data);
        nav("/");
      } else if (step === "form") {
        await client.post("/auth/signup/send-otp", { email: f.email });
        setEmail(f.email);
        setSignupDetails({ name: f.name || "", password: f.password || "" });
        setStep("verify");
      } else {
        await client.post("/auth/signup/verify", {
          ...f,
          email,
        });
        logout();
        nav("/login");
      }
    } catch (e) {
      setError(getError(e));
    }
  };
  const signup = type === "signup";
  return (
    <main className="grid min-h-[calc(100vh-72px)] md:grid-cols-2">
      <section className="hidden flex-col justify-between bg-forest p-14 text-white md:flex">
        <Link to="/" className="font-display text-3xl font-bold">
          dow<span className="text-lime">it</span>
        </Link>
        <div>
          <p className="eyebrow !text-stone-300">
            {signup ? "Start your reading habit" : "Welcome back"}
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold leading-none">
            {signup ? (
              <>
                A little more
                <br />
                <em className="not-italic text-lime">curiosity.</em>
              </>
            ) : (
              <>
                Good to see
                <br />
                <em className="not-italic text-lime">you.</em>
              </>
            )}
          </h1>
        </div>
        <p className="max-w-xs border-l-2 border-lime pl-4 font-display text-xl">
          “The important thing is not to stop questioning.”
        </p>
      </section>
      <section className="grid place-items-center px-6 py-16">
        <form onSubmit={submit} className="w-full max-w-sm">
          <p className="eyebrow">
            {signup ? "Create account" : "Sign in to DowIT"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold">
            {signup ? "Join the conversation." : "Welcome back."}
          </h2>
          {signup && step === "verify" ? (
            <>
              <Field
                key="signup-verify-name"
                name="name"
                label="Full name"
                defaultValue={signupDetails.name}
                required
              />
              <Field
                key="signup-verify-password"
                name="password"
                label="Password"
                type="password"
                defaultValue={signupDetails.password}
                autoComplete="new-password"
                required
              />
              <Field
                key="signup-verify-code"
                name="code"
                label="Verification code"
                placeholder="6-digit code"
                autoComplete="one-time-code"
                inputMode="numeric"
                required
              />
              <p className="mb-4 text-sm text-stone-500">
                Code sent to {email}
              </p>
            </>
          ) : (
            <>
              {signup && (
                <Field key="signup-form-name" name="name" label="Full name" required />
              )}
              <Field
                key={signup ? "signup-form-email" : "login-email"}
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                required
              />
              <Field
                key={signup ? "signup-form-password" : "login-password"}
                name="password"
                label="Password"
                type="password"
                autoComplete={signup ? "new-password" : "current-password"}
                required
              />
              {!signup && (
                <Link
                  className="mb-5 block text-right text-sm font-semibold"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              )}
            </>
          )}
          <button className="w-full rounded bg-forest py-3 font-semibold text-white">
            {signup
              ? step === "form"
                ? "Send verification code"
                : "Create account"
              : "Sign in"}
          </button>
          <Notice error={error} />
          <p className="mt-5 text-center text-sm text-stone-500">
            {signup ? (
              <>
                Already have an account?{" "}
                <Link className="font-bold text-forest" to="/login">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to DowIT?{" "}
                <Link className="font-bold text-forest" to="/signup">
                  Create an account
                </Link>
              </>
            )}
          </p>
        </form>
      </section>
    </main>
  );
}
