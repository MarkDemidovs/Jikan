import { useState, useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import API from "./api/axiosConfig";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/verify")
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);


  return (
    <div>
      <h2>Welcome to JIKAN testing.</h2>
      {!user ? (
        <>
          <Login onLogin={setUser} />
          <SignUp />
        </>
      ) : (
        <div>
          <h2>Welcome, {user.username}</h2>
          <button onClick={() => {
            localStorage.removeItem("token");
            setUser(null);
          }}>Logout</button>
        </div>
      )}
    </div>
  );
}
