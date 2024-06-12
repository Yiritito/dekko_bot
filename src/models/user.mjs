import sequelize from '../config/database.mjs';
import { DataTypes, Model } from 'sequelize';

export default class User extends Model {};

User.init({
    discordId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'User'
});