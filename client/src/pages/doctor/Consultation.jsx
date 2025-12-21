import { useState } from "react";
import api from "../../services/api.js";

export default function DoctorConsultationPage() {
  const [appointmentId, setAppointmentId] = useState("");
  const [notes, setNotes] = useState("");
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(null);

  const start = async () => {
    try {
      setError(null);
      const res = await api.post("/api/chat/start", { appointmentId });
      setRoomId(res.data.roomId || "");
    } catch (e) {
      setError("Failed to start consultation");
    }
  };

  const saveNotes = async () => {
    try {
      setError(null);
      await api.post("/api/chat/notes", { appointmentId, notes });
    } catch (e) {
      setError("Failed to save notes");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Consultation</h1>
      <div className="card p-6 space-y-3">
        <input
          className="input"
          placeholder="Appointment ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={start}>
            Start
          </button>
          {roomId && (
            <span className="text-sm">
              Room ID: <span className="font-mono">{roomId}</span>
            </span>
          )}
        </div>
        <textarea
          className="input"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button className="btn-secondary" onClick={saveNotes}>
          Save Notes
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
