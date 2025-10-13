import { useState } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

export default function App() {
  const [user, setUser] = useState(null);

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
