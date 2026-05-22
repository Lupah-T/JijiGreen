import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "admin_creation",
        "collector_application",
        "collector_approval",
        "collector_rejection",
        "role_update",
        "privilege_change",
        "account_deactivation",
      ],
      index: true,
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    previousRole: {
      type: String,
      enum: ["student", "collector", "school_admin", "operations_admin", "super_admin", null],
      default: null,
    },
    newRole: {
      type: String,
      enum: ["student", "collector", "school_admin", "operations_admin", "super_admin", null],
      default: null,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
