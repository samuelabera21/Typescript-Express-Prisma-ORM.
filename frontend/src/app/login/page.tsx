import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <h1>Welcome Back</h1>
        <p>Login with your verified email to access protected features.</p>
        <LoginForm />
      </section>
    </main>
  );
}