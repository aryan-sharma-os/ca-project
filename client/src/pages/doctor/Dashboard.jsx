import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyAppointments,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "../../redux/slices/appointmentsSlice.js";
import api from "../../services/api.js";
import {
  fetchDoctorProfile,
  updateDoctorProfile,
} from "../../redux/slices/doctorSlice.js";
import { createPrescription } from "../../redux/slices/prescriptionsSlice.js";
import StatsCard from "../../components/StatsCard.jsx";

export default function DoctorDashboardPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.appointments);
  const { user } = useSelector((s) => s.auth);
  const { profile } = useSelector((s) => s.doctor || {});
  const [availableToday, setAvailableToday] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);
  const [rxDraft, setRxDraft] = useState({
    appointmentId: "",
    items: [{ name: "", dosage: "", frequency: "", duration: "" }],
    notes: "",
  });
  useEffect(() => {
    dispatch(fetchMyAppointments());
    dispatch(fetchDoctorProfile());
  }, [dispatch]);
  const todayStr = new Date().toDateString();
  const todays = items.filter(
    (a) => new Date(a.startTime).toDateString() === todayStr
  );
  const pending = items.filter((a) => a.status === "requested");
  const completed = items.filter((a) => a.status === "completed");

  const upcomingToday = useMemo(() => {
    return [...todays]
      .filter((a) => a.status === "scheduled")
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);
  }, [todays]);

  useEffect(() => {
    if (!profile) return;
    const dayName = new Date().toLocaleDateString(undefined, {
      weekday: "long",
    });
    const dayEntry = (profile.availability || []).find(
      (d) => d.day === dayName
    );
    setAvailableToday(Boolean(dayEntry && dayEntry.slots?.includes("open")));
  }, [profile]);

  const toggleAvailability = async () => {
    const dayName = new Date().toLocaleDateString(undefined, {
      weekday: "long",
    });
    const avail = [...(profile?.availability || [])];
    const idx = avail.findIndex((d) => d.day === dayName);
    if (availableToday) {
      if (idx >= 0) {
        const slots = (avail[idx].slots || []).filter((s) => s !== "open");
        if (slots.length === 0) avail.splice(idx, 1);
        else avail[idx] = { ...avail[idx], slots };
      }
    } else {
      if (idx >= 0) {
        const slots = new Set(avail[idx].slots || []);
        slots.add("open");
        avail[idx] = { ...avail[idx], slots: Array.from(slots) };
      } else {
        avail.push({ day: dayName, slots: ["open"] });
      }
    }
    await dispatch(updateDoctorProfile({ availability: avail }));
    setAvailableToday(!availableToday);
  };

  const completeAppt = (id) =>
    dispatch(updateAppointment({ id, data: { status: "completed" } }));
  const cancelAppt = (id) => dispatch(cancelAppointment(id));
  const [rescheduleForm, setRescheduleForm] = useState({});
  const submitReschedule = (id) => {
    const f = rescheduleForm[id];
    if (!f?.startTime || !f?.endTime) return;
    dispatch(
      rescheduleAppointment({ id, startTime: f.startTime, endTime: f.endTime })
    );
    setRescheduleForm((p) => ({ ...p, [id]: undefined }));
  };

  const last7 = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - (6 - i));
      return d;
    });
    const counts = days.map((d) => {
      const ds = d.toDateString();
      return items.filter(
        (a) =>
          a.status === "completed" &&
          new Date(a.endTime || a.startTime).toDateString() === ds
      ).length;
    });
    return { days, counts };
  }, [items]);

  function Sparkline({ data, width = 260, height = 60, color = "#4f46e5" }) {
    const max = Math.max(...data, 1);
    const step = width / (data.length - 1 || 1);
    const points = data
      .map((v, i) => {
        const x = i * step;
        const y = height - (v / max) * (height - 6) - 3; // padding
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="animate-fadeIn"
        />
        <polygon
          points={`${points} ${width},${height} 0,${height}`}
          fill="url(#grad)"
          className="animate-fadeIn"
        />
      </svg>
    );
  }

  const IconCal = (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a2 2 0 012 2v13a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h3V2zm13 7H4v10h16V9z"
      />
    </svg>
  );
  const IconClock = (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.41l3.3 1.9-.76 1.3L11 13V6h2v6.41z"
      />
    </svg>
  );
  const IconCheck = (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      />
    </svg>
  );
  const IconUsers = (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11zm0 2c-2.33 0-7 1.17-7 3.5V19h10v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.28 0-.57.02-.86.05 1.05.76 1.86 1.74 1.86 2.95V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      />
    </svg>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="card p-6 relative overflow-hidden animate-fadeIn">
        <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-indigo-100 blur-3xl"></div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Here's a quick overview of your day.
            </p>
          </div>
          <div className="hidden sm:block select-none">
            <div className="h-14 w-14 grid place-items-center rounded-xl bg-indigo-50 text-indigo-600 animate-float">
              🩺
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 animate-slideUp flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Controls</h2>
          <p className="text-xs text-gray-600">
            Toggle availability and create prescriptions fast.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAvailability}
            className={availableToday ? "btn-secondary" : "btn-primary"}
          >
            {availableToday ? "Mark Unavailable Today" : "Mark Available Today"}
          </button>
          <button onClick={() => setShowRxModal(true)} className="btn-primary">
            Create Prescription
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Appointments"
          value={todays.length}
          icon={IconCal}
        />
        <StatsCard title="Pending" value={pending.length} icon={IconClock} />
        <StatsCard
          title="Completed"
          value={completed.length}
          icon={IconCheck}
        />
        <StatsCard
          title="Patients (unique)"
          value={new Set(items.map((a) => String(a.patientId))).size}
          icon={IconUsers}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Upcoming Today</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{todayStr}</span>
              <button
                className="btn-secondary !px-3 !py-1"
                onClick={() => dispatch(fetchMyAppointments())}
              >
                Refresh
              </button>
            </div>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg shimmer animate-shimmer"
                ></div>
              ))}
            </div>
          ) : upcomingToday.length === 0 ? (
            <p className="text-sm text-gray-600">
              No upcoming appointments for today.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcomingToday.map((a) => {
                const dt = new Date(a.startTime);
                return (
                  <li
                    key={a._id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {dt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Patient: {String(a.patientId).slice(-6)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                        Scheduled
                      </span>
                      <button
                        className="btn-secondary text-xs px-2 py-1"
                        onClick={() => completeAppt(a._id)}
                      >
                        Complete
                      </button>
                      <button
                        className="btn-secondary text-xs px-2 py-1"
                        onClick={() => cancelAppt(a._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-4">
            {upcomingToday.map((a) => (
              <div key={a._id} className="flex items-center gap-2 text-xs mb-2">
                <span className="text-gray-600">Reschedule:</span>
                <input
                  type="datetime-local"
                  className="input !w-auto"
                  onChange={(e) =>
                    setRescheduleForm((p) => ({
                      ...p,
                      [a._id]: { ...p[a._id], startTime: e.target.value },
                    }))
                  }
                />
                <input
                  type="datetime-local"
                  className="input !w-auto"
                  onChange={(e) =>
                    setRescheduleForm((p) => ({
                      ...p,
                      [a._id]: { ...p[a._id], endTime: e.target.value },
                    }))
                  }
                />
                <button
                  className="btn-primary !px-3 !py-1"
                  onClick={() => submitReschedule(a._id)}
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Weekly Completions</h2>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <Sparkline data={last7.counts} />
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-600"></span>
            Completed sessions per day
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Appointment Requests</h2>
            <button
              className="btn-secondary !px-3 !py-1"
              onClick={() => dispatch(fetchMyAppointments())}
            >
              Refresh
            </button>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-600">No new requests.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pending
                .slice()
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .map((a) => (
                  <li
                    key={a._id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(a.startTime).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Patient: {String(a.patientId).slice(-6)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn-primary !px-3 !py-1"
                        onClick={async () => {
                          await api.put(`/api/appointments/approve/${a._id}`);
                          dispatch(fetchMyAppointments());
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-secondary !px-3 !py-1"
                        onClick={async () => {
                          await api.put(`/api/appointments/reject/${a._id}`);
                          dispatch(fetchMyAppointments());
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {showRxModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center animate-fadeIn">
          <div className="card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Prescription</h3>
              <button
                className="btn-secondary"
                onClick={() => setShowRxModal(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block text-xs text-gray-600">Appointment</label>
              <select
                className="input"
                value={rxDraft.appointmentId}
                onChange={(e) =>
                  setRxDraft((d) => ({ ...d, appointmentId: e.target.value }))
                }
              >
                <option value="">Select an appointment</option>
                {items
                  .filter((a) => a.status !== "cancelled")
                  .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                  .map((a) => (
                    <option key={a._id} value={a._id}>
                      {new Date(a.startTime).toLocaleString()} •{" "}
                      {String(a.patientId).slice(-6)}
                    </option>
                  ))}
              </select>
              <div className="space-y-2">
                {rxDraft.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <input
                      className="input"
                      placeholder="Name"
                      value={it.name}
                      onChange={(e) => {
                        const items = [...rxDraft.items];
                        items[idx] = { ...items[idx], name: e.target.value };
                        setRxDraft((d) => ({ ...d, items }));
                      }}
                    />
                    <input
                      className="input"
                      placeholder="Dosage"
                      value={it.dosage}
                      onChange={(e) => {
                        const items = [...rxDraft.items];
                        items[idx] = { ...items[idx], dosage: e.target.value };
                        setRxDraft((d) => ({ ...d, items }));
                      }}
                    />
                    <input
                      className="input"
                      placeholder="Frequency"
                      value={it.frequency}
                      onChange={(e) => {
                        const items = [...rxDraft.items];
                        items[idx] = {
                          ...items[idx],
                          frequency: e.target.value,
                        };
                        setRxDraft((d) => ({ ...d, items }));
                      }}
                    />
                    <input
                      className="input"
                      placeholder="Duration"
                      value={it.duration}
                      onChange={(e) => {
                        const items = [...rxDraft.items];
                        items[idx] = {
                          ...items[idx],
                          duration: e.target.value,
                        };
                        setRxDraft((d) => ({ ...d, items }));
                      }}
                    />
                  </div>
                ))}
                <div>
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      setRxDraft((d) => ({
                        ...d,
                        items: [
                          ...d.items,
                          { name: "", dosage: "", frequency: "", duration: "" },
                        ],
                      }))
                    }
                  >
                    Add Item
                  </button>
                </div>
              </div>
              <textarea
                className="input"
                rows={3}
                placeholder="Notes"
                value={rxDraft.notes}
                onChange={(e) =>
                  setRxDraft((d) => ({ ...d, notes: e.target.value }))
                }
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => setShowRxModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const appt = items.find(
                    (x) => x._id === rxDraft.appointmentId
                  );
                  if (!appt) return;
                  dispatch(
                    createPrescription({
                      appointmentId: appt._id,
                      doctorId: appt.doctorId,
                      patientId: appt.patientId,
                      items: rxDraft.items,
                      notes: rxDraft.notes,
                    })
                  );
                  setShowRxModal(false);
                  setRxDraft({
                    appointmentId: "",
                    items: [
                      { name: "", dosage: "", frequency: "", duration: "" },
                    ],
                    notes: "",
                  });
                }}
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
