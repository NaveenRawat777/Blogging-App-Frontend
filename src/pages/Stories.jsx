import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import client from "../api/client";
import BlogCard from "../components/BlogCard";
import { StoryGridSkeleton } from "./PageHelpers";
import { categories } from "./constants";

export function Stories() {
  const [stories, setStories] = useState([]),
    [category, setCategory] = useState("All"),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    client
      .get("/blogs", {
        params: {
          limit: 50,
          ...(category !== "All" && { category }),
        },
      })
      .then(({ data }) => setStories(data.items))
      .finally(() => setLoading(false));
  }, [category]);
  return (
    <main>
      <section className="mx-auto max-w-7xl border-b border-stone-200 px-5 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Curated collection</p>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              All Stories
            </h1>
            <p className="mt-2 text-stone-600 max-w-xl">
              Browse every published story from the DowIT community.
            </p>
          </div>
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 border-b border-forest pb-1 text-sm font-bold"
          >
            Browse by topic <ArrowRight size={16} className="text-coral" />
          </Link>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              onClick={() => setCategory(item)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                category === item
                  ? "border-forest bg-white text-forest"
                  : "border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        {loading ? (
          <StoryGridSkeleton />
        ) : stories.length ? (
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
            {stories.map((story) => (
              <BlogCard key={story._id} blog={story} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-stone-600 text-lg mb-4">
              No stories found in this category.
            </p>
            <button
              onClick={() => setCategory("All")}
              className="inline-flex items-center gap-2 font-semibold text-forest hover:text-coral transition"
            >
              View all stories
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
