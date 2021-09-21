"use strict";

const express = require("express"),
    Auth = require("../controllers/authentication"),
    Validater = require("../middlewares/validator"),
    jwtAuth = require("../middlewares/auth"),
    Route = express.Router();

Route.post("/auth/register", Validater.register, Auth.register);
Route.post("/auth/login", Validater.login, Auth.login);

// Private rutes only for logged in user
Route.get("/auth/logout", jwtAuth(), Auth.logout);

module.exports = Route;