"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const react_1 = require("react");
const auth_service_1 = require("@/services/auth.service");
const navigation_1 = require("next/navigation");
function DashboardPage() {
    const router = (0, navigation_1.useRouter)();
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)("");
    const [logoutLoading, setLogoutLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        async function loadUser() {
            try {
                const data = await (0, auth_service_1.getCurrentUser)();
                setUser(data.user);
            }
            catch (err) {
                console.error(err);
                setError("Failed to load user profile. Please login again.");
            }
            finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);
    if (loading) {
        return <p>Loading user...</p>;
    }
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }
    if (!user) {
        return <p>No user found.</p>;
    }
    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await (0, auth_service_1.logoutUser)();
            router.push("/login");
        }
        catch (err) {
            console.error(err);
            setError("Logout failed. Please try again.");
            setLogoutLoading(false);
        }
    };
    return (<div className="auth-shell" style={{ marginTop: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Welcome {user.email}</p>
      <p>Session refresh is handled in the background while your cookies are valid.</p>
      <button onClick={handleLogout} disabled={logoutLoading}>
        {logoutLoading ? "Signing out..." : "Logout"}
      </button>
    </div>);
}
