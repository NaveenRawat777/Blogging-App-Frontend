import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";
import { initials } from "./Layout";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
export default function BlogCard({ blog, featured = false }) {
  const author = blog.author || {};
  return (
    <article
      className={`group grid gap-5 ${featured ? "border-b border-stone-200 pb-9 md:col-span-2 md:grid-cols-[1.05fr_.95fr]" : "grid-cols-[130px_1fr]"}`}
    >
      <Link
        to={`/article/${blog.slug}`}
        className={`block overflow-hidden bg-stone-200 ${featured ? "h-72" : "h-32"}`}
      >
        {blog.cover ? (
          <img
            src={blog.cover}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-sage font-display text-5xl text-forest">
            {blog.category?.[0]}
          </div>
        )}
      </Link>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[.16em] text-stone-500">
          {blog.category} ·{" "}
          {Math.max(
            1,
            Math.ceil((blog.content || "").split(/\s+/).length / 220),
          )}{" "}
          min read
        </p>
        <h2
          className={`mt-2 font-display font-bold leading-tight ${featured ? "text-4xl" : "text-xl"}`}
        >
          <Link to={`/article/${blog.slug}`}>{blog.title}</Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
          <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-forest text-[9px] font-bold text-white">
            {author.avatar ? (
              <img
                className="h-full w-full object-cover"
                src={author.avatar}
                alt=""
              />
            ) : (
              initials(author.name)
            )}
          </span>
          <span>{author.name || "DowIT reader"}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
          <span className="ml-auto flex items-center gap-1">
            <Heart size={13} /> {blog.likes || 0}{" "}
            <Eye className="ml-2" size={13} /> {blog.views || 0}
          </span>
        </div>
      </div>
    </article>
  );
}
