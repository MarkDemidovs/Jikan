const db = require("../db/index");

const getAllJikans = async () => {
    const result = await db.query("SELECT * FROM events");
    return result.rows;
};

module.exports = {
    getAllJikans,
}