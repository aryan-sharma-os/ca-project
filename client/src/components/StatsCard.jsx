export default function StatsCard({ title, value, icon }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      {icon && (
        <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 grid place-items-center">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
