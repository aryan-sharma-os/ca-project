import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200 blur-3xl opacity-60 animate-float" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-200 blur-3xl opacity-60 animate-float" />

      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-slideUp">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Telemedicine for Rural{" "}
              <span className="text-indigo-600">Nabha</span>
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Agent-assisted consultations connecting patients, doctors, and
              admins with a secure, scalable MERN platform.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
              <a className="btn-secondary" href="#roles">
                Explore Roles
              </a>
            </div>
          </div>
          <div className="relative animate-fadeIn">
            <div className="card p-6">
              <div className="h-44 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 shimmer opacity-30" />
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• JWT Auth, Role-based access</li>
                <li>• Appointments, Chat, Prescriptions (PDF)</li>
                <li>• MongoDB + Mongoose, Socket.IO</li>
                <li>• Tailwind, Vite, React Router</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold">Who uses TeleHeal?</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Patient",
              desc: "View history and prescriptions",
              to: "/login",
            },
            {
              title: "Agent",
              desc: "Register patients, record vitals",
              to: "/login",
            },
            {
              title: "Doctor",
              desc: "Consult, prescribe, close cases",
              to: "/login",
            },
            {
              title: "Admin",
              desc: "Manage users and analytics",
              to: "/login",
            },
          ].map((c, i) => (
            <Link
              key={c.title}
              to={c.to}
              className="card p-5 hover:shadow-lg transition animate-slideUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
