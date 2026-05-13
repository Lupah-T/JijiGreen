export default function ForgotPassword() {
  return (
    <form className="panel auth-card">
      <h1>Reset password</h1>
      <input className="input" placeholder="Email" />
      <button className="button" type="submit">Send reset link</button>
    </form>
  );
}
