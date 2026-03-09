"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyEmailPage;
const VerifyEmailForm_1 = __importDefault(require("@/components/forms/VerifyEmailForm"));
function VerifyEmailPage() {
    return (<main className="auth-page">
      <section className="auth-shell">
        <h1>Email Verification</h1>
        <p>Complete verification before logging in to your dashboard.</p>
        <VerifyEmailForm_1.default />
      </section>
    </main>);
}
