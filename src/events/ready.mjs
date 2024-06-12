import User from "../models/user.mjs";
import Party from "../models/party.mjs";
import UserParty from "../models/userParty.mjs";
import { Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute: client => {
        User.sync();
        Party.sync();
        UserParty.sync();

        User.belongsToMany(Party, { through: UserParty });
        Party.belongsToMany(User, { through: UserParty });

        console.log(`Logged in as ${client.user.tag}!`);
    }
};