import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Recycle,
  Scale,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  analyzeWasteImage,
  submitWaste,
} from "../../api/collectorApi.js";

const MATERIALS = [
  { value: "plastic", label: "Plastic", emoji: "🧴" },
  { value: "glass", label: "Glass", emoji: "🫙" },
  { value: "metal", label: "Metal", emoji: "🥫" },
  { value: "paper", label: "Paper", emoji: "📄" },
  { value: "cardboard", label: "Cardboard", emoji: "📦" },
  { value: "other", label: "Other / Mixed", emoji: "♻️" },
];

const normalizeMaterial = (value) => {
  const material = String(value || "").toLowerCase().trim();
  if (material === "trash") return "other";
  return MATERIALS.some((item) => item.value === material)
    ? material
    : "";
};

export default function WasteForm({ collectionPoints = [], onSubmitted }) {
  const [student, setStudent] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [material, setMaterial] = useState("plastic");
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isBottle, setIsBottle] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collectionPoint, setCollectionPoint] = useState("");

  const materialResult = analysis?.material;
  const brandResult = analysis?.brand_recognition?.result;
  const predictedMaterial = normalizeMaterial(
    materialResult?.predicted_material ??
    materialResult?.material ??
    materialResult?.prediction
  );

  const handleImage = (file) => {
    setError("");
    setAnalysis(null);
    setImage(null);
    setPreview("");

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Choose a JPG or PNG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Upload a waste image before requesting AI analysis.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setAnalysis(null);

    try {
      const payload = new FormData();
      payload.append("image", image);
      payload.append("isBottle", String(isBottle));

      const response = await analyzeWasteImage(payload);
      const result = response.data;

      if (!result?.success || !result?.material) {
        throw new Error(result?.message || "The AI service returned no material prediction.");
      }

      setAnalysis(result);

      const predicted = normalizeMaterial(
        result.material.predicted_material ??
        result.material.material ??
        result.material.prediction
      );

      if (predicted) setMaterial(predicted);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Image analysis failed. You can still select the material manually."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!student.trim() || !weightKg || Number(weightKg) < 0.1) {
      setError("Enter a valid student ID, a collection point, and a weight of at least 0.1 kg.");
      return;
    }

    if (!collectionPoint) {
      setError("Select the collection point for this submission.");
      return;
    }

    if (!image) {
      setError("An image is required for this collection submission.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("student", student.trim());
      payload.append("wasteType", material);
      payload.append("materialCategory", material);
      payload.append("weightKg", weightKg);
      payload.append("image", image);

      if (brandName.trim()) {
        payload.append("brandName", brandName.trim());
      }

      if (analysis?.material) {
        payload.append(
          "aiMaterialPrediction",
          JSON.stringify(analysis.material)
        );
      }

      if (analysis?.brand_recognition?.result) {
        payload.append(
          "aiBrandPrediction",
          JSON.stringify(analysis.brand_recognition.result)
        );
      }

      payload.append("collectionPoint", collectionPoint);

      const response = await submitWaste(payload);

      setSuccess(
        response.data?.message ||
        "Submission recorded and awaiting verification."
      );

      setStudent("");
      setWeightKg("");
      setMaterial("plastic");
      setBrandName("");
      setImage(null);
      setAnalysis(null);
      setPreview("");
      setIsBottle(false);
      setCollectionPoint("");

      onSubmitted?.(response.data?.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to submit this collection. Check the student ID and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="section-header">
        <span className="section-title">Log New Submission</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <div className="field">
          <label className="field-label" htmlFor="collector-student">
            Student ID / QR value
          </label>
          <input
            id="collector-student"
            className="input"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            placeholder="Enter the student's account ID"
            required
          />
          <small style={{ color: "var(--text-muted)" }}>
            Enter the student's account ID. Camera-based QR scanning is not
            connected yet.
          </small>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="waste-image">
            Waste photograph
          </label>
          <label
            htmlFor="waste-image"
            style={{
              border: "1.5px dashed var(--border-g)",
              borderRadius: "var(--r-md)",
              padding: 16,
              display: "grid",
              justifyItems: "center",
              gap: 8,
              cursor: "pointer",
              background: "var(--g-50)",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Waste submission preview"
                style={{
                  maxHeight: 180,
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: 10,
                }}
              />
            ) : (
              <>
                <ImagePlus size={30} color="var(--g-700)" />
                <span style={{ fontWeight: 600 }}>Choose waste image</span>
                <small style={{ color: "var(--text-muted)" }}>
                  JPG or PNG · Maximum 5 MB
                </small>
              </>
            )}
          </label>
          <input
            id="waste-image"
            type="file"
            accept="image/jpeg,image/png"
            capture="environment"
            onChange={(event) => handleImage(event.target.files?.[0])}
            style={{ display: "none" }}
          />
          {image && (
            <button
              type="button"
              className="btn btn-sm"
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{ justifyContent: "center" }}
            >
              {analyzing ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Sparkles size={15} />
              )}
              {analyzing ? "Analyzing image..." : "Analyze with JijiGreen AI"}
            </button>
          )}
        </div>

        <label
          style={{
            display: "flex",
            gap: 9,
            alignItems: "center",
            fontSize: 13,
          }}
        >
          <input
            type="checkbox"
            checked={isBottle}
            onChange={(event) => {
              setIsBottle(event.target.checked);
              setAnalysis(null);
            }}
          />
          This item is a bottle/container (enables experimental brand recognition)
        </label>

        {analysis && (
          <div
            style={{
              padding: 13,
              borderRadius: "var(--r-md)",
              border: "1px solid var(--g-200)",
              background: "var(--g-50)",
              display: "grid",
              gap: 7,
              fontSize: 13,
            }}
          >
            <strong>
              <Sparkles size={14} style={{ verticalAlign: "middle" }} /> AI
              material prediction
            </strong>
            <div>
              Prediction:{" "}
              <strong>
                {materialResult?.predicted_material ||
                  materialResult?.material ||
                  "Not available"}
              </strong>
            </div>
            <div>
              Confidence:{" "}
              {typeof materialResult?.confidence === "number"
                ? `${(materialResult.confidence * 100).toFixed(1)}%`
                : "Not provided"}
            </div>
            <small style={{ color: "var(--text-muted)" }}>
              AI output is advisory. Review the image and select the correct
              material below.
            </small>

            {brandResult && (
              <div style={{ borderTop: "1px solid var(--g-200)", paddingTop: 8 }}>
                <strong>Experimental brand suggestion</strong>
                <div>
                  {brandResult.predicted_brand ||
                    brandResult.brand ||
                    "Brand prediction available"}
                </div>
                <small style={{ color: "var(--text-muted)" }}>
                  Brand recognition is experimental. Do not treat this result
                  as confirmed without checking the physical item.
                </small>
              </div>
            )}
          </div>
        )}

        <div className="field">
          <span className="field-label">Confirm material</span>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
              gap: 8,
            }}
          >
            {MATERIALS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setMaterial(item.value)}
                style={{
                  border:
                    material === item.value
                      ? "2px solid var(--g-600)"
                      : "1px solid var(--border)",
                  background:
                    material === item.value ? "var(--g-50)" : "white",
                  borderRadius: "var(--r-md)",
                  padding: 10,
                  textAlign: "left",
                  cursor: "pointer",
                  color: "var(--text-main)",
                }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="collector-weight">
            Measured weight (kg)
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="collector-weight"
              className="input"
              type="number"
              min="0.1"
              step="0.1"
              value={weightKg}
              onChange={(event) => setWeightKg(event.target.value)}
              placeholder="0.0"
              required
              style={{ paddingRight: 42 }}
            />
            <Scale
              size={16}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-soft)",
              }}
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="collector-brand">
            Confirmed brand (optional)
          </label>
          <input
            id="collector-brand"
            className="input"
            value={brandName}
            onChange={(event) => setBrandName(event.target.value)}
            placeholder="Enter only after checking the item"
          />
          <small style={{ color: "var(--text-muted)" }}>
            A predicted brand is not automatically saved as a confirmed brand.
          </small>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="collector-location">
            Collection point
          </label>
          <select
            id="collector-location"
            className="input"
            value={collectionPoint}
            onChange={(event) => setCollectionPoint(event.target.value)}
            required
          >
            <option value="">Select a collection point</option>
            {collectionPoints.map((point) => (
              <option key={point._id} value={point._id}>
                {point.name}{point.county ? ` — ${point.county}` : ""}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="alert" style={{ color: "#b91c1c" }}>
            <AlertCircle size={15} style={{ verticalAlign: "middle" }} />{" "}
            {error}
          </div>
        )}

        {success && (
          <div className="alert success">
            <CheckCircle2 size={15} style={{ verticalAlign: "middle" }} />{" "}
            {success}
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Eco-points are awarded only after verification.
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitting || analyzing}
          style={{ justifyContent: "center", padding: 12 }}
        >
          {submitting ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {submitting ? "Submitting..." : "Submit for verification"}
        </button>
      </form>
    </div>
  );
}
