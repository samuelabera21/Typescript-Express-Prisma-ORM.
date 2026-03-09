"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterForm;
const react_1 = require("react");
const auth_service_1 = require("@/services/auth.service");
function RegisterForm() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const [success, setSuccess] = (0, react_1.useState)("");
    const [verificationUrl, setVerificationUrl] = (0, react_1.useState)("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setVerificationUrl("");
        try {
            const data = (await (0, auth_service_1.registerUser)({ email, password }));
            setSuccess(data.message || "Registration successful. Check your inbox for the verification email.");
            if (data.verificationUrl) {
                setVerificationUrl(data.verificationUrl);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Registration failed";
            setError(message);
        }
        finally {
            setLoading(false);
        }
    };
    return (<form onSubmit={handleSubmit} className="auth-form">
      <h2>Register</h2>

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}

      {verificationUrl && (<p>
          Demo verification link: <a href={verificationUrl}>Verify Email</a>
        </p>)}

      <label htmlFor="register-email">Email</label>
      <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

      <label htmlFor="register-password">Password</label>
      <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Register"}
      </button>

      <p>
        Already registered and verified? <a href="/login">Go to Login</a>
      </p>
    </form>);
}
