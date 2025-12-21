import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

export default function AgentDashboard() {
  const dispatch = useDispatch();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Agent Dashboard</h1>
      <p>Register patients, record vitals, upload reports.</p>
      <button
        className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </div>
  );
}
