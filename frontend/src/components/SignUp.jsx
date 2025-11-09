import { useState } from 'react';
import API from "../api/axiosConfig";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await API.post("/users", { username, password });
            setSuccess("Account created! You can now log in.");
            setUsername("");
            setPassword("");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        }
    };
    
    return (
        <div id='signupDiv'>
            <h2>Sign Up</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">作 Sign Up</button>
            </form>
        </div>
    );
}