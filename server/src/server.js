import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
