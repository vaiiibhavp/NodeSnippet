"use strict";

const { throwError, jwt } = require("../lib/functions");
const UserSession = require("../models/UserSession");

module.exports = () => {
    return (req, res, next) => {
        let authorization;
        let _error = throwError("Unauthorized to access this page", "unauthorised", 401, false);
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            authorization = req.headers.authorization.split(" ")[1];
        }
        try {
            //console.log(authorization);
            if (authorization) {
                let payload = jwt.verify(authorization);
                if (payload && payload.session_id) {
                    return UserSession.findById(payload.session_id)
                        .populate('user')
                        .lean()
                        .then((session) => {
                            if (session && session.user) {
                                req.session = () => session;
                                req.user = () => session.user;
                                return next();
                            }
                            return next(_error);
                        });

                }
            }
            next(_error);
        } catch (err) {
            next(_error);
        }

    }
}