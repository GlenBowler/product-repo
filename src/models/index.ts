const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

let db: any = {}

const sequelizeDb = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
});



fs.readdirSync(__dirname)
    .filter((file: any) =>
        file !== 'index.ts'
    )
    .forEach((file: any) => {
        const model = require(path.join(__dirname, file))(sequelizeDb, Sequelize.DataTypes);
        db[model.name] = model
    })


Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelizeDb;
db.Sequelize = Sequelize;

module.exports = db