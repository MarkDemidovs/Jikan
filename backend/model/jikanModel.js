const db = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const getAllJikans = async () => {
    const result = await db.query("SELECT * FROM events");
    return result.rows;
};

const getJikan = async (id) => {
    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);
    return result.rows[0];
}

const addUser = async ({ username, password }) => {
    // password hashing..
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // inserting unto the accounts table.
    const result = await db.query(
        "INSERT INTO accounts (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at", [username, hashedPassword]
    );

    return result.rows[0]; 
}

// testable user module
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
        WHERE team_id = ($1) -- replace with actual team_id
        ORDER BY event_date;
`
    const result = await db.query(query, [teamId]);

    return result.rows;
}

module.exports = {
    getAllJikans,
    getJikan,
    addUser,
    verifyUser,
    createTeam,
    addUserToTeam,
    createEvent,
    lookJikan
}