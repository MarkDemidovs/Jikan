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
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventInfo, setEventInfo] = useState("");
  const [teamSettingsEnabled, setTeamSettingsEnabled] = useState(false);
  const [addablePerson, setAddablePerson] = useState("");

  // Verify token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/verify")
        .then((res) => {
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

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setCustomTeamName("");
      const teamRes = await API.post("/teams", { team_name: customTeam });
      const teamId = teamRes.data.team.id;
      const userId = user.id;
      await API.post(`/teams/${teamId}/users/${userId}`);

      console.log(`User ${user.username} added to team ${teamId}`);
      setTeams((prev) => [...prev, teamRes.data.team]);
      setSelectedTeamId(teamId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create team");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log({ eventTitle, eventDate, eventInfo });

      const isoDate = eventDate; // <-- already in correct format!

      await API.post("/events", {
        event_date: isoDate,
        event_name: eventTitle,
        event_info: eventInfo,
        team_id: selectedTeamId,
      });

      const res = await API.get(`/events/${selectedTeamId}`);
      const maybeEvents = res.data.jikans ?? res.data.events ?? [];
      setEvents(maybeEvents);

      setEventTitle("");
      setEventDate("");
      setEventInfo("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to Create Event.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setError("");

    try {
      await API.delete(`/events/${eventId}`);
      console.log(`Deleted event ${eventId}`);

      const res = await API.get(`/events/${selectedTeamId}`);
      const maybeEvents = res.data.jikans ?? res.data.events ?? [];
      setEvents(maybeEvents);
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Failed to delete event");
    }
  };

  const doTeamActions = () => setTeamSettingsEnabled(!teamSettingsEnabled);

  const handleAddToTeam = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/team/${selectedTeamId}/users`, {
        username: addablePerson,
      });

      setAddablePerson("");
    } catch (err) {
      console.error("Add to team error:", err);
      setError(err.response?.data?.error || "Failed to add person to team.");
    }
  };

  const leaveTeam = async (e) => {
    e.preventDefault();
    try {
      await API.delete(`/users/teams/${selectedTeamId}`, {
        username: user,
      });
      
    } catch (err) {
      console.error("Leave team error:", err);
      setError(err.response?.data?.error || "Failed to leave team.");
    }
  }


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
            <p>
              You are not in any team yet. Create a team or have an admin add
              you.
            </p>
          ) : (
            <TeamEvents
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelectTeam={setSelectedTeamId}
              events={events}
              loadingEvents={loadingEvents}
              onDeleteEvent={handleDeleteEvent}
              leaveTeam={leaveTeam}
            />
          )}

          <h3>Create a team:</h3>
          <form onSubmit={handleCreateTeam}>
            <input
              type="text"
              value={customTeam}
              onChange={(e) => setCustomTeamName(e.target.value)}
              required
              placeholder="Enter the name of the new team."
              id="teamInput"
            ></input>{" "}
            <button type="submit">Create</button>
          </form>

          <br></br>

          <button onClick={doTeamActions}>Team Actions</button>

          {teamSettingsEnabled ? (
            <>
              <h3>Create an event</h3>
              <p>This is based off the team you've currently selected.</p>

              <form onSubmit={handleCreateEvent}>
                <label htmlFor="titleEvent">Title of event</label>
                <br></br>
                <input
                  type="text"
                  name="titleEvent"
                  id="titleEvent"
                  maxLength="100"
                  placeholder="(Max 100 characters)"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />

                <br></br>

                <label htmlFor="titleEvent">Date of event</label>
                <br></br>
                <input
                  type="date"
                  name="titleEvent"
                  id="titleEvent"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />

                <br></br>

                <label htmlFor="event_info">Event Info</label>
                <br></br>
                <textarea
                  id="event_info"
                  name="event_info"
                  maxLength="255"
                  placeholder="Optional description (max 255 characters)"
                  value={eventInfo}
                  onChange={(e) => setEventInfo(e.target.value)}
                ></textarea>
                <br></br>
                <br></br>
                <button type="submit">Create Event</button>
              </form>
              <br></br>
              <hr></hr>
              <form onSubmit={handleAddToTeam}>
                <h3>Add person to team</h3>
                <label htmlFor="personInput" id="personLabel">
                  The person you submit will be added to the current team you've
                  selected.
                </label>{" "}
                <br></br>
                <input
                  type="text"
                  name="personInput"
                  id="personInput"
                  placeholder="Enter the username of the person you want to add."
                  required
                  value={addablePerson}
                  onChange={(e) => setAddablePerson(e.target.value)}
                />
                <button onClick={handleAddToTeam}>Add Person</button>
              </form>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
