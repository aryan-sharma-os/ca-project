import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logout } from "../redux/slices/authSlice.js";
import { fetchUsers } from "../redux/slices/usersSlice.js";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { items: users, loading } = useSelector((s) => s.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button className="btn-secondary" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-semibold">Users</h2>
        {loading ? (
          <p className="text-sm text-gray-500 mt-2">Loading…</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="py-2 pr-4">{u.name}</td>
                    <td className="py-2 pr-4">{u.email}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4">
                      {new Date(u.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
