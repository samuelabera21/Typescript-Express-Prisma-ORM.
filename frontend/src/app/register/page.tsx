import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <h1>Create Account</h1>
        <p>Register first, then verify your email before logging in.</p>
        <RegisterForm />
      </section>
    </main>
  );
}