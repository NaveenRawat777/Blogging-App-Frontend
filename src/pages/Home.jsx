import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import client from "../api/client";
import BlogCard from "../components/BlogCard";
import { Loading, Notice } from "./PageHelpers";
import { categories } from "./constants";

export function Home() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const selectedCategory = searchParams.get("category");
  const [blogs, setBlogs] = useState([]),
    [category, setCategory] = useState(
      categories.includes(selectedCategory) ? selectedCategory : "All",
    ),
    [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategory(categories.includes(selectedCategory) ? selectedCategory : "All");
  }, [selectedCategory]);

  useEffect(() => {
    if (location.hash === "#latest-thinking") {
      requestAnimationFrame(() => {
        document.getElementById("latest-thinking")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [location.hash]);

  useEffect(() => {
    setLoading(true);
    client
      .get("/blogs", {
        params: { limit: 12, ...(category !== "All" && { category }) },
      })
      .then(({ data }) => setBlogs(data.items))
      .finally(() => setLoading(false));
  }, [category]);
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div className="self-center">
          <p className="eyebrow">A thoughtful corner of the internet</p>
          <h1 className="mt-4 font-display text-6xl font-bold leading-[.95] tracking-tight md:text-7xl">
            Read ideas that
            <br />
            <em className="not-italic text-coral">move you</em> forward.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-stone-500">
            A collection of sharp thinking on technology, science, psychology
            and the work of building a better life.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 border-b border-forest pb-1 text-sm font-bold"
            to="/topics"
          >
            Explore the journal <ArrowRight size={16} className="text-coral" />
          </Link>
        </div>
        <div className="relative grid h-80 place-items-center overflow-hidden bg-forest text-lime">
          <div className="absolute h-[28rem] w-[28rem] rounded-full border border-lime/60" />
          <div className="absolute h-64 w-64 rounded-full border border-lime/30" />
          <span className="relative font-mono text-3xl leading-[.9]">
            MAKE
            <br />
            ROOM
            <br />
            FOR
            <br />
            WONDER
          </span>
          <span className="absolute right-12 top-10 text-2xl">✦</span>
        </div>
      </section>
      <section
        id="latest-thinking"
        className="mx-auto max-w-7xl border-t border-stone-200 px-5 py-16 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Fresh from DowIT</p>
            <h2 className="mt-2 font-display text-4xl font-bold">
              Latest thinking
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-xs ${category === item ? "border-forest bg-white text-forest" : "border-stone-200 text-stone-500"}`}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
            {blogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} featured={index === 0} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
