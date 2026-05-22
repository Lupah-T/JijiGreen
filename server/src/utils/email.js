import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendPasswordResetEmail = async (to, resetLink) => {
  await sgMail.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="background:#16a34a;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Reset Password
      </a>
      <p>This link expires in <strong>15 minutes</strong>.</p>
      <p>If you didn't request this, ignore this email.</p>
    `
  })
}
export const sendPasswordChangedEmail = async (to) => {
  await sgMail.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Password Changed Successfully',
    html: `
      <h2>Password Changed</h2>
      <p>Your JijiGreen password was recently changed.</p>
      <p>If you did not make this change, please contact us immediately.</p>
    `
  })
}