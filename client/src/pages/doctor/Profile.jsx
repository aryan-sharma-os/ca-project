import { useEffect, useState } from "react";
import api from "../../services/api.js";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/doctor/profile")
      .then((r) => setProfile(r.data))
      .catch(() => setError("Failed to load"));
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setError(null);
      const {
        specialization,
        qualification,
        experience,
        consultationFee,
        phone,
        address,
      } = profile;
      const res = await api.put("/api/doctor/profile", {
        specialization,
        qualification,
        experience,
        consultationFee,
        phone,
        address,
      });
      setProfile(res.data);
    } catch (e) {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="card p-6 space-y-4">
        <div>
          <label className="text-sm">Specialization</label>
          <input
            className="input mt-1"
            value={profile.specialization || ""}
            onChange={(e) =>
              setProfile({ ...profile, specialization: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm">Qualification</label>
          <input
            className="input mt-1"
            value={profile.qualification || ""}
            onChange={(e) =>
              setProfile({ ...profile, qualification: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Experience (years)</label>
            <input
              type="number"
              className="input mt-1"
              value={profile.experience || 0}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  experience: Number(e.target.value || 0),
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Consultation Fee</label>
            <input
              type="number"
              className="input mt-1"
              value={profile.consultationFee || 0}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  consultationFee: Number(e.target.value || 0),
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Phone</label>
            <input
              className="input mt-1"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm">Address</label>
            <input
              className="input mt-1"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
