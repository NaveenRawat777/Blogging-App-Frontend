import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";

export const Loading = () => (
  <div className="grid min-h-48 place-items-center text-stone-500">
    <LoaderCircle className="animate-spin" />
  </div>
);

export const StoryGridSkeleton = ({ count = 4 }) => (
  <div className="grid gap-x-8 gap-y-10 md:grid-cols-2" aria-label="Loading stories">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="grid grid-cols-[130px_1fr] gap-5 animate-pulse">
        <div className="h-32 bg-stone-200" />
        <div className="space-y-3 py-1">
          <div className="h-5 w-20 rounded-full bg-stone-200" />
          <div className="h-6 w-4/5 rounded bg-stone-200" />
          <div className="h-4 w-full rounded bg-stone-200" />
          <div className="h-4 w-2/3 rounded bg-stone-200" />
          <div className="h-4 w-28 rounded bg-stone-200" />
        </div>
      </div>
    ))}
  </div>
);

export const Notice = ({ error }) =>
  error && (
    <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
      {error}
    </p>
  );

export function Field({ label, name, type = "text", ...props }) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="mb-4 grid gap-2 text-sm font-semibold">
      {label}
      <span className="relative block">
        <input
          className="w-full rounded border border-stone-300 bg-white px-3 py-3 pr-11 font-normal outline-forest"
          name={name}
          type={isPassword && showPassword ? "text" : type}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-500 hover:text-forest"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
    </label>
  );
}
