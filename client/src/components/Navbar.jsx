import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../redux/slices/authSlice.js";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-100 dark:bg-gray-900/60 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600 animate-float" />
            <span className="font-semibold">TeleHeal Nabha</span>
          </Link>
          <nav className="flex items-center gap-2">
            <button
              className="btn-secondary"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M12 3v2m0 14v2m7-9h2M3 12H1m15.364 6.364 1.414 1.414M6.222 6.222 4.808 4.808m12.728 0 1.414 1.414M6.222 17.778l-1.414 1.414" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>{" "}
                  Light
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>{" "}
                  Dark
                </span>
              )}
            </button>
            <Link className="btn-secondary" to="/login">
              Login
            </Link>
            <Link className="btn-primary" to="/signup">
              Sign up
            </Link>
            {user && (
              <button
                className="btn-primary"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
