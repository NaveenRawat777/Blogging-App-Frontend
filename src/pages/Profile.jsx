import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import client, { getError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Field, Notice } from "./PageHelpers";

export function Profile() {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (user)
      client.get("/users/me").then(({ data }) => setBio(data.bio || ""));
  }, [user]);
  if (!user) return <Navigate to="/login" />;
  const profile = async (event) => {
    event.preventDefault();
    try {
      const { data } = await client.put(
        "/users/me",
        Object.fromEntries(new FormData(event.currentTarget)),
      );
      updateUser({ ...user, ...data, id: data._id || data.id });
    } catch (e) {
      setError(getError(e));
    }
  };
  const plan = async (membership) => {
    try {
      const { data } = await client.put("/users/me/membership", {
        plan: membership,
      });
      updateUser({ ...user, ...data, id: data._id || data.id });
    } catch (e) {
      setError(getError(e));
    }
  };
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Account settings</p>
      <h1 className="mt-3 font-display text-5xl font-bold">
        Make it <em className="not-italic text-coral">yours.</em>
      </h1>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <form
          onSubmit={profile}
          className="border border-stone-200 bg-white p-7"
        >
          <h2 className="font-display text-3xl font-bold">Public profile</h2>
          <div className="mt-6">
            <Field label="Name" name="name" defaultValue={user.name} required />
            <Field
              label="Avatar image URL"
              name="avatar"
              defaultValue={user.avatar}
            />
            <label className="mb-4 grid gap-2 text-sm font-semibold">
              Short bio
              <textarea
                className="min-h-24 rounded border border-stone-300 p-3 font-normal"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </label>
          </div>
          <button className="rounded bg-forest px-5 py-3 text-sm font-bold text-white">
            Save changes
          </button>
        </form>
        <section className="border border-stone-200 bg-white p-7">
          <h2 className="font-display text-3xl font-bold">Your membership</h2>
          <p className="mt-5 font-display text-4xl font-bold capitalize">
            {user.membership || "free"} plan
          </p>
          <p className="mt-2 text-stone-500">
            Choose a plan that matches your writing rhythm.
          </p>
          <div className="mt-6 flex gap-2">
            {["free", "pro", "premium"].map((item) => (
              <button
                key={item}
                onClick={() => plan(item)}
                className={`rounded border px-3 py-2 text-sm font-bold capitalize ${user.membership === item ? "border-forest bg-sage" : "border-stone-200"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-7 border-t border-stone-200 pt-5 text-sm text-stone-500">
            <span className="mr-2 inline text-forest">✓</span> Your membership
            is updated through the backend API.
          </div>
        </section>
      </div>
      <Notice error={error} />
    </main>
  );
}
