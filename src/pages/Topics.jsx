import { Link } from "react-router-dom";
import { categories } from "./constants";

export function Topics() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-18 lg:px-8">
      <p className="eyebrow">Explore by subject</p>
      <h1 className="mt-4 font-display text-6xl font-bold leading-none">
        Find your next
        <br />
        <em className="not-italic text-coral">good idea.</em>
      </h1>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {categories.slice(1).map((item, i) => (
          <Link
            key={item}
            to={`/?category=${encodeURIComponent(item)}#latest-thinking`}
            className={`flex min-h-52 flex-col p-6 ${["bg-sage", "bg-[#f0e1c8]", "bg-[#dce9f7]", "bg-[#eaddf2]", "bg-[#f5ddd8]"][i]}`}
          >
            <span className="font-mono text-xs">0{i + 1}</span>
            <h2 className="mt-auto font-display text-3xl font-bold">{item}</h2>
            <p className="mt-1 text-sm text-stone-600">
              Explore perspectives and practical ideas.
            </p>
            <span className="mt-5 text-sm font-bold">Browse →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
