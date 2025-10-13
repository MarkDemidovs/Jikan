import { useState } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <h2>Welcome to the testing of JIKAN.</h2>

      {!user ? (
        <>
          <SignUp />
          <Login onLogin={setUser} /> {}
        </>
      ) : (
        <div>
          <h3>Logged in as {user.username}</h3>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
