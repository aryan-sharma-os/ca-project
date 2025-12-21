import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyAppointments } from "../../redux/slices/appointmentsSlice.js";
import StatsCard from "../../components/StatsCard.jsx";

export default function DoctorDashboardPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.appointments);
  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);
  const todays = items.filter(
    (a) => new Date(a.startTime).toDateString() === new Date().toDateString()
  );
  const pending = items.filter((a) => a.status === "scheduled");
  const completed = items.filter((a) => a.status === "completed");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Doctor Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Appointments" value={todays.length} />
        <StatsCard title="Pending" value={pending.length} />
        <StatsCard title="Completed" value={completed.length} />
        <StatsCard
          title="Patients (unique)"
          value={new Set(items.map((a) => String(a.patientId))).size}
        />
      </div>
    </div>
  );
}
