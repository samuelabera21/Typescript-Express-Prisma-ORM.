"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyEmailForm;
const react_1 = require("react");
const auth_service_1 = require("@/services/auth.service");
const navigation_1 = require("next/navigation");
function VerifyEmailForm() {
    const searchParams = (0, navigation_1.useSearchParams)();
    const [email, setEmail] = (0, react_1.useState)(searchParams.get("email") || "");
    const [token, setToken] = (0, react_1.useState)(searchParams.get("token") || "");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [resending, setResending] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const [success, setSuccess] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        const qpEmail = searchParams.get("email");
        const qpToken = searchParams.get("token");
        if (qpEmail) {
            setEmail(qpEmail);
        }
        if (qpToken) {
            setToken(qpToken);
        }
    }, [searchParams]);
    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const result = (await (0, auth_service_1.verifyEmail)({ email, token }));
            setSuccess(result.message || "Email verified successfully. You can login now.");
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Email verification failed";
            setError(message);
        }
        finally {
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
            const result = (await (0, auth_service_1.resendVerificationEmail)(email));
            if (result.verificationUrl) {
                setSuccess(`${result.message} Demo link: ${result.verificationUrl}`);
            }
            else {
                setSuccess(result.message || "Verification email resent.");
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Could not resend verification email";
            setError(message);
        }
        finally {
            setResending(false);
        }
    };
    return (<form onSubmit={handleVerify} className="auth-form">
      <h2>Verify Your Email</h2>
      <p>Open the link from your inbox. This page can also verify using token and email from the URL.</p>

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      <label htmlFor="verify-email">Email</label>
      <input id="verify-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

      <label htmlFor="verify-token">Verification Token</label>
      <textarea id="verify-token" value={token} onChange={(e) => setToken(e.target.value)} rows={4} required/>

      <button type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <button type="button" onClick={handleResend} disabled={resending}>
        {resending ? "Sending..." : "Resend Verification"}
      </button>

      <p>
        Done verifying? <a href="/login">Go to Login</a>
      </p>
    </form>);
}
