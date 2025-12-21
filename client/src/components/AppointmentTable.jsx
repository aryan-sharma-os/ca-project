export default function AppointmentTable({ items = [], actions = {} }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Patient</th>
            <th className="py-2 pr-4">Start</th>
            <th className="py-2 pr-4">End</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a._id} className="border-b">
              <td className="py-2 pr-4 font-mono">{a.patientId}</td>
              <td className="py-2 pr-4">
                {new Date(a.startTime).toLocaleString()}
              </td>
              <td className="py-2 pr-4">
                {new Date(a.endTime).toLocaleString()}
              </td>
              <td className="py-2 pr-4">
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
                  {a.status}
                </span>
              </td>
              <td className="py-2 pr-4 flex gap-2">
                {actions.approve && (
                  <button
                    className="btn-primary"
                    onClick={() => actions.approve(a._id)}
                  >
                    Approve
                  </button>
                )}
                {actions.reject && (
                  <button
                    className="btn-secondary"
                    onClick={() => actions.reject(a._id)}
                  >
                    Reject
                  </button>
                )}
                {actions.complete && (
                  <button
                    className="btn-primary"
                    onClick={() => actions.complete(a._id)}
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
