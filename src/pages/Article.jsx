import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import client, { getError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Loading, Notice } from "./PageHelpers";

export function Article() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(),
    [error, setError] = useState("");
  useEffect(() => {
    client
      .get(`/blogs/${slug}`)
      .then(({ data }) => setBlog(data))
      .catch((e) => setError(getError(e)));
  }, [slug]);
  const like = async () => {
    if (!user) return location.assign("#/login");
    try {
      const { data } = await client.post(`/blogs/${blog._id}/like`);
      setBlog({ ...blog, likes: data.likes });
    } catch (e) {
      setError(getError(e));
    }
  };
  if (error)
    return (
      <main className="mx-auto max-w-3xl px-5 py-28">
        <Notice error={error} />
      </main>
    );
  if (!blog) return <Loading />;
  const plainContent = blog.content.replace(/<[^>]*>/g, " ");
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link className="inline-flex items-center gap-2 text-sm font-bold" to="/">
        <ArrowLeft size={16} /> Back to stories
      </Link>
      <article className="py-12">
        <p className="eyebrow">
          {blog.category} ·{" "}
          {Math.max(1, Math.ceil(plainContent.split(/\s+/).length / 220))} min
          read
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-tight md:text-7xl">
          {blog.title}
        </h1>
        <p className="mt-5 text-xl leading-8 text-stone-500">{blog.excerpt}</p>
        <div className="mt-7 flex items-center justify-between">
          <span className="text-sm font-semibold">
            By {blog.author?.name || "DowIT reader"}
          </span>
          <button
            onClick={like}
            className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm"
          >
            <Heart size={16} /> {blog.likes || 0}
          </button>
        </div>
        {blog.cover && (
          <img
            src={blog.cover}
            alt=""
            className="mt-10 h-96 w-full object-cover"
          />
        )}
        <div
          className="article-content mt-10 whitespace-pre-wrap text-lg leading-8 text-stone-700"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </main>
  );
}
