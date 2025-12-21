import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-indigo-600 animate-float" />
            <span className="font-semibold">TeleHeal Nabha</span>
          </Link>
          <nav className="flex items-center gap-2">
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
