const db = require("../db/index");

const getAllJikans = async () => {
    const result = await db.query("SELECT * FROM events");
    return result.rows;
};

const getJikan = async (id) => {
    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);
    return result.rows[0];
}
module.exports = {
    getAllJikans,
    getJikan
}