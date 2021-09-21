"use strict";

const Mongoose = require("mongoose");

const UserSessionSchema = Mongoose.Schema({
    user: {
        type: Mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    login_at: {
        type: Date,
        default: Date.now
    },
    expired_at: {
        type: Date,
        index: { expires: 60 * 60 }
    },
    device_id: String,
    role: String,
    ip: String,
    user_agent: String,
},
    {
        timestamps: false,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    });


module.exports = Mongoose.model("UserSession", UserSessionSchema, 'user_sessions');