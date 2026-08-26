import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Notice, StoryGridSkeleton } from "./PageHelpers";
import { categories } from "./constants";
// import api from "../api/client.js";

export function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    client
      .get("/blogs", {
        params: {
          mine: "true",
          limit: 50,
          ...(category !== "All" && { category }),
        },
      })
      .then(({ data }) => setPosts(data.items))
      .catch((e) => setError(e.response?.data?.error || "Failed to load stories"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [category]);

  if (!user) return <Navigate to="/login" />;

  const remove = async (id) => {
    if (!confirm("Delete this story?")) return;
    try {
      await client.delete(`/blogs/${id}`);
      load();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to delete story");
    }
  };

  // get api
  // const [data, setData] = useState();

  // const handleUserData = async()=>{
  //   try{
  //     const userId = localStorage.getItem("userId");
  //     const userData = await api.get(`/user/data/${userId }`);
  //     setData(userData);

  //   }catch(error){

  //   }
  // }
  // useEffect(()=>{
  //   handleUserData();
  // },[])

  // console.log(data)
 
  return (
    <main>
      <section className="mx-auto max-w-7xl border-b border-stone-200 px-5 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Your writing space</p>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">
              My Stories
            </h1>
            <p className="mt-2 text-stone-600 max-w-xl">
              Manage your published and draft stories.
            </p>
          </div>
          <Link
            to="/write"
            className="inline-flex items-center gap-2 rounded-lg bg-forest text-white px-6 py-3 font-semibold hover:bg-forest/90 transition"
          >
            <Plus size={18} />
            Write Story
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
        ) : error ? (
          <Notice error={error} />
        ) : posts.length ? (
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group grid gap-5 grid-cols-[130px_1fr]"
              >
                <Link
                  to={`/write/${post._id}`}
                  className="block overflow-hidden bg-stone-200 h-32"
                >
                  {post.cover ? (
                    <img
                      src={post.cover}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-sage font-display text-5xl text-forest">
                      {post.category?.[0] || "S"}
                    </div>
                  )}
                </Link>
                <div>
                  <div className="flex gap-3 mb-2">
                    <span className="text-xs font-semibold text-coral bg-coral/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-stone-900 mt-3">
                    <Link to={`/write/${post._id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-stone-600 text-sm mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link
                      to={`/write/${post._id}`}
                      className="text-sm font-semibold text-forest hover:text-coral transition px-4 py-2 rounded hover:bg-stone-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(post._id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
                      title="Delete story"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-stone-200 p-12 text-center">
            <div className="text-5xl mb-4">✍️</div>
            <p className="text-stone-600 text-lg mb-4">
              Your canvas is waiting.
            </p>
            <Link
              to="/write"
              className="inline-flex items-center gap-2 font-semibold text-forest hover:text-coral transition"
            >
              <Plus size={18} />
              Write your first story
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
