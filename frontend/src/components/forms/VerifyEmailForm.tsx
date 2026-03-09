"use client";

import { FormEvent, useEffect, useState } from "react";
import { resendVerificationEmail, verifyEmail } from "@/services/auth.service";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [autoVerifying, setAutoVerifying] = useState(false);
  const [autoVerifyTried, setAutoVerifyTried] = useState(false);

  const runVerify = async (verifyEmailValue: string, verifyTokenValue: string) => {
    const result = (await verifyEmail({
      email: verifyEmailValue,
      token: verifyTokenValue,
    })) as {
      message?: string;
    };

    setSuccess(result.message || "Email verified successfully. You can login now.");
  };

  useEffect(() => {
    const qpEmail = searchParams.get("email");
    const qpToken = searchParams.get("token");

    if (qpEmail) {
      setEmail(qpEmail);
    }

    if (qpToken) {
      setToken(qpToken);
    }
  }, [searchParams]);

  useEffect(() => {
    const qpEmail = searchParams.get("email") || "";
    const qpToken = searchParams.get("token") || "";

    if (!qpEmail || !qpToken || autoVerifyTried) {
      return;
    }

    setAutoVerifyTried(true);
    setAutoVerifying(true);
    setError("");
    setSuccess("");

    runVerify(qpEmail, qpToken)
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Email verification failed";
        setError(message);
      })
      .finally(() => {
        setAutoVerifying(false);
      });
  }, [autoVerifyTried, searchParams]);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await runVerify(email, token);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Email verification failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email to resend verification link.");
      return;
    }

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const result = (await resendVerificationEmail(email)) as {
        message?: string;
        verificationUrl?: string;
      };

      if (result.verificationUrl) {
        setSuccess(`${result.message} Demo link: ${result.verificationUrl}`);
      } else {
        setSuccess(result.message || "Verification email resent.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not resend verification email";
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="auth-form">
      <h2>Verify Your Email</h2>
      <p>Open the link from your inbox. This page can also verify using token and email from the URL.</p>

      {autoVerifying && <p>Verifying automatically from email link...</p>}

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      <label htmlFor="verify-email">Email</label>
      <input
        id="verify-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="verify-token">Verification Token</label>
      <textarea
        id="verify-token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        rows={4}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <button type="button" onClick={handleResend} disabled={resending}>
        {resending ? "Sending..." : "Resend Verification"}
      </button>

      <p>
        Done verifying? <a href="/login">Go to Login</a>
      </p>
    </form>
  );
}
