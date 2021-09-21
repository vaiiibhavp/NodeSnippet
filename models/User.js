"use strict";

const UserSession = require("./UserSession");

const Mongoose = require("mongoose"),
    Config = require("config"),
    Helper = require("../lib/functions").helper,
    user_status = Config.get("user_status");

const UserSchema = Mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    /*   gender: {
          type: String,
          enum: Config.get("gender_allowed"),
          default: Config.get("default_gender")
      }, */
    // User status active or inactive
    status: {
        type: Number,
        enum: Object.values(user_status),
        default: user_status.active,
        select: false
    },
    mobile: String,
}, {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Save encrpted format password before save
UserSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    let _this = this;
    Helper.bcrypt.hash(this.password, function (hash) {
        if (hash.error) {
            return next(hash.error);
        }
        _this.password = hash;
        next();
    });

});

// Save encrpted format password before update
UserSchema.pre('update', function (next) {
    let _this = this;
    if (_this.getUpdate()['$set'].password && _this.getUpdate()['$set'].password != null) {
        Helper.bcrypt.hash(_this.getUpdate()['$set'].password, function (hash) {
            if (hash.error) {
                return next(hash.error);
            }
            _this.update({}, { $set: { password: hash } });
        })
    }
    next();
});

/**
 * 
 * @description Create user session by id
 * @param {String} user_id 
 * @param {Object} options 
 * @returns {Promise}
 */
UserSchema.statics.createUserSession = function (user_id, options = {}) {
    if (options.expire_time) {
        if (typeof options.expire_time == "boolean") {
            options.expire_time = new Date();
        } else {
            let expire_time = parseInt(options.expire_time);
            if (isNaN(expire_time) === false) {
                options.expire_time = (Date.now() - (60 * 60 * 1000)) + ((options.expire_time * 60) * 1000);
            }
        }
    }

    return new Promise((resolve, reject) => {
        UserSession.findOneAndUpdate(
            {
                user: user_id,
                $and: [
                    { device_id: { $exists: true } },
                    { device_id: { $ne: null } },
                    { device_id: options.device_id }
                ]
            },
            {
                ip: options.ip ? options.ip : undefined,
                user_agent: options.user_agent ? options.user_agent : undefined,
                meta: options.meta ? options.meta : undefined,
                expired_at: options.expire_time ? options.expire_time : undefined,
                login_time: new Date()
            },
            {
                new: true,
                upsert: true
            },
            (err, doc) => {
                if (err) {
                    return reject(err);
                }
                let token = Helper.jwt.signById(doc._id);
                doc = doc.toObject();
                doc.token = token;
                return resolve(doc);
            }
        )
    })
}

// User password match
UserSchema.methods.matchPassword = function (password) {
    return Helper.bcrypt.compare(password, this.password);
};

/**
 * @description Create user session
 * @param {Http Request} req 
 * @param {Interger} expire_time Set expire time in minutes
 * @returns 
 */
UserSchema.methods.createSession = function (options) {
    return UserModel.createUserSession(this._id, options);
}

const UserModel = Mongoose.model("User", UserSchema);
module.exports = UserModel;