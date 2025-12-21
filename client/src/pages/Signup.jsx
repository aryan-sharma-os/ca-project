import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/slices/authSlice.js";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [formError, setFormError] = useState("");

  const validate = () => {
    const errs = { name: "", email: "", password: "" };
    if (!name || name.trim().length < 2)
      errs.name = "Name must be at least 2 chars";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) errs.email = "Enter a valid email";
    if (!password || password.length < 6)
      errs.password = "Password must be at least 6 chars";
    setErrors(errs);
    const ok = !errs.name && !errs.email && !errs.password;
    if (!ok) setFormError("");
    return ok;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await dispatch(registerUser({ name, email, password, role }));
    if (res.meta.requestStatus === "fulfilled") navigate("/login");
    else setFormError(res.payload?.message || "Signup failed");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <div className="card p-6 md:p-8">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-600 mt-1">Join TeleHeal Nabha</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name}</p>
              )}
            </div>
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
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            <button
              disabled={
                loading || !!(errors.name || errors.email || errors.password)
              }
              className="btn-primary w-full"
            >
              {loading ? "Creating…" : "Sign up"}
            </button>
          </form>
        </div>
        <div className="hidden md:block">
          <div className="h-full w-full card overflow-hidden p-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-600" />
            <div className="relative h-full w-full grid place-items-center p-8">
              <div className="text-white text-center animate-slideUp">
                <h2 className="text-3xl font-bold">Welcome!</h2>
                <p className="mt-2 text-white/90">
                  Secure, role-based telemedicine platform
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
