const { asyncFunc, throwError } = require("../lib/functions");
const User = require("../models/User");
const Config = require("config");
const UserSession = require("../models/UserSession");

/**
 * @route   POST api/auth/register
 * @desc    Create a new user
 * @access  Public
 */
exports.register = asyncFunc(async (req, res, next) => {
    const payload = req.body;
    let data = {
        name: payload.name,
        email: payload.email,
        password: payload.password
    };
    User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password
    }, function (err, doc) {
        if (err) {
            return next(err);
        }
        doc = doc.toObject();
        // Delete password
        if (doc.password) {
            delete doc.password;
        }
        res.json({
            success: true,
            message: "User Registration Successfully",
            data: doc
        });
    });





});

/**
 * @route   POST api/auth/login
 * @desc    User login
 * @access  Public
 */
exports.login = asyncFunc(async (req, res, next) => {
    const { username, password } = req.body;
    let user = await User.findOne({ email: username }).select("+password +status");
    if (!user) {
        throwError("!invalid login details");
    }
    // Check user status 
    if (user.status && Config.has("user_status")) {
        let status = Config.get("user_status");
        if (user.status == status.block) {
            throwError("Your account is blocked please contact site administator");
        } else if (user.status == status.pending) {
            throwError("Your account is pending for approval.");
        }
    }
    // Throw error when not match password
    if (!user.matchPassword(password)) {
        throwError("!invalid login details");
    }

    // Let's create user session
    let session = await user.createSession({
        ip: req.ip,
        user_agent: req.get("user_agent"),
        device_id: req.body.device_id,
    });

    return res.json({
        success: true,
        message: "Successfully Login",
        data: {
            access_token: session.token
        }
    });

})

/**
 * @route   GET api/auth/logout
 * @desc    User logout
 * @access  Private
 */
exports.logout = asyncFunc(async (req, res, next) => {
    await UserSession.findByIdAndDelete(req.session()._id);
    res.json({
        success: true,
        message: "Logout successfully"
    })
})