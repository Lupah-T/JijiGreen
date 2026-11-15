import { useEffect, useMemo, useState } from "react";
import { LocateFixed, MapPin, Navigation, Recycle, Search, Users } from "lucide-react";
import { getCollectionPoints } from "../../api/collectionPointApi.js";

const NAIROBI = { lat: -1.2864, lng: 36.8172 };

export default function StudentCollectionPoints() {
  const [points, setPoints] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(NAIROBI);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return points.filter((point) =>
      point.name.toLowerCase().includes(q) ||
      point.county.toLowerCase().includes(q) ||
      point.address.toLowerCase().includes(q) ||
      point.acceptedWasteTypes?.some((type) => type.includes(q))
    );
  }, [points, query]);

  const load = (coords = location) => {
    getCollectionPoints(coords)
      .then(({ data }) => setPoints(data.data || []))
      .catch(() => setPoints([]));
  };

  useEffect(() => {
    load();
  }, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(coords);
        load(coords);
        setMessage("Showing collection points nearest to your current location.");
      },
      () => setMessage("Could not access location. Showing Nairobi collection points.")
    );
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Nearby Collection Points</h1>
          <p className="page-subtitle">Find verified places to submit recyclable waste and earn eco-points.</p>
        </div>
        <button className="btn btn-primary" onClick={useCurrentLocation}><LocateFixed size={15} /> Use my location</button>
      </div>

      {message ? <div className="alert alert-success">{message}</div> : null}

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">Map view</span>
            <span className="badge badge-green">{filtered.length} active</span>
          </div>
          <div className="map-preview" style={{ minHeight: 420 }}>
            {filtered.slice(0, 10).map((point, index) => (
              <div
                key={point._id}
                className="map-pin active"
                style={{ left: `${14 + (index * 19) % 72}%`, top: `${16 + (index * 29) % 66}%` }}
                title={point.name}
              >
                <MapPin size={16} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-header"><span className="section-title">Drop-off locations</span></div>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input className="input" placeholder="Search by county, material, or place..." value={query} onChange={(event) => setQuery(event.target.value)} style={{ paddingLeft: 40 }} />
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((point) => (
              <article className="collection-point-row" key={point._id}>
                <div>
                  <div style={{ fontWeight: 900 }}>{point.name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{point.address}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {(point.acceptedWasteTypes || []).map((type) => <span className="badge badge-gray" key={type}><Recycle size={11} /> {type.replace("_", "-")}</span>)}
                  </div>
                  {point.assignedCollectors?.length ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-soft)", fontSize: 12, marginTop: 8 }}>
                      <Users size={13} /> {point.assignedCollectors.length} verified collector{point.assignedCollectors.length === 1 ? "" : "s"}
                    </div>
                  ) : null}
                </div>
                <div style={{ textAlign: "right", minWidth: 84 }}>
                  <span className="badge badge-green">Open</span>
                  <div style={{ color: "var(--g-700)", fontWeight: 900, marginTop: 10 }}>{point.distanceKm ?? "--"} km</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${point.coordinates?.lat},${point.coordinates?.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 10 }}
                  >
                    <Navigation size={12} /> Directions
                  </a>
                </div>
              </article>
            ))}
            {!filtered.length ? <div className="empty-state"><div className="empty-state-title">No matching collection points</div><div className="empty-state-sub">Try another county, material type, or refresh your location.</div></div> : null}
          </div>
        </div>
      </div>
    </>
  );
}
