import sequelize from '../config/database.mjs';
import { DataTypes, Model } from 'sequelize';

export default class UserParty extends Model {};

UserParty.init({
    type: {
        type: DataTypes.ENUM,
        values: ['JOINED', 'BANNED']
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    partyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserParty'
});