






const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("product", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;



