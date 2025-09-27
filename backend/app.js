const express = require("express");
const cors = require("cors");
const jikanRoutes = require("./routes/jikanRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/jikans", jikanRoutes);

module.exports = app;