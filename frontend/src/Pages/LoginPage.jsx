import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Already logged in, so there's nothing to do here
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(username, password);
            toast.success("Logged in");
            navigate("/", { replace: true });
        } catch (error) {
            // DRF returns 400 for bad credentials
            if (error.response?.status === 400) {
                toast.error("Invalid username or password");
            } else {
                toast.error("Could not reach the server");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="flex justify-center items-center mt-16 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white shadow-md rounded-md p-6 flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Username</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                </label>
                <button
                    type="submit"
                    disabled={submitting}
                    className="text-white bg-blue-600 hover:bg-gray-900 rounded-md px-3 py-2 disabled:opacity-50"
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </section>
    );
};
export default LoginPage;
