import sequelize from '../config/database.mjs';
import { DataTypes, Model } from 'sequelize';

export default class Party extends Model {};

Party.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Party'
});