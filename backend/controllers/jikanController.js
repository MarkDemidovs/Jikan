const jikanModel = require("../model/jikanModel");

const getAllJikans = async (req,res) => {
    try {
        const jikans = await jikanModel.getAllJikans();
        res.json({ jikans });
    } catch (err) {
        res.status(500).json({error: "Failed to fetch jikans: " + err.message});
    }
}

const getJikan = async (req,res) => {
    const id = req.params.id;

    try {
        const jikan = await jikanModel.getJikan(id);

        if(!jikan) {
            return res.status(400).json({error: "Jikan not found"});
        }

        res.json({ jikan })
    } catch (err) {
        res.status(500).json({error: "Failed to fetch a jikan: " + err.message});
    }

}

module.exports = {
    getAllJikans,
    getJikan,
}