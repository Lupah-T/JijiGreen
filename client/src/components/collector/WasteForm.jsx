import { Save } from "lucide-react";

export default function WasteForm() {
  return (
    <form className="panel form">
      <input className="input" name="student" placeholder="Student ID" />
      <input className="input" name="wasteType" placeholder="Waste type" />
      <input className="input" name="weightKg" placeholder="Weight in kg" type="number" min="0" step="0.1" />
      <button className="button" type="submit">
        <Save size={18} />
        Save
      </button>
    </form>
  );
}
