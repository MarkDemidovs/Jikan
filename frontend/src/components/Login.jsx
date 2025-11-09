import { useState } from "react";
import API from "../api/axiosConfig";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await API.post("/login", { username, password });
            localStorage.setItem("token", res.data.user.token);
            onLogin(res.data.user);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please check your credentials.");
            setPassword("");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="loginDiv">
            <h2>Welcome Back</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin} autoComplete="off">
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                        disabled={isLoading}
                        aria-label="Username"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        disabled={isLoading}
                        aria-label="Password"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? "Logging in..." : "入 Login"}
                </button>
            </form>
        </div>
    );
}
