import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyAppointments,
  updateAppointment,
} from "../../redux/slices/appointmentsSlice.js";
import api from "../../services/api.js";
import AppointmentTable from "../../components/AppointmentTable.jsx";

export default function DoctorAppointmentsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.appointments);
  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const approve = async (id) => {
    await api.put(`/api/appointments/approve/${id}`);
    dispatch(fetchMyAppointments());
  };
  const reject = async (id) => {
    await api.put(`/api/appointments/reject/${id}`);
    dispatch(fetchMyAppointments());
  };
  const complete = async (id) => {
    await dispatch(updateAppointment({ id, data: { status: "completed" } }));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Appointments</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <AppointmentTable
          items={items}
          actions={{ approve, reject, complete }}
        />
      )}
    </div>
  );
}
