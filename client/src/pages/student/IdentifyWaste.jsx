import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, ImagePlus, LoaderCircle, MapPin, Search, Sparkles, Star, Video, ExternalLink, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { analyzeWasteImage, getCollectionPointRecommendations, getDIYRecommendations } from "../../api/aiApi.js";

const MATERIALS = ["cardboard", "glass", "metal", "paper", "plastic", "trash"];
const DEFAULT_CENTER = { lat: -1.2864, lng: 36.8172 };

const DIY_FALLBACK = {
  plastic: [
    {
      title: "PET Bottle Planter",
      material: "plastic",
      description: "Turn a clean PET bottle into a small self-watering planter for herbs or flowers.",
      purpose: "Growing seedlings or small kitchen herbs indoors.",
      materials: ["Clean PET bottle", "Soil", "Seeds or a seedling", "Pebbles or gravel"],
      tools: ["Scissors", "Marker", "Ruler", "String or tape"],
      difficulty: "Easy",
      estimated_time: "20-30 minutes",
      instructions: [
        "Wash and dry the plastic bottle thoroughly.",
        "Use a marker to draw a cutting line near the middle of the bottle.",
        "Cut the bottle carefully and smooth the cut edge with sandpaper or tape where needed.",
        "Add a few pebbles at the bottom for drainage and fill with soil.",
        "Plant the seedling, water lightly, and place it in a well-lit area."
      ],
      safety_warnings: [
        "Use adult support when cutting plastic.",
        "Do not use bottles that previously held chemical products.",
        "Keep the project away from direct hot sun until the soil settles."
      ],
      video: {
        title: "How to Make a Plastic Bottle Planter",
        url: "https://www.youtube.com/results?search_query=DIY+Plastic+Bottle+Planter",
        platform: "YouTube",
        channel: "DIY Garden"
      },
      verification_status: "reviewed"
    },
    {
      title: "Plastic Bottle Desk Organiser",
      material: "plastic",
      description: "Reuse a PET bottle as a compact stationery organiser for pens and clips.",
      purpose: "Organising school stationery and office tools.",
      materials: ["Empty plastic bottle", "Decorative paper", "Glue", "Paint or markers"],
      tools: ["Scissors", "Glue stick", "Marker", "Ruler"],
      difficulty: "Easy",
      estimated_time: "20 minutes",
      instructions: [
        "Trim the bottle to the desired height.",
        "Decorate the outside with paper, paint, or labels.",
        "Add small compartments by cutting narrow slots in the upper section.",
        "Use the organiser for pens, clips, or erasers."
      ],
      safety_warnings: [
        "Smooth any sharp edges before use.",
        "Do not cut bottles that still contain residue or chemicals.",
        "Keep the project for dry storage only."
      ],
      video: {
        title: "DIY Plastic Bottle Organizer",
        url: "https://www.youtube.com/results?search_query=DIY+Plastic+Bottle+Organizer",
        platform: "YouTube",
        channel: "HobbySpots"
      },
      verification_status: "reviewed"
    }
  ],
  cardboard: [
    {
      title: "Cardboard Desk Organiser",
      material: "cardboard",
      description: "Use a sturdy box to build a simple organiser for notebooks, clips and stationery.",
      purpose: "Keeping study materials tidy on a desk or shelf.",
      materials: ["Strong cardboard box", "Glue or tape", "Ruler", "Decorative paper"],
      tools: ["Scissors", "Marker", "Cutting mat"],
      difficulty: "Easy",
      estimated_time: "30-40 minutes",
      instructions: [
        "Measure the box and mark sections for trays or slots.",
        "Cut panels to create compartments for pens, folders and notebooks.",
        "Glue the panels together and reinforce the joints.",
        "Decorate the organiser with paper or paint and let it dry."
      ],
      safety_warnings: [
        "Keep the organiser away from damp areas.",
        "Use blunt scissors or adult supervision for cutting.",
        "Do not use heavily wet or contaminated cardboard."
      ],
      video: {
        title: "DIY Cardboard Organizer Tutorial",
        url: "https://www.youtube.com/results?search_query=DIY+Cardboard+Organizer+Tutorial",
        platform: "YouTube",
        channel: "Crafty Panda"
      },
      verification_status: "reviewed"
    },
    {
      title: "Cardboard Storage Box",
      material: "cardboard",
      description: "Reuse a cereal or shipping box to create a compact storage case for notes and accessories.",
      purpose: "Storing notebooks, cords or small classroom materials.",
      materials: ["Reusable cardboard box", "Glue", "Paper tape", "Decorative wrapping paper"],
      tools: ["Scissors", "Ruler", "Marker"],
      difficulty: "Easy",
      estimated_time: "25 minutes",
      instructions: [
        "Flatten the box and draw the box layout.",
        "Cut the sides and fold the flaps to form a case.",
        "Tape or glue the seams and reinforce edges.",
        "Cover the outside with paper for durability and appearance."
      ],
      safety_warnings: [
        "Avoid use if the box is damaged by moisture.",
        "Do not store sharp or heavy objects without reinforcement.",
        "If used for files, keep it out of direct rain."
      ],
      video: {
        title: "Simple Cardboard Storage Box DIY",
        url: "https://www.youtube.com/results?search_query=Simple+Cardboard+Storage+Box+DIY",
        platform: "YouTube",
        channel: "DIY for Home"
      },
      verification_status: "reviewed"
    }
  ],
  paper: [
    {
      title: "Handmade Recycled Paper Sheets",
      material: "paper",
      description: "Turn clean scrap paper into handmade sheets for notes, cards and craft projects.",
      purpose: "Creating recycled paper for writing, wrapping or decorations.",
      materials: ["Clean scrap paper", "Water", "Blender or bowl", "Mesh screen", "Sponge"],
      tools: ["Container", "Sponge", "Towel", "Frame or mesh"],
      difficulty: "Medium",
      estimated_time: "60 minutes",
      instructions: [
        "Tear the paper into small pieces and soak it in warm water.",
        "Blend or mash the paper into a pulp until smooth.",
        "Pour the pulp onto a mesh screen and spread evenly.",
        "Press out excess water with a sponge and allow it to dry.",
        "Once dry, peel the paper and use it for cards or craft projects."
      ],
      safety_warnings: [
        "Use only clean paper without glossy or oily coatings.",
        "Avoid mixing in torn plastic or heavy adhesives.",
        "Allow the paper to dry fully before writing or packaging."
      ],
      video: {
        title: "Make Recycled Paper at Home",
        url: "https://www.youtube.com/results?search_query=Make+Recycled+Paper+at+Home",
        platform: "YouTube",
        channel: "MightyOwl"
      },
      verification_status: "reviewed"
    },
    {
      title: "Paper Gift Bags",
      material: "paper",
      description: "Fold colourful paper into small gift bags for small items or school gifts.",
      purpose: "Wrapping presents or storing small items neatly.",
      materials: ["Paper sheets", "Scissors", "Glue or tape", "Ribbon"],
      tools: ["Ruler", "Scissors", "Glue stick"],
      difficulty: "Easy",
      estimated_time: "20 minutes",
      instructions: [
        "Cut a rectangular sheet to the desired size.",
        "Fold the bottom and side flaps to create a bag shape.",
        "Glue or tape the edges securely.",
        "Add a handle or ribbon for decoration."
      ],
      safety_warnings: [
        "Do not use paper that has been contaminated with food residue.",
        "Keep glue and scissors away from young children.",
        "Avoid heavy items that may rip the bag."
      ],
      video: {
        title: "DIY Handmade Paper Gift Bag",
        url: "https://www.youtube.com/results?search_query=DIY+Handmade+Paper+Gift+Bag",
        platform: "YouTube",
        channel: "Tradition and Craft"
      },
      verification_status: "reviewed"
    }
  ],
  glass: [
    {
      title: "Decorative Glass Vase",
      material: "glass",
      description: "Reuse a clean glass bottle as a decorative vase or small flower holder.",
      purpose: "Decorating a desk, shelf, or study corner.",
      materials: ["Clean glass bottle", "Paint or string", "Glue"],
      tools: ["Soft cloth", "Brush", "Glue stick"],
      difficulty: "Easy",
      estimated_time: "30 minutes",
      instructions: [
        "Wash the glass bottle thoroughly and dry it completely.",
        "Check the bottle for chips or cracks before decorating.",
        "Wrap or paint the exterior with a safe, dry method.",
        "Add a small flower arrangement or use it as a decorative element."
      ],
      safety_warnings: [
        "Do not cut or drill glass.",
        "Reject cracked or chipped bottles.",
        "Keep decorations and flowers away from direct use for food storage."
      ],
      video: {
        title: "DIY Glass Bottle Vase Decoration",
        url: "https://www.youtube.com/results?search_query=DIY+Glass+Bottle+Vase+Decoration",
        platform: "YouTube",
        channel: "Crafting with Joy"
      },
      verification_status: "reviewed"
    },
    {
      title: "Glass Jar Storage Container",
      material: "glass",
      description: "Convert a clean jar into a reusable container for pens, craft materials, or stationery.",
      purpose: "Sorting small tools and school supplies.",
      materials: ["Clean glass jar", "Paper label", "String or ribbon"],
      tools: ["Soft cloth", "Marker"],
      difficulty: "Easy",
      estimated_time: "15 minutes",
      instructions: [
        "Clean the jar and remove any labels carefully.",
        "Wrap a paper label around the jar or add a decorative ribbon.",
        "Use it to store paper clips, beads, or other dry items."
      ],
      safety_warnings: [
        "Do not reuse jars that once held hazardous substances.",
        "Avoid storing liquids in a decorated jar without checking the seal.",
        "Keep glass away from the edges of tables."
      ],
      video: {
        title: "Repurpose Glass Jars for Storage",
        url: "https://www.youtube.com/results?search_query=Repurpose+Glass+Jars+for+Storage",
        platform: "YouTube",
        channel: "Homebaker"
      },
      verification_status: "reviewed"
    }
  ],
  metal: [
    {
      title: "Tin Can Pencil Holder",
      material: "metal",
      description: "Reuse a clean, safely prepared tin can as a pencil and pen holder.",
      purpose: "Holding pens, sharpeners and scissors at a desk.",
      materials: ["Clean tin can", "Decorative paper", "Glue"],
      tools: ["Sandpaper", "Marker", "Glue stick"],
      difficulty: "Easy",
      estimated_time: "20 minutes",
      instructions: [
        "Wash the tin can and dry it fully.",
        "Smooth any rough edges with sandpaper or use a professionally deburred can.",
        "Wrap or paint the outside and allow it to dry.",
        "Use the can as a pen holder on a desk."
      ],
      safety_warnings: [
        "Never handle sharp metal edges without protection.",
        "Do not use cans that are rusted or contain chemical residue.",
        "Only use a can that has been fully cleaned and checked for sharpness."
      ],
      video: {
        title: "DIY Tin Can Pencil Holder",
        url: "https://www.youtube.com/results?search_query=DIY+Tin+Can+Pencil+Holder",
        platform: "YouTube",
        channel: "DIY by Laura"
      },
      verification_status: "reviewed"
    },
    {
      title: "Metal Can Storage Tin",
      material: "metal",
      description: "Repurpose a cleaned tin can into a small organiser for pens, screws, or craft pieces.",
      purpose: "Storing small study and craft items securely.",
      materials: ["Tin can", "Fabric or paper", "Glue"],
      tools: ["Scissors", "Brush"],
      difficulty: "Easy",
      estimated_time: "25 minutes",
      instructions: [
        "Clean and dry the can thoroughly.",
        "Check the rim is smooth and safe to handle.",
        "Wrap the outside with fabric or paper for decoration.",
        "Use it to store small tools or stationery."
      ],
      safety_warnings: [
        "Never reuse a can with sharp or jagged rims.",
        "Avoid storing food in a decorative metal container unless it is food-safe.",
        "Handle with dry hands to avoid slipping." 
      ],
      video: {
        title: "Tin Can Organizer DIY",
        url: "https://www.youtube.com/results?search_query=Tin+Can+Organizer+DIY",
        platform: "YouTube",
        channel: "The Happy Craft"
      },
      verification_status: "reviewed"
    }
  ]
};

