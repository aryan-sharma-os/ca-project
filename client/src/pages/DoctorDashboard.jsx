import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../redux/slices/authSlice.js";
import {
  fetchMyAppointments,
  updateAppointment,
} from "../redux/slices/appointmentsSlice.js";
import {
  fetchPrescriptions,
  createPrescription,
} from "../redux/slices/prescriptionsSlice.js";

export default function DoctorDashboard() {
  const dispatch = useDispatch();
  const { items: appointments, loading: apptLoading } = useSelector(
    (s) => s.appointments
  );
  const { items: prescriptions, loading: presLoading } = useSelector(
    (s) => s.prescriptions
  );
  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [items, setItems] = useState([{ name: "", dose: "" }]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchMyAppointments());
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const completeAppointment = (id) => {
    dispatch(updateAppointment({ id, data: { status: "completed" } }));
  };

  const onCreatePrescription = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      createPrescription({ appointmentId, patientId, items, notes })
    );
    if (res.meta.requestStatus === "fulfilled") {
      setAppointmentId("");
      setPatientId("");
      setItems([{ name: "", dose: "" }]);
      setNotes("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
        <button className="btn-secondary" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <h2 className="font-semibold">My Appointments</h2>
          {apptLoading ? (
            <p className="text-sm text-gray-500 mt-2">Loading…</p>
          ) : (
            <ul className="mt-3 divide-y">
              {appointments.map((a) => (
                <li key={a._id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        Patient:{" "}
                        <span className="font-mono">{a.patientId}</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(a.startTime).toLocaleString()} →{" "}
                        {new Date(a.endTime).toLocaleString()}
                      </p>
                      <p className="text-xs">
                        Status:{" "}
                        <span className="font-medium">
                          {a.status || "scheduled"}
                        </span>
                      </p>
                      <p className="text-xs">
                        Room: <span className="font-mono">{a.roomId}</span>
                      </p>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => completeAppointment(a._id)}
                    >
                      Mark Completed
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Create Prescription</h2>
          <form className="space-y-3 mt-4" onSubmit={onCreatePrescription}>
            <input
              className="input"
              placeholder="Appointment ID"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            />
            <input
              className="input"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input
                    className="input"
                    placeholder="Medicine"
                    value={it.name}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setItems(next);
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Dose"
                    value={it.dose}
                    onChange={(e) => {
                      const next = [...items];
                      next[idx] = { ...next[idx], dose: e.target.value };
                      setItems(next);
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setItems([...items, { name: "", dose: "" }])}
              >
                Add Item
              </button>
            </div>
            <textarea
              className="input"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button className="btn-primary">Create Prescription</button>
          </form>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-semibold">My Prescriptions</h2>
        {presLoading ? (
          <p className="text-sm text-gray-500 mt-2">Loading…</p>
        ) : (
          <ul className="mt-3 grid md:grid-cols-2 gap-3">
            {prescriptions.map((p) => (
              <li key={p._id} className="p-3 border rounded-lg">
                <p className="text-sm">
                  Appointment:{" "}
                  <span className="font-mono">{p.appointmentId}</span>
                </p>
                <p className="text-sm">
                  Patient: <span className="font-mono">{p.patientId}</span>
                </p>
                <ul className="mt-2 text-xs list-disc list-inside text-gray-700">
                  {p.items?.map((it, idx) => (
                    <li key={idx}>
                      {it.name} – {it.dose}
                    </li>
                  ))}
                </ul>
                {p.pdfUrl && (
                  <a
                    className="btn-secondary mt-2 inline-block"
                    href={p.pdfUrl}
                    target="_blank"
                  >
                    View PDF
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
