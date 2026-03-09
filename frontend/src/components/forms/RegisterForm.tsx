"use client";

import { useState } from "react";
import { registerUser } from "@/services/auth.service";

type RegisterResponse = {
  message: string;
  verificationUrl?: string;
};

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");
    setVerificationUrl("");

    try {
      const data = (await registerUser({ email, password })) as RegisterResponse;
      setSuccess(data.message || "Registration successful. Check your inbox for the verification email.");

      if (data.verificationUrl) {
        setVerificationUrl(data.verificationUrl);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      {verificationUrl && (
        <p>
          Demo verification link: <a href={verificationUrl}>Verify Email</a>
        </p>
      )}

      <label htmlFor="register-email">Email</label>
      <input
        id="register-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="register-password">Password</label>
      <input
        id="register-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Register"}
      </button>

      <p>
        Already registered and verified? <a href="/login">Go to Login</a>
      </p>
    </form>
  );
}