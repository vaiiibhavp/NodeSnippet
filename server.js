"use strict";

const config = require("config");
const express = require("express");
const db_connect = require("./config/database");
const cors = require("cors");
const morgan = require("morgan");

const app = express(),
    server = config.get("server");

// Connect to database
db_connect();

// Cors
app.use(cors());

app.use(morgan("combined"));

/** Parse incoming body request from content type application/json */
app.use(express.json());

/** Parse incoming body request from content type application/x-www-form-urlencoded */
app.use(
    express.urlencoded({
        extended: false,
    })
);

// Routes
app.use(server.api.basepath, require("./routes"));
//app.use(server.api.prefix, require("./routes/admin"));

// Error handling middleware
require("./middlewares/errors")(app, config);

app.listen(server.port, () => console.log(`Server listing on port ${server.port}`));