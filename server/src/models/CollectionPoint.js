import mongoose from "mongoose";

const openingHoursSchema = new mongoose.Schema(
  {
    day: { type: String, required: true, trim: true },
    open: { type: String, required: true, trim: true },
    close: { type: String, required: true, trim: true },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const collectionPointSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, index: true },
    partnerName: { type: String, trim: true },
    county: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    locationNotes: { type: String, trim: true, maxlength: 500 },
    coordinates: {
      lat: { type: Number, required: true, min: -90, max: 90 },
      lng: { type: Number, required: true, min: -180, max: 180 },
    },
    acceptedWasteTypes: {
      type: [String],
      enum: ["plastic", "paper", "metal", "glass", "organic", "e_waste"],
      default: ["plastic", "paper", "metal", "glass"],
    },
    assignedCollectors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    openingHours: {
      type: [openingHoursSchema],
      default: [
        { day: "Mon-Fri", open: "08:00", close: "18:00" },
        { day: "Sat", open: "09:00", close: "15:00" },
      ],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
      index: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

collectionPointSchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });

export default mongoose.model("CollectionPoint", collectionPointSchema);
