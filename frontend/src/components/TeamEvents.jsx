import React from "react";

export default function TeamEvents({ teams = [], selectedTeamId, onSelectTeam, events = [], loadingEvents }) {
  return (
    <div style={{ marginTop: 12 }}>
      <label>
        Team:
        <select
          value={selectedTeamId ?? ""}
          onChange={e => onSelectTeam(e.target.value ? Number(e.target.value) : null)}
          style={{ marginLeft: 8 }}
        >
          {teams.map(t => (
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
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>
                    {ev.event_date
                      ? new Date(ev.event_date + "T00:00:00").toLocaleDateString()
                      : new Date(ev.created_at).toLocaleString()
                    }
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{ev.event_name}</td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #f0f0f0" }}>{ev.event_info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
