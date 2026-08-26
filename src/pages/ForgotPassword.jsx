import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client, { getError } from "../api/client";
import { Field, Notice } from "./PageHelpers";

export function ForgotPassword() {
  const nav = useNavigate();
  const [stage, setStage] = useState(0),
    [email, setEmail] = useState(""),
    [token, setToken] = useState(""),
    [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const f = Object.fromEntries(new FormData(event.currentTarget));
    try {
      if (stage === 0) {
        await client.post("/auth/forgot/send-otp", { email: f.email });
        setEmail(f.email);
        setError("");
        setStage(1);
      } else if (stage === 1) {
        const { data } = await client.post("/auth/forgot/verify", {
          email,
          code: f.code,
        });
        setToken(data.resetToken);
        setError("");
        setStage(2);
      } else {
        await client.post("/auth/forgot/reset", {
          resetToken: token,
          newPassword: f.password,
        });
        nav("/login");
      }
    } catch (e) {
      setError(getError(e));
    }
  };
  const field =
    stage === 0 ? (
      <Field
        key="recovery-email"
        name="email"
        label="Email address"
        type="email"
        autoComplete="email"
        required
      />
    ) : stage === 1 ? (
      <Field
        key="recovery-code"
        name="code"
        label="Verification code"
        placeholder="6-digit code"
        autoComplete="one-time-code"
        inputMode="numeric"
        required
      />
    ) : (
      <Field
        key="recovery-password"
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        required
      />
    );
  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="eyebrow">Password recovery</p>
        <h1 className="mt-3 font-display text-4xl font-bold">
          Let’s get you back in.
        </h1>
        <p className="my-5 text-sm text-stone-500">
          {stage === 0
            ? "We’ll send a verification code to your email."
            : stage === 1
              ? "Enter your verification code."
              : "Choose a strong new password."}
        </p>
        {field}
        <button className="w-full rounded bg-forest py-3 font-semibold text-white">
          {stage === 0
            ? "Send code"
            : stage === 1
              ? "Verify code"
              : "Save new password"}
        </button>
        <Notice error={error} />
      </form>
    </main>
  );
}
