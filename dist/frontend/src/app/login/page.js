"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const LoginForm_1 = __importDefault(require("@/components/forms/LoginForm"));
function LoginPage() {
    return (<main className="auth-page">
      <section className="auth-shell">
        <h1>Welcome Back</h1>
        <p>Login with your verified email to access protected features.</p>
        <LoginForm_1.default />
      </section>
    </main>);
}
