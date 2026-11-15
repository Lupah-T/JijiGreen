import dotenv from "dotenv";
import { sendNotification } from "../services/notificationService.js";

dotenv.config();

const to = process.argv[2] || process.env.TEST_EMAIL_TO;
if (!to) {
  console.error("Usage: node src/scripts/sendTestEmail.js recipient@example.com");
  process.exit(1);
}

(async () => {
  console.log("Sending test email to", to);
  const res = await sendNotification({
    to,
    subject: "JijiGreen test email",
    message: "This is a test email from Jijigreen server.",
    html: "<p>This is a test email from Jijigreen server.</p>",
  });
  console.log("Result:", res);
  process.exit(res.delivered ? 0 : 1);
})();
