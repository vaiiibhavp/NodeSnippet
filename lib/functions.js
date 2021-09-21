"use strict";

const ErrorException = require("./exception"),
    bcrypt = require("bcryptjs"),
    Config = require("config"),
    JWT = require("jsonwebtoken"),
    SALT_FACTOR = 10;

/**
 * @description Handle method of controller callback
 * @param {Function}} fn - Controller method pass function 
 * @returns {Promise}
 */
exports.asyncFunc = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next).catch(next));
    }
}

/**
 * @description Throw application custom error with http status code
 * @param {String} message - Error message 
 * @param {String} code - Error code
 * @param {Number} statusCode - Http status code
 * @param {Boolean} throwerror - Throw or return error exception
 */
exports.throwError = (message, code = "BadRequest", statusCode = 400, throwerror = true) => {
    if (throwerror) {
        throw ErrorException(message, code, statusCode);
        return;
    }
    return ErrorException(message, code, statusCode);
}

/**
 * @description Throw application custom error with 404 http status code
 * @param {String} message - Error message 
 * @param {Boolean} throwerror - Throw or return error exception
 */
exports.throw404Error = (message, throwerror = true) => {
    let code = "404NotFound";
    let statusCode = 404;
    if (throwerror) {
        throw ErrorException(message, code, statusCode);
    }
    return ErrorException(message, code, statusCode);
}

/** Jwt authentication */
exports.jwt = {
    sign: function (payload, options = {}) {
        return JWT.sign(payload, Config.get("JWT_SECRET_KEY"), options);
    },
    verify: function (token, options = {}) {
        return JWT.verify(token, Config.get("JWT_SECRET_KEY"), options);
    },
    signById: function (id, options = {}) {
        return this.sign({
            session_id: id
        }, options);
    }
}

/** Encryption */
exports.bcrypt = {
    hash: function (str, cb) {
        bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
            if (err) {
                return cb({ error: err });
            }
            bcrypt.hash(str, salt, function (err, hash) {
                if (err) {
                    return cb({ error: err });
                }
                return cb(hash);
            })
        })
    },
    compare: function (str, hash) {
        return bcrypt.compareSync(str, hash);
    }
},

    /**
     * Additional helper functions
     */
    exports.helper = {
        bcrypt: this.bcrypt,
        jwt: this.jwt
    }