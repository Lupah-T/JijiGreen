import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");
const { default: createInitialSuperAdmin } = await import("./utils/createInitialSuperAdmin.js");

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    // Run idempotent bootstrap to create initial super admin if needed
    // This will not modify existing users and will safely skip if ENV vars missing.
    createInitialSuperAdmin()
      .catch((err) => console.error("[bootstrap] Unexpected error:", err))
      .finally(() => {
        app.listen(port, () => console.log(`Server running on port ${port}`));
      });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
