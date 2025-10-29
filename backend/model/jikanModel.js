const db = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllJikans = async () => {
    const result = await db.query("SELECT * FROM events");
    return result.rows;
};

const getJikan = async (id) => {
    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);
    return result.rows[0];
}

const addUser = async ({ username, password }) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
        "INSERT INTO accounts (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at",
        [username, hashedPassword]
    );

    return result.rows[0]; 
}

const verifyUser = async ({username, password}) => {
    const result = await db.query("SELECT * FROM accounts WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) return null;

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return null;

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {id: user.id, username: user.username, token};
}

const createTeam = async ({team_name}) => {
    const result = await db.query("INSERT INTO teams (team_name) VALUES ($1) RETURNING id, team_name, created_at", [team_name]);
    return result.rows[0];
}

const createEvent = async ({ event_date, event_name, event_info, team_id }) => {
    const result = await db.query(
        `INSERT INTO events (event_date, event_name, event_info, team_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [event_date, event_name, event_info, team_id]
    );
    return result.rows[0];
};

const lookJikan = async ({teamId}) => {
    const query = `SELECT id,
       event_name,
       event_date,
       event_info,
       created_at
        FROM events
        WHERE team_id = $1
        ORDER BY event_date;
    `;
    const result = await db.query(query, [teamId]);
    return result.rows;
}

// get all teams for a user
const getUserTeams = async ({ userId }) => {
    const query = `
      SELECT t.id, t.team_name, t.created_at
      FROM teams t
      JOIN team_members tm ON tm.team_id = t.id
      WHERE tm.account_id = $1
      ORDER BY t.created_at;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
}

const eventDeletion = async ({ eventId }) => {
    const result = await db.query("DELETE FROM events WHERE id = $1 RETURNING *", [eventId]);
    return result.rows;
}

const addUserToTeam = async ({teamId, userId}) => {
    const query = `
        INSERT INTO team_members (team_id, account_id)
        VALUES ($1, $2)
        ON CONFLICT (team_id, account_id) DO NOTHING
        RETURNING id, team_id, account_id
    `;
    const result = await db.query(query, [teamId, userId]);
    return result.rows[0];
}

const addNamedUserToTeam = async ({ teamId, username }) => {
    const query = `
        SELECT id FROM ACCOUNTS
        WHERE username = $1
        RETURNING id 
    `

    const result = await db.query(query, [username]);

    const query1 = `
        INSERT INTO team_members (team_id, account_id)
        VALUES ($1, $2)
        ON CONFLIC (team_id, account_id) DO NOTHING
        RETURNING id, team _Id, account_id
    `
    const result1 = await db.query(query1, [teamId, result]);
    return result1.rows[0];

    
}
module.exports = {
    getAllJikans,
    getJikan,
    addUser,
    verifyUser,
    createTeam,
    addUserToTeam,
    createEvent,
    lookJikan,
    getUserTeams,
    eventDeletion,
    addNamedUserToTeam
}
