const Mongoose = require("mongoose");
const Config = require("config");

const dbConnect = () => {
    try {
        let db = Config.get("database");
        let auth = '';
        if (db.username && db.password) {
            auth = `${db.username}:${db.password}@`
        }
        let connection = `mongodb://${auth}${db.host}:${db.port}/${db.dbname}`;
        Mongoose.connect(connection, db.options)
            .then((conn) => {
                console.log("Mongo db connected - %s", connection);
            }).catch((err) => {
                console.log("Database connection failed", err.message);
                process.exit();
            })
    } catch (err) {
        console.log("Database connection failed", err.message);
        process.exit();

    }
}

module.exports = dbConnect;