"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginForm;
const react_1 = require("react");
const auth_service_1 = require("@/services/auth.service");
const navigation_1 = require("next/navigation");
function LoginForm() {
    const router = (0, navigation_1.useRouter)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const [message, setMessage] = (0, react_1.useState)("");
    const [resending, setResending] = (0, react_1.useState)(false);
    const unverifiedEmail = error.toLowerCase().includes("verify your email") ||
        error.toLowerCase().includes("not verified");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            await (0, auth_service_1.loginUser)({ email, password });
            router.push("/dashboard");
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Login failed";
            setError(message);
        }
        finally {
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
            const result = (await (0, auth_service_1.resendVerificationEmail)(email));
            setMessage(result.message || "Verification email resent. Please check your inbox.");
            if (result.verificationUrl) {
                setMessage(`${result.message} Open link: ${result.verificationUrl}`);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to resend verification";
            setError(message);
        }
        finally {
            setResending(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>

      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-success">{message}</p>}

      <label htmlFor="login-email">Email</label>
      <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {unverifiedEmail && (<button type="button" onClick={handleResendVerification} disabled={resending}>
          {resending ? "Sending verification..." : "Resend Verification Email"}
        </button>)}

      <p>
        Need to verify manually? <a href="/verify-email">Open Verify Page</a>
      </p>
    </form>);
}
