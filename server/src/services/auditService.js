import AuditLog from "../models/AuditLog.js";

export const writeAuditLog = async ({
  action,
  performedBy,
  targetUser,
  previousRole = null,
  newRole = null,
  metadata = {},
}) => {
  return AuditLog.create({
    action,
    performedBy,
    targetUser,
    previousRole,
    newRole,
    metadata,
  });
};
