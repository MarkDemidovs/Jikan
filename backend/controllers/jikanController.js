const jikanModel = require("../model/jikanModel");
const jwt = require("jsonwebtoken");

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

const addUser = async (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({error: "Missing required fields."});
    }
    try {
        const newUser = await jikanModel.addUser({username, password});
        res.status(201).json({ user: newUser });
    } catch (err) {
        res.status(500).json({error: "Failed to add jikan: " + err.message});
    }
}

const loginUser = async (req,res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({error: "Missing required fields."});
    try {
        const user = await jikanModel.verifyUser({username, password});
        if (!user) return res.status(401).json({error: "Invalid username or password"});
        res.json({user});
    } catch (err) {
        res.status(500).json({error: "Failed to login: " + err.message});
    }
}

const addTeam = async (req,res) => {
    const { team_name } = req.body;
    if (!team_name) return res.status(400).json({error: "Missing team_name required field."});
    try {
        const newTeam = await jikanModel.createTeam({team_name});
        res.status(201).json({team: newTeam});
    } catch (err) {
        res.status(500).json({error: "Failed to create: " + err.message});
    }
}

const addUserToTeam = async (req,res) => {
    const { teamId, userId } = req.params;
    try {
        const membership = await jikanModel.addUserToTeam({
            teamId,
            userId,
        })
        if (!membership) {
            return res.status(200).json({message : "User already in team."})
        }
        res.status(201).json({membership});
    } catch (err) {
        res.status(500).json({error: "failed to add user to team: " + err.message})
    }
}

const addEvent = async (req,res)=> {
    const { event_date, event_name, event_info, team_id  } = req.body;
    if (!event_date || !event_name || !event_info || !team_id) return res.status(400).json({error: "Missing required fields."})
    try {
        const newEvent = await jikanModel.createEvent({event_date, event_name, event_info, team_id});        
        res.status(201).json({event: newEvent});
    } catch (err) {
        res.status(500).json({error: "failed to add event to team: " + err.message})
    }
}

// return teams for a given user id
const getUserTeams = async (req, res) => {
    const { userId } = req.params;
    try {
        const teams = await jikanModel.getUserTeams({ userId });
        res.status(200).json({ teams });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user teams: " + err.message });
    }
}

const verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: { id: decoded.id, username: decoded.username } });
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

const lookJikans = async (req,res) => {
    const { teamId } = req.params;
    try {
        const lookForJikans = await jikanModel.lookJikan({teamId});
        res.status(200).json({jikans: lookForJikans})
    } catch (err) {
        res.status(500).json({error: "failed to look for jikans in a specific team: " + err.message});
    }
}


const removeEvent = async (req,res) => {
    const { eventId } = req.params;

    try {
        const deleteEvent = await jikanModel.eventDeletion({eventId});
        res.status(200).json({jikans_del: deleteEvent});
    } catch (err) {
        res.status(500).json({ error: "Failed to delete event: " + err.message });
    }
}

module.exports = {
    getAllJikans,
    getJikan,
    addUser,
    loginUser,
    addTeam,
    addUserToTeam,
    addEvent,
    lookJikans,
    getUserTeams,
    verifyToken,
    removeEvent
}