const normalizeMaterial = (value) => {
  const material = String(value || "").trim().toLowerCase();
  if (!material) return "";
  return MATERIALS.includes(material) ? material : "";
};

const userPinIcon = L.divIcon({
  className: "custom-pin user-pin",
  html: "<div class='map-pin user-pin-mark'><span></span></div>",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const collectionPinIcon = L.divIcon({
  className: "custom-pin facility-pin",
  html: "<div class='map-pin facility-pin-mark'><span></span></div>",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const normalizeDIYIdea = (idea = {}) => {
  const makeList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    if (typeof value === "string") {
      return value
        .split(/\n|\r|;|\d+\.\s*/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 12);
    }
    return [String(value)];
  };

  return {
    ...idea,
    material: normalizeMaterial(idea.material) || normalizeMaterial(idea.category) || "plastic",
    purpose: idea.purpose || "Making everyday items more useful and less wasteful.",
    materials: makeList(idea.materials || idea.materials_needed),
    tools: makeList(idea.tools),
    instructions: makeList(idea.instructions || idea.steps),
    safety_warnings: makeList(idea.safety_warnings || idea.safetyWarnings),
    difficulty: idea.difficulty || "Easy",
    estimated_time: idea.estimated_time || idea.estimated_time_minutes || "20-30 minutes",
    verification_status: idea.verification_status || "reviewed",
    video: idea.video || null,
  };
};

const normalizeDIYList = (items = []) => items.map(normalizeDIYIdea);

export default function IdentifyWaste() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [diy, setDiy] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [gpsLocation, setGpsLocation] = useState({ latitude: -1.2864, longitude: 36.8172 });
  const [manualLocation, setManualLocation] = useState("");
  const [locationMode, setLocationMode] = useState("gps");
  const [materialFilter, setMaterialFilter] = useState("all");

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const materialName = useMemo(() => {
    const x = result?.material?.predicted_material || result?.material?.material || "";
    return normalizeMaterial(x) || "unknown";
  }, [result]);

  const displayedDiy = useMemo(() => {
    const base = diy.length ? normalizeDIYList(diy) : normalizeDIYList(DIY_FALLBACK[materialName] || []);
    return materialFilter === "all"
      ? base
      : base.filter((idea) => normalizeMaterial(idea.material) === materialFilter);
  }, [diy, materialFilter, materialName]);

  const handleFileSelection = (selectedFile) => {
    setError("");
    setResult(null);
    setRecommendations([]);
    setDiy([]);
    setSelectedIdea(null);
    if (!selectedFile) return;
    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      setError("Please upload a JPG or PNG image.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const resolveManualLocation = async () => {
    if (!manualLocation.trim()) {
      setError("Enter a city, neighbourhood or address to use the manual fallback.");
      return;
    }

    setError("");
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(manualLocation)}`);
      const payload = await response.json();
      if (!payload?.[0]) {
        throw new Error("No matching location was found.");
      }

      const selected = payload[0];
      const nextLocation = {
        latitude: Number(selected.lat),
        longitude: Number(selected.lon),
      };
      setGpsLocation(nextLocation);
      setLocationMode("manual");
    } catch (err) {
      setError(err.message || "The requested location could not be resolved.");
    }
  };

  const useLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setGpsLocation(nextLocation);
        setLocationMode("gps");
      },
      () => {
        setError("Location permission was not granted. Please use the manual location fallback.");
        setLocationMode("manual");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Upload a waste image before requesting AI analysis.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);
    setRecommendations([]);
    setDiy([]);
    setSelectedIdea(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("isBottle", "false");

      const response = await analyzeWasteImage(formData);
      const payload = response.data;

      if (!payload?.success || !payload?.material) {
        throw new Error(payload?.message || "The AI service did not return a valid prediction.");
      }

      setResult(payload);

      const material = normalizeMaterial(payload.material.predicted_material || payload.material.material);
      if (material) {
        const [recommendationResult, diyResult] = await Promise.all([
          getCollectionPointRecommendations({
            material,
            condition: "good",
            quantityKg: 1,
            latitude: gpsLocation.latitude || DEFAULT_CENTER.lat,
            longitude: gpsLocation.longitude || DEFAULT_CENTER.lng,
          }),
          getDIYRecommendations({ material, audience: "user" }),
        ]);

        const resolvedRecommendations = recommendationResult?.data?.recommendations || recommendationResult?.data?.data || [];
        const rawDIY = diyResult?.data?.recommendations || diyResult?.data?.ideas || diyResult?.data?.data || [];
        const normalizedDIY = normalizeDIYList(rawDIY.length ? rawDIY : (DIY_FALLBACK[material] || []));

        setRecommendations(resolvedRecommendations);
        setDiy(normalizedDIY);
        setMaterialFilter(material);
        if (normalizedDIY.length) setSelectedIdea(normalizedDIY[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "AI analysis failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Identify Waste</h1>
          <p className="page-subtitle">Upload a photo and use JijiAI for advisory material and collection guidance.</p>
        </div>
      </div>

      {error && (
        <div className="alert" style={{ color: "#b91c1c", marginBottom: 16 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">Waste image upload</span>
          </div>

          <label
            htmlFor="waste-upload"
            style={{
              border: "1.5px dashed var(--border-g)",
              borderRadius: "var(--r-md)",
              display: "grid",
              justifyItems: "center",
              gap: 8,
              minHeight: 220,
              padding: 12,
              background: "var(--g-50)",
              cursor: "pointer",
            }}
          >
            {preview ? (
              <img src={preview} alt="Uploaded waste" style={{ maxHeight: 220, maxWidth: "100%", objectFit: "contain" }} />
            ) : (
              <>
                <ImagePlus size={28} color="var(--g-700)" />
                <span style={{ fontWeight: 700 }}>Choose a waste photo</span>
                <small style={{ color: "var(--text-muted)" }}>JPG or PNG · up to 5 MB</small>
              </>
            )}
          </label>
          <input
            id="waste-upload"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            capture="environment"
            onChange={(event) => handleFileSelection(event.target.files?.[0])}
            style={{ display: "none" }}
          />

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()} type="button">
              <Camera size={15} /> Select photo
            </button>
            <button className="btn btn-outline" onClick={useLocation} type="button">
              <MapPin size={15} /> Use my location
            </button>
            {file && (
              <button className="btn btn-primary" onClick={handleAnalyze} type="button" disabled={busy}>
                {busy ? <LoaderCircle size={15} className="animate-spin" /> : <Sparkles size={15} />}
                {busy ? "Analyzing..." : "Analyze waste"}
              </button>
            )}
          </div>

          <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <MapPin size={15} style={{ color: "var(--g-600)" }} />
              <strong>Location</strong>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                className="input"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Search a location or neighbourhood"
                style={{ flex: 1, minWidth: 180 }}
              />
              <button className="btn btn-outline" type="button" onClick={resolveManualLocation}>
                <Search size={15} /> Use place
              </button>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>
              {locationMode === "gps"
                ? `Using GPS: ${gpsLocation.latitude.toFixed(4)}, ${gpsLocation.longitude.toFixed(4)}`
                : `Location fallback: ${manualLocation || "manual input"}`}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">AI result</span>
          </div>

          {!result ? (
            <div className="empty-state">
              <Sparkles size={26} />
              <div className="empty-state-title">No prediction yet</div>
              <div className="empty-state-sub">Upload an image to get a material classification and guidance.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ background: "var(--g-50)", border: "1px solid var(--g-200)", borderRadius: "var(--r-md)", padding: 12 }}>
                <strong>Predicted material:</strong> {result.material?.predicted_material || result.material?.material || "Unavailable"}
              </div>
              <div style={{ background: "var(--g-50)", border: "1px solid var(--g-200)", borderRadius: "var(--r-md)", padding: 12 }}>
                <strong>Confidence:</strong> {typeof result.material?.confidence === "number" ? `${(result.material.confidence * 100).toFixed(1)}%` : "Not provided"}
              </div>
              <div style={{ background: "var(--g-50)", border: "1px solid var(--g-200)", borderRadius: "var(--r-md)", padding: 12 }}>
                <strong>Second-best:</strong> {result.material?.second_best_material || "Not available"}
              </div>
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "var(--r-md)", padding: 12, color: "#9a4f00" }}>
                <strong>Review required:</strong> AI predictions are advisory only and are not official collection confirmation.
              </div>

              {result.brand_recognition?.result && (
                <div style={{ background: "#fdf4ff", border: "1px solid #e9d5ff", borderRadius: "var(--r-md)", padding: 12, color: "#6b21a8" }}>
                  <strong>Experimental brand prediction:</strong> {result.brand_recognition.result.predicted_brand || "Unavailable"}
                  <div style={{ fontSize: 12, marginTop: 6 }}>
                    This is experimental and requires manual inspection before use.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="grid-2" style={{ marginTop: 20 }}>
          <div className="card">
            <div className="section-header">
              <span className="section-title">Collection points near you</span>
            </div>

            <div className="map-shell">
              <MapContainer
                center={[gpsLocation.latitude || DEFAULT_CENTER.lat, gpsLocation.longitude || DEFAULT_CENTER.lng]}
                zoom={12}
                scrollWheelZoom
                style={{ height: 320, width: "100%", borderRadius: 14 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[gpsLocation.latitude || DEFAULT_CENTER.lat, gpsLocation.longitude || DEFAULT_CENTER.lng]} icon={userPinIcon}>
                  <Popup>
                    Your location
                  </Popup>
                </Marker>
                {recommendations.filter((point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude)).map((point, idx) => (
                  <Marker
                    key={`${point.facility_id || point.name || "facility"}-${idx}`}
                    position={[Number(point.latitude), Number(point.longitude)]}
                    icon={collectionPinIcon}
                  >
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <strong>{point.name}</strong><br />
                        <span>{point.location || "Location not provided"}</span><br />
                        <small>{point.distance_km ? `${Number(point.distance_km).toFixed(1)} km away` : "Distance unavailable"}</small><br />
                        <small>{point.accepted_materials?.join(", ") || "Material details unavailable"}</small>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {gpsLocation.latitude && gpsLocation.longitude && (
                  <Circle center={[gpsLocation.latitude, gpsLocation.longitude]} radius={1200} pathOptions={{ color: "#1a8f5c", fillColor: "#8cd2b5", fillOpacity: 0.16 }} />
                )}
              </MapContainer>
            </div>

            {recommendations.length === 0 ? (
              <div className="empty-state" style={{ paddingTop: 16 }}>
                <MapPin size={24} />
                <div className="empty-state-title">No confirmed facility is listed yet</div>
                <div className="empty-state-sub">No suitable verified collection point is currently available for this material in the active dataset. Use the map above to view your location and try a different material or place.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {recommendations.map((item, index) => (
                  <div key={`${item.name || "location"}-${index}`} style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 12 }}>
                    <strong>{item.name}</strong>
                    <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>{item.location || item.facility_type || "Local facility"}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>
                      {item.distance_km ? `${Number(item.distance_km).toFixed(1)} km away` : "Distance unavailable"}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>
                      Accepts: {Array.isArray(item.accepted_materials) ? item.accepted_materials.join(", ") : item.accepted_materials || materialName || "material-specific"}
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {item.website && (
                        <a href={item.website} target="_blank" rel="noreferrer" className="tag tag-active">
                          <ExternalLink size={13} /> Visit site
                        </a>
                      )}
                      {item.contact && (
                        <span className="tag tag-inactive">Contact available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-header">
              <span className="section-title">DIY reuse ideas</span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {(["all", ...MATERIALS.filter((m) => m !== "trash")]).map((option) => (
                <button
                  key={option}
                  className={`tag ${materialFilter === option ? "tag-active" : "tag-inactive"}`}
                  type="button"
                  onClick={() => setMaterialFilter(option)}
                >
                  {option === "all" ? "All" : option}
                </button>
              ))}
            </div>

            {displayedDiy.length === 0 ? (
              <div className="empty-state">
                <Star size={24} />
                <div className="empty-state-title">No DIY suggestions available</div>
                <div className="empty-state-sub">Try another material or check the JijiAI recommendation service later.</div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {displayedDiy.slice(0, 4).map((idea, index) => (
                  <div key={`${idea.title || "idea"}-${index}`} style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <strong>{idea.title || "Reuse idea"}</strong>
                      <span className="tag tag-inactive">{idea.material || materialName}</span>
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>{idea.description || "No description provided."}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                      <span className="tag tag-inactive">{idea.difficulty || "Easy"}</span>
                      <span className="tag tag-inactive">{idea.estimated_time || idea.estimated_time_minutes || "20-30 min"}</span>
                      {idea.verification_status && (
                        <span className="tag tag-inactive">{idea.verification_status}</span>
                      )}
                    </div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button className="btn btn-outline btn-sm" type="button" onClick={() => setSelectedIdea(idea)}>
                        <CheckCircle2 size={13} /> View instructions
                      </button>
                      {idea.video?.url && (
                        <a href={idea.video.url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                          <Video size={13} /> Watch tutorial
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedIdea && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="section-header">
            <span className="section-title">{selectedIdea.title}</span>
            <button className="btn btn-ghost" type="button" onClick={() => setSelectedIdea(null)}>
              <X size={14} /> Close
            </button>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag tag-active">{selectedIdea.material}</span>
              <span className="tag tag-inactive">{selectedIdea.difficulty || "Easy"}</span>
              <span className="tag tag-inactive">{selectedIdea.estimated_time || selectedIdea.estimated_time_minutes || "20-30 minutes"}</span>
              <span className="tag tag-inactive">{selectedIdea.verification_status || "reviewed"}</span>
            </div>

            <div>
              <strong>Description</strong>
              <p style={{ color: "var(--text-muted)", marginTop: 8 }}>{selectedIdea.description}</p>
            </div>

            <div>
              <strong>Purpose</strong>
              <p style={{ color: "var(--text-muted)", marginTop: 8 }}>{selectedIdea.purpose || "Making everyday items more useful and less wasteful."}</p>
            </div>

            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
              <div>
                <strong>Materials required</strong>
                <ul style={{ marginTop: 8, paddingLeft: 18, color: "var(--text-muted)" }}>
                  {(selectedIdea.materials || selectedIdea.materials_needed || []).map((entry, idx) => (
                    <li key={`${entry}-${idx}`}>{entry}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Tools required</strong>
                <ul style={{ marginTop: 8, paddingLeft: 18, color: "var(--text-muted)" }}>
                  {(selectedIdea.tools || []).map((entry, idx) => (
                    <li key={`${entry}-${idx}`}>{entry}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <strong>Step by step</strong>
              <ol style={{ marginTop: 8, paddingLeft: 18, color: "var(--text-muted)" }}>
                {(selectedIdea.instructions || []).map((step, idx) => (
                  <li key={`${step}-${idx}`} style={{ marginBottom: 8 }}>{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <strong>Safety warnings</strong>
              <ul style={{ marginTop: 8, paddingLeft: 18, color: "var(--text-muted)" }}>
                {(selectedIdea.safety_warnings || []).map((warning, idx) => (
                  <li key={`${warning}-${idx}`}>{warning}</li>
                ))}
              </ul>
            </div>

            {selectedIdea.video?.url && (
              <div>
                <strong>Tutorial</strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 8 }}>
                  <a href={selectedIdea.video.url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                    <Video size={13} /> {selectedIdea.video.title || "Watch tutorial"}
                  </a>
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {selectedIdea.video.channel || "Source"} · {selectedIdea.video.platform || "YouTube"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
