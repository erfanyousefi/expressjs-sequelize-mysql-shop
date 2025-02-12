const {config} = require("dotenv");
const {Sequelize} = require("sequelize");
config();
const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
});
sequelize.authenticate().then(() => {
    console.log("connected to MariaDB successfully");
}).catch(err => {
    console.log("Cannot connect to database");
});
module.exports = sequelize;