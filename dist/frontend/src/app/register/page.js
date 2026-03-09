"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
const RegisterForm_1 = __importDefault(require("@/components/forms/RegisterForm"));
function RegisterPage() {
    return (<main className="auth-page">
      <section className="auth-shell">
        <h1>Create Account</h1>
        <p>Register first, then verify your email before logging in.</p>
        <RegisterForm_1.default />
      </section>
    </main>);
}
