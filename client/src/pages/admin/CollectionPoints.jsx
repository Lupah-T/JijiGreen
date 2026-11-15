import { useEffect, useMemo, useState } from "react";
import { Building2, MapPin, Plus, Recycle, Users } from "lucide-react";
import {
  createCollectionPoint,
  getAdminCollectionPoints,
  getCollectors,
  updateCollectionPoint,
} from "../../api/adminApi.js";
import { useAuth } from "../../hooks/useAuth.js";

const WASTE_TYPES = ["plastic", "paper", "metal", "glass", "organic", "e_waste"];
const INITIAL_FORM = {
  name: "",
  partnerName: "",
  county: "",
  address: "",
  locationNotes: "",
  coordinates: { lat: "-1.2864", lng: "36.8172" },
  acceptedWasteTypes: ["plastic", "paper", "metal", "glass"],
  assignedCollectors: [],
  status: "active",
};

export default function CollectionPoints() {
  const { user } = useAuth();
  const [points, setPoints] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const activePoints = useMemo(() => points.filter((point) => point.status === "active").length, [points]);
  const canManage = ["super_admin", "operations_admin"].includes(user?.role);

  const load = () => {
    getAdminCollectionPoints().then(({ data }) => setPoints(data.data || [])).catch(() => setPoints([]));
    if (canManage) getCollectors().then(({ data }) => setCollectors(data.data || [])).catch(() => setCollectors([]));
  };

  useEffect(() => {
    load();
  }, [canManage]);

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const setCoordinate = (field) => (event) => {
    setForm((current) => ({ ...current, coordinates: { ...current.coordinates, [field]: event.target.value } }));
  };
  const toggleWaste = (type) => {
    setForm((current) => ({
      ...current,
      acceptedWasteTypes: current.acceptedWasteTypes.includes(type)
        ? current.acceptedWasteTypes.filter((item) => item !== type)
        : [...current.acceptedWasteTypes, type],
    }));
  };
  const toggleCollector = (id) => {
    setForm((current) => ({
      ...current,
      assignedCollectors: current.assignedCollectors.includes(id)
        ? current.assignedCollectors.filter((item) => item !== id)
        : [...current.assignedCollectors, id],
    }));
  };

  const edit = (point) => {
    setEditingId(point._id);
    setForm({
      name: point.name || "",
      partnerName: point.partnerName || "",
      county: point.county || "",
      address: point.address || "",
      locationNotes: point.locationNotes || "",
      coordinates: {
        lat: String(point.coordinates?.lat || ""),
        lng: String(point.coordinates?.lng || ""),
      },
      acceptedWasteTypes: point.acceptedWasteTypes || [],
      assignedCollectors: (point.assignedCollectors || []).map((collector) => collector._id || collector.id || collector),
      status: point.status || "active",
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const payload = {
      ...form,
      coordinates: {
        lat: Number(form.coordinates.lat),
        lng: Number(form.coordinates.lng),
      },
    };

    try {
      if (editingId) {
        await updateCollectionPoint(editingId, payload);
        setMessage("Collection point updated.");
      } else {
        await createCollectionPoint(payload);
        setMessage("Collection point created.");
      }
      setEditingId(null);
      setForm(INITIAL_FORM);
      load();
    } catch (error) {
      setMessage(error.message || "Could not save collection point.");
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Collection Points</h1>
          <p className="page-subtitle">Manage verified drop-off locations, accepted waste types, and assigned collectors.</p>
        </div>
      </div>

      <div className="dash-kpi-row">
        {[
          { label: "Total points", value: points.length, icon: MapPin, bg: "#f0fdf4", color: "var(--g-600)" },
          { label: "Active points", value: activePoints, icon: Building2, bg: "#eff6ff", color: "#2563eb" },
          { label: "Collectors", value: collectors.length, icon: Users, bg: "#fef9c3", color: "#d97706" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-card-header">
              <div><div className="kpi-label">{label}</div><div className="kpi-value" style={{ marginTop: 6 }}>{value}</div></div>
              <div className="kpi-icon" style={{ background: bg }}><Icon size={20} style={{ color }} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {canManage ? <form className="card" onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <div className="section-header">
            <span className="section-title">{editingId ? "Edit collection point" : "Create collection point"}</span>
            <span className="badge badge-green"><Plus size={12} /> Operations</span>
          </div>
          {message ? <div className={message.includes("Could") ? "alert alert-error" : "alert alert-success"}>{message}</div> : null}
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="field"><label className="field-label">Name</label><input className="input" required value={form.name} onChange={set("name")} /></div>
            <div className="field"><label className="field-label">Partner</label><input className="input" value={form.partnerName} onChange={set("partnerName")} /></div>
            <div className="field"><label className="field-label">County</label><input className="input" required value={form.county} onChange={set("county")} /></div>
            <div className="field"><label className="field-label">Status</label><select className="input" value={form.status} onChange={set("status")}><option value="active">Active</option><option value="maintenance">Maintenance</option><option value="inactive">Inactive</option></select></div>
            <div className="field"><label className="field-label">Latitude</label><input className="input" required type="number" step="any" value={form.coordinates.lat} onChange={setCoordinate("lat")} /></div>
            <div className="field"><label className="field-label">Longitude</label><input className="input" required type="number" step="any" value={form.coordinates.lng} onChange={setCoordinate("lng")} /></div>
          </div>
          <div className="field"><label className="field-label">Address</label><input className="input" required value={form.address} onChange={set("address")} /></div>
          <div className="field"><label className="field-label">Location notes</label><textarea className="input" rows={2} value={form.locationNotes} onChange={set("locationNotes")} /></div>
          <div className="field">
            <span className="field-label">Accepted waste</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {WASTE_TYPES.map((type) => <button key={type} type="button" className={`tag ${form.acceptedWasteTypes.includes(type) ? "tag-active" : "tag-inactive"}`} onClick={() => toggleWaste(type)}>{type.replace("_", "-")}</button>)}
            </div>
          </div>
          <div className="field">
            <span className="field-label">Assigned collectors</span>
            <div style={{ display: "grid", gap: 8, maxHeight: 180, overflow: "auto" }}>
              {collectors.map((collector) => (
                <label key={collector._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, border: "1px solid var(--border)", borderRadius: 12 }}>
                  <input type="checkbox" checked={form.assignedCollectors.includes(collector._id)} onChange={() => toggleCollector(collector._id)} />
                  <span style={{ fontWeight: 700 }}>{collector.name}</span>
                  <span style={{ color: "var(--text-soft)", fontSize: 12 }}>{collector.email}</span>
                </label>
              ))}
              {!collectors.length ? <div className="empty-state" style={{ padding: 18 }}><div className="empty-state-sub">No approved collectors yet.</div></div> : null}
            </div>
          </div>
          <button className="btn btn-primary" style={{ justifyContent: "center" }}>{editingId ? "Update collection point" : "Create collection point"}</button>
        </form> : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-title">Read-only collection network</div>
              <div className="empty-state-sub">School admins can view verified points. Operations admins manage assignments and location details.</div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="section-header"><span className="section-title">Network map</span></div>
          <div className="map-preview">
            {points.slice(0, 8).map((point, index) => (
              <button
                key={point._id}
                className={`map-pin ${point.status}`}
                style={{ left: `${15 + (index * 17) % 70}%`, top: `${18 + (index * 23) % 62}%` }}
                title={point.name}
                onClick={() => edit(point)}
              >
                <MapPin size={16} />
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {points.map((point) => (
              <button key={point._id} className="collection-point-row" onClick={() => edit(point)}>
                <div>
                  <div style={{ fontWeight: 900 }}>{point.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{point.county} · {point.address}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {(point.acceptedWasteTypes || []).map((type) => <span className="badge badge-gray" key={type}><Recycle size={11} /> {type}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`badge ${point.status === "active" ? "badge-green" : point.status === "maintenance" ? "badge-amber" : "badge-gray"}`}>{point.status}</span>
                  <div style={{ color: "var(--text-soft)", fontSize: 12, marginTop: 8 }}>{point.assignedCollectors?.length || 0} collectors</div>
                </div>
              </button>
            ))}
            {!points.length ? <div className="empty-state"><div className="empty-state-title">No collection points yet</div><div className="empty-state-sub">Create the first verified drop-off location for your recycling network.</div></div> : null}
          </div>
        </div>
      </div>
    </>
  );
}
