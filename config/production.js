module.exports = {
    server: {
        //host: "",
        port: process.env.PORT || 3000,
        api: {
            basepath: "/api",
            // basepath: "/api/v1"
        }
    },
    // Datbase connection object
    database: {
        host: "127.0.0.1",
        port: "27017",
        dbname: "node_starter",
        // username: "",
        //  password: "",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            /*  auth: {
                 user: "admin",
                 password: "RyBNhdhzV1",
             },
             authSource: "admin", */
        }
    },
    gender_allowed: ["male", "female", "other"],
    default_gender: "male",
    user_status: {
        active: 1,
        block: 2,
        pending: 3
    },
    JWT_SECRET_KEY: "fb1CbH+f+3L*6BxP+Bwmdsxi_eHS0dfLxgSh!KWMq_34^XVAS!8)41OPrsAo8d(#g&Y0lCR6FmRIWJ9x0x+slqCHeN5s#w$3iGE9W4gwKd!U+mNOzrdTD5umj@mvCk((4z4m%GD5zfG309AP+7e0&chE84*5"
}