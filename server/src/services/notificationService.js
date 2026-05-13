export const sendNotification = async ({ to, subject, message }) => {
  console.log(`Notification queued for ${to}: ${subject} - ${message}`);
  return { delivered: true };
};
