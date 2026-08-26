import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { PenLine, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const initials = (name = "Reader") =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
export function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const signOut = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#fafaf7]/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            to="/"
            className="font-display text-3xl font-bold tracking-tight"
          >
            dow<span className="text-coral">it</span>
          </Link>
          <nav className="hidden gap-7 text-sm font-medium text-stone-500 md:flex">
            <NavLink to="/" end>
              Discover
            </NavLink>
            <NavLink to="/topics">Topics</NavLink>
            <NavLink to="/dashboard">My stories</NavLink>
            <NavLink to="/stories">Stories</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/write"
                  className="hidden items-center gap-2 font-semibold sm:flex"
                >
                  Write <PenLine size={16} className="text-coral" />
                </Link>
                <div className="group relative">
                  <button className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-forest text-xs font-bold text-white">
                    {user.avatar ? (
                      <img
                        className="h-full w-full object-cover"
                        src={user.avatar}
                        alt=""
                      />
                    ) : (
                      initials(user.name)
                    )}
                  </button>
                  <div className="invisible absolute right-0 top-full w-56 border border-stone-200 bg-white opacity-0 shadow-lg transition-all duration-300 delay-100 group-hover:visible group-hover:opacity-100 group-hover:delay-0 pointer-events-auto group-hover:pointer-events-auto mt-1">
                    <div className="border-b border-stone-200 px-3 py-3">
                      <p className="text-sm font-semibold text-stone-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        className="block rounded px-3 py-2 text-sm hover:bg-stone-100"
                        to="/profile"
                      >
                        Profile & settings
                      </Link>
                      <button
                        className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-stone-100"
                        onClick={signOut}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  className="text-sm font-semibold text-stone-600"
                  to="/login"
                >
                  Sign in
                </Link>
                <Link
                  className="rounded bg-forest px-4 py-2.5 text-sm font-semibold text-white"
                  to="/signup"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <div
        key={`${location.pathname}${location.search}${location.hash}`}
        className="page-transition"
      >
        {children}
      </div>
      <footer className="border-t border-stone-200 px-5 py-7 text-xs text-stone-500">
        <div className="mx-auto flex max-w-7xl justify-between">
          <span>© {new Date().getFullYear()} DowIT</span>
          <span>For curious minds.</span>
        </div>
      </footer>
    </>
  );
}
