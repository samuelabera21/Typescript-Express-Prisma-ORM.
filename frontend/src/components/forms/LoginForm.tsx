"use client";

import { useState } from "react";
import { loginUser, resendVerificationEmail } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  const unverifiedEmail =
    error.toLowerCase().includes("verify your email") ||
    error.toLowerCase().includes("not verified");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await loginUser({ email, password });

      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Enter your email first to resend verification.");
      return;
    }

    setResending(true);
    setMessage("");

    try {
      const result = (await resendVerificationEmail(email)) as {
        message?: string;
        verificationUrl?: string;
      };

      setMessage(result.message || "Verification email resent. Please check your inbox.");

      if (result.verificationUrl) {
        setMessage(`${result.message} Open link: ${result.verificationUrl}`);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to resend verification";
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>

      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-success">{message}</p>}

      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {unverifiedEmail && (
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending}
        >
          {resending ? "Sending verification..." : "Resend Verification Email"}
        </button>
      )}

      <p>
        Need to verify manually? <a href="/verify-email">Open Verify Page</a>
      </p>
    </form>
  );
}