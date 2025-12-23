import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../services/api.js";
import { logout } from "../redux/slices/authSlice.js";
import {
  fetchMyAppointments,
  createAppointment,
  cancelAppointment,
  deleteAppointmentHard,
} from "../redux/slices/appointmentsSlice.js";
import { fetchPrescriptions } from "../redux/slices/prescriptionsSlice.js";

export default function PatientProfile() {
  const dispatch = useDispatch();
  const { items: appointments, loading: apptLoading } = useSelector(
    (s) => s.appointments
  );
  const { items: prescriptions, loading: presLoading } = useSelector(
    (s) => s.prescriptions
  );

  const [doctorId, setDoctorId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    doctorId: "",
    startTime: "",
    endTime: "",
  });
  const [doctors, setDoctors] = useState([]);

  const isoLocalNow = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const HH = pad(d.getHours());
    const MM = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${HH}:${MM}`;
  };

  const validate = () => {
    const errs = { doctorId: "", startTime: "", endTime: "" };
    if (!doctorId)
      errs.doctorId = doctors.length
        ? "Please select a doctor"
        : "Doctor ID is required";
    if (!startTime) errs.startTime = "Start time is required";
    if (!endTime) errs.endTime = "End time is required";
    if (startTime && endTime) {
      const s = new Date(startTime),
        e = new Date(endTime),
        now = new Date();
      if (isNaN(s.getTime())) errs.startTime = "Invalid start time";
      if (isNaN(e.getTime())) errs.endTime = "Invalid end time";
      if (!errs.startTime && !errs.endTime) {
        if (e <= s) errs.endTime = "End must be after start";
        if (s < now) errs.startTime = "Start must be in the future";
      }
    }
    setFieldErrors(errs);
    setFormError("");
    return !errs.doctorId && !errs.startTime && !errs.endTime;
  };

  useEffect(() => {
    dispatch(fetchMyAppointments());
    dispatch(fetchPrescriptions());
    (async () => {
      try {
        const { data } = await api.get("/api/doctors");
        const list = Array.isArray(data) ? data : data?.items || [];
        setDoctors(list);
        if (!doctorId && list.length > 0) setDoctorId(list[0]?._id || "");
      } catch {}
    })();
  }, [dispatch]);

  useEffect(() => {
    const t = setInterval(() => {
      dispatch(fetchPrescriptions());
    }, 20000);
    return () => clearInterval(t);
  }, [dispatch]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await dispatch(
      createAppointment({ doctorId, startTime, endTime, consentGiven })
    );
    if (res.meta.requestStatus === "fulfilled") {
      setDoctorId("");
      setStartTime("");
      setEndTime("");
      setConsentGiven(true);
      setFormSuccess("Appointment requested successfully.");
      setFormError("");
      dispatch(fetchMyAppointments());
    } else {
      setFormError(res.payload?.message || "Failed to create appointment");
      setFormSuccess("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <button className="btn-secondary" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <h2 className="font-semibold">Request Appointment</h2>
          <form className="space-y-3 mt-4" onSubmit={onCreate}>
            {doctors.length > 0 ? (
              <select
                className="input"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                <option value="">Select a doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name || d.fullName || "Doctor"}
                    {d.specialization ? ` — ${d.specialization}` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="input"
                placeholder="Doctor ID"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
            )}
            {fieldErrors.doctorId && (
              <p className="text-xs text-red-600">{fieldErrors.doctorId}</p>
            )}
            <label className="text-xs text-gray-600">Start Time</label>
            <input
              className="input"
              type="datetime-local"
              min={isoLocalNow()}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            {fieldErrors.startTime && (
              <p className="text-xs text-red-600">{fieldErrors.startTime}</p>
            )}
            <label className="text-xs text-gray-600">End Time</label>
            <input
              className="input"
              type="datetime-local"
              min={startTime || isoLocalNow()}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            {fieldErrors.endTime && (
              <p className="text-xs text-red-600">{fieldErrors.endTime}</p>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
              />{" "}
              Consent Given
            </label>
            {formError && <p className="text-xs text-red-600">{formError}</p>}
            {formSuccess && (
              <p className="text-xs text-green-700">{formSuccess}</p>
            )}
            <button
              className="btn-primary"
              disabled={
                !!(
                  fieldErrors.doctorId ||
                  fieldErrors.startTime ||
                  fieldErrors.endTime
                )
              }
            >
              Create
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Note: Choose a doctor from the list or enter a valid ID.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">My Appointments</h2>
            <button
              className="btn-secondary !px-3 !py-1"
              onClick={() => dispatch(fetchMyAppointments())}
            >
              Refresh
            </button>
          </div>
          {apptLoading ? (
            <div className="space-y-3 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg shimmer animate-shimmer"
                ></div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-gray-600 mt-3">
              You have no appointments yet.
            </p>
          ) : (
            <ul className="mt-3 divide-y">
              {appointments.map((a) => (
                <li
                  key={a._id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm">
                      Doctor:{" "}
                      <span className="font-medium">
                        {typeof a.doctorId === "object" && a.doctorId?.name
                          ? a.doctorId.name
                          : String(a.doctorId).slice(-6)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(a.startTime).toLocaleString()} →{" "}
                      {new Date(a.endTime).toLocaleString()}
                    </p>
                    <p className="text-xs">
                      Status:{" "}
                      <span
                        className={`px-2 py-0.5 ml-1 rounded border ${
                          a.status === "completed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : a.status === "cancelled"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {a.status || "scheduled"}
                      </span>
                    </p>
                    <p className="text-xs">
                      Room: <span className="font-mono">{a.roomId}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.status !== "cancelled" && (
                      <button
                        className="btn-secondary"
                        onClick={() => dispatch(cancelAppointment(a._id))}
                      >
                        Cancel
                      </button>
                    )}
                    {a.status === "cancelled" && (
                      <button
                        className="btn-secondary"
                        onClick={() => dispatch(deleteAppointmentHard(a._id))}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">My Prescriptions</h2>
          <button
            className="btn-secondary !px-3 !py-1"
            onClick={() => dispatch(fetchPrescriptions())}
          >
            Refresh
          </button>
        </div>
        {presLoading ? (
          <p className="text-sm text-gray-500 mt-2">Loading…</p>
        ) : (
          <ul className="mt-3 grid md:grid-cols-2 gap-3">
            {prescriptions.map((p) => (
              <li key={p._id} className="p-3 border rounded-lg">
                <p className="text-sm">
                  Appointment:{" "}
                  <span className="font-mono">
                    {typeof p.appointmentId === "object" &&
                    p.appointmentId?.startTime
                      ? new Date(p.appointmentId.startTime).toLocaleString()
                      : String(p.appointmentId).slice(-6)}
                  </span>
                </p>
                <p className="text-sm">
                  Doctor:{" "}
                  <span className="font-medium">
                    {typeof p.doctorId === "object" && p.doctorId?.name
                      ? p.doctorId.name
                      : String(p.doctorId).slice(-6)}
                  </span>
                </p>
                <ul className="mt-2 text-xs list-disc list-inside text-gray-700">
                  {p.items?.map((it, idx) => (
                    <li key={idx}>
                      {it.name} – {it.dosage}
                      {it.frequency ? ` • ${it.frequency}` : ""}
                      {it.duration ? ` • ${it.duration}` : ""}
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
