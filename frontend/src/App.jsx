import { useState, useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import TeamEvents from "./components/TeamEvents";
import API from "./api/axiosConfig";

export default function App() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState("");
  const [customTeam, setCustomTeamName] = useState("");

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setCustomTeamName("");
      const teamRes = await API.post("/teams", {team_name: customTeam});
      const teamId = teamRes.data.team.id;
      const userId = user.id;
      await API.post(`/teams/${teamId}/users/${userId}`);

      console.log(`User ${user.username} added to team ${teamId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create team")
    }
  }

  // Verify token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/verify")
        .then(res => {
          setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  // When user changes (login / verify), fetch their teams
  useEffect(() => {
    if (!user) {
      setTeams([]);
      setSelectedTeamId(null);
      setEvents([]);
      return;
    }

    const fetchTeams = async () => {
      setLoadingTeams(true);
      setError("");
      try {
        const res = await API.get(`/teams/user/${user.id}`);
        setTeams(res.data.teams || []);
        if ((res.data.teams || []).length > 0) {
          setSelectedTeamId(res.data.teams[0].id);
        } else {
          setSelectedTeamId(null);
          setEvents([]);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch teams");
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [user]);

  // When selected team changes, fetch events for that team
  useEffect(() => {
    if (!selectedTeamId) {
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError("");
      try {
        const res = await API.get(`/events/${selectedTeamId}`);
        // controller returns { jikans: [...] } for events
        const maybeEvents = res.data.jikans ?? res.data.events ?? [];
        setEvents(maybeEvents);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch events");
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [selectedTeamId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTeams([]);
    setSelectedTeamId(null);
    setEvents([]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to JIKAN testing.</h2>

      {!user ? (
        <>
          <Login onLogin={setUser} />
          <SignUp />
        </>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2>Welcome, {user.username}</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <h3>Here are the events:</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {loadingTeams ? (
            <p>Loading teams...</p>
          ) : teams.length === 0 ? (
            <p>You are not in any team yet. Create a team or have an admin add you.</p>
          ) : (
            <TeamEvents
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={setSelectedTeamId}
              events={events}
              loadingEvents={loadingEvents}
            />
          )}

          <h3>Create a team:</h3>
          <form onSubmit={handleCreateTeam}>
            <input type="text" value={customTeam} onChange={e => setCustomTeamName(e.target.value)} required></input> <button type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  );
}
