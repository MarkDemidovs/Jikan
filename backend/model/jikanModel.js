const db = require("../db/index");
const bcrypt = require("bcrypt");

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

    return {id: user.id, username: user.username};
}

const createTeam = async ({team_name}) => {
    const result = await db.query("INSERT INTO teams (team_name) VALUES ($1) RETURNING id, team_name, created_at", [team_name]);
    return result.rows[0];
}

module.exports = {
    getAllJikans,
    getJikan,
    addUser,
    verifyUser,
    createTeam
}