const jikanModel = require("../model/jikanModel");

const getAllJikans = async (req,res) => {
    try {
        const jikans = await jikanModel.getAllJikans();
        res.json({ jikans });
    } catch (err) {
        res.status(500).json({error: "Failed to fetch jikans: " + err.message});
    }
}

module.exports = {
    getAllJikans,
}