import User from "../models/User.js";

const LOG_PREFIX = "[bootstrap]";

async function createInitialSuperAdmin() {
  try {
    console.log(`${LOG_PREFIX} Starting super admin bootstrap process...`);

    // If any super admin already exists, do nothing.
    const superAdminExists = await User.exists({ role: "super_admin" });
    if (superAdminExists) {
      console.log(`${LOG_PREFIX} Super admin already exists. Skipping bootstrap.`);
      return;
    }

    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn(
        `${LOG_PREFIX} SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set; skipping bootstrap.`
      );
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Basic email validation
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      console.warn(`${LOG_PREFIX} SUPER_ADMIN_EMAIL is not a valid email; skipping bootstrap.`);
      return;
    }

    // If a user with this email already exists, do NOT change their role or password.
    const existingByEmail = await User.findOne({ email: normalizedEmail }).lean().exec();
    if (existingByEmail) {
      if (existingByEmail.role === "super_admin") {
        console.log(
          `${LOG_PREFIX} Super admin already exists with email ${normalizedEmail}. Skipping.`
        );
        return;
      }

      console.warn(
        `${LOG_PREFIX} A user with email ${normalizedEmail} already exists with role '${existingByEmail.role}'. Will not modify or promote this account; skipping bootstrap.`
      );
      return;
    }

    // Password policy check (matches the User model validator)
    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      password.length < 8
    ) {
      console.warn(
        `${LOG_PREFIX} SUPER_ADMIN_PASSWORD does not meet policy (min 8 chars, uppercase, lowercase, number). Skipping bootstrap.`
      );
      return;
    }

    const name = process.env.SUPER_ADMIN_NAME || "Super Admin";

    console.log(`${LOG_PREFIX} Creating initial super admin: ${normalizedEmail}`);

    // Use the Mongoose model save path so schema validation and password
    // hashing (pre-save middleware) run as defined in the project.
    const user = new User({
      name,
      email: normalizedEmail,
      password,
      role: "super_admin",
      isActive: true,
    });

    await user.save();

    console.log(`${LOG_PREFIX} Super admin created: ${normalizedEmail}`);
    console.log(
      `${LOG_PREFIX} Security: consider removing SUPER_ADMIN_PASSWORD from environment variables after initial setup.`
    );
  } catch (error) {
    // Handle duplicate key race conditions gracefully (another instance may have created the admin).
    if (error && error.code === 11000) {
      console.warn(
        `${LOG_PREFIX} Duplicate key error while creating super admin. Another instance may have created it concurrently. Skipping.`
      );
      return;
    }

    console.error(`${LOG_PREFIX} Error during super admin bootstrap:`, error);
  }
}

export default createInitialSuperAdmin;
