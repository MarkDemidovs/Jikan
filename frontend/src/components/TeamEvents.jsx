import React from "react";

export default function TeamEvents({
  teams = [],
  selectedTeamId,
  onSelectTeam,
  events = [],
  loadingEvents,
  onDeleteEvent
}) {
  const parseDate = (str) => {
    if (!str) return null;
    const date = new Date(str);
    return isNaN(date.getTime()) ? null : date;
  };

  return (
    <div style={{ marginTop: 12 }}>
      <label>
        Team:
        <select
          value={selectedTeamId ?? ""}
          onChange={(e) =>
            onSelectTeam(e.target.value ? Number(e.target.value) : null)
          }
          style={{ marginLeft: 8 }}
        >
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.team_name}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: 16 }}>
        {loadingEvents ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events for this team.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>Date</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>Name</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>Info</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "8px" }}>Delete?</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const parsedDate = parseDate(ev.event_date || ev.created_at);
                return (
                  <tr key={ev.id}>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                      {parsedDate ? parsedDate.toLocaleDateString() : "Invalid Date"}
                    </td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{ev.event_name}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{ev.event_info}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                      <button onClick={() => onDeleteEvent(ev.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
