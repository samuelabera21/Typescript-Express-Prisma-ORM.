import VerifyEmailForm from "@/components/forms/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <h1>Email Verification</h1>
        <p>Complete verification before logging in to your dashboard.</p>
        <VerifyEmailForm />
      </section>
    </main>
  );
}
