export default function StatsCard({ title, value, icon }) {
  return (
    <div className="card relative p-4 flex items-center gap-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl animate-slideUp">
      {icon && (
        <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 grid place-items-center shadow-soft">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
      <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-indigo-100/40 blur-2xl"></div>
    </div>
  );
}
