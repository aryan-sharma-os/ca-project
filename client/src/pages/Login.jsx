import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = () => {
    const errs = { email: "", password: "" };
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) errs.email = "Enter a valid email";
    if (!password || password.length < 6)
      errs.password = "Password must be at least 6 chars";
    setErrors(errs);
    return !errs.email && !errs.password;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await dispatch(loginUser({ email, password }));
    if (res.meta.requestStatus === "fulfilled") {
      const role = res.payload.role;
      if (role === "agent") navigate("/agent");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "admin") navigate("/admin");
      else navigate("/patient");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <div className="card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password}</p>
              )}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              disabled={loading || !!(errors.email || errors.password)}
              className="btn-primary w-full"
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>
          {user && <p className="text-sm mt-2">Logged in as {user.email}</p>}
        </div>
        <div className="hidden md:block">
          <div className="h-full w-full card overflow-hidden p-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-sky-500" />
            <div className="relative h-full w-full grid place-items-center p-8">
              <div className="text-white text-center animate-slideUp">
                <h2 className="text-3xl font-bold">TeleHeal Nabha</h2>
                <p className="mt-2 text-white/90">
                  Agent-assisted rural telemedicine platform
                </p>
                <div className="mt-6 h-32 w-32 rounded-full bg-white/20 blur-2xl animate-float mx-auto" />
              </div>
            </div>
            <div className="absolute inset-0 shimmer opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
