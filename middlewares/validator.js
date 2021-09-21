const { body, param, validationResult } = require("express-validator");
const User = require("../models/User");

// Validation error handler
function validateMiddleware(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(422).json({
        success: false,
        error_code: "invalidEntities",
        message: "Validation error occurred",
        errors: errors.array()
    })
};

function rules(va_rules) {
    va_rules.push(validateMiddleware)
    return va_rules;
}

// Check user email not already exists 
function emailNotExists(value) {
    return User.findOne({ email: value }).select('email')
        .then((user) => {
            if (user && user.email)
                return Promise.reject("Email already exists")
        })
}

/* 
// Check user mobile number not exists
function mobileNotExists(mobile, { req }) {
    if (mobile) {
        let query = {
            mobile: mobile
        }
        let country_code = req.body.country_code || null;
        if (country_code) {
            query.country_code = country_code;
        }
        return User.findOne(query).then((user) => {
            if (user)
                return Promise.reject("Mobile already exists");
        })
    }
}
 */

// Registration rules
exports.register = rules([
    body("name", "Name is required").isString().escape(),
    body("email", "Email is required").notEmpty().bail().isEmail().withMessage("!Invalid email address").custom(emailNotExists),
    // body("mobile", "Invalid mobile number").optional().isNumeric().custom(mobileNotExists),
    //   body("country", "Country is required").isString().escape(),
    //  body("country_code", "Country code is invalid").optional().isNumeric(),
    //  body("currency").optional().isString(),
    body("password", "Password is required").notEmpty().bail().isLength({ min: 6 }).withMessage("Password length is not less then 6"),
    body("confirm_password", "Confirm password is required").notEmpty()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Confirm password doesn't matched");
            }
            return true;
        }),
]);

// Login rules
exports.login = rules([
    body("username", "Username is required").notEmpty().bail().isEmail().withMessage("!Invalid username"),
    body("password", "Password is required").notEmpty()
]);





