import { Sequelize } from "sequelize";

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,

    // SQLite only
    storage: 'database.sqlite',
});

export default sequelize;