import { SlashCommandBuilder } from "discord.js";
import Party from "../models/party.mjs";
import User from "../models/user.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("splitloot")
        .setDescription("Divide el loot de una party")
        .addStringOption(option =>
            option.setName("party")
                .setDescription("The party to split loot")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("gold")
                .setDescription("The gold to split")
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const name = interaction.options.getString("party");
        const gold = interaction.options.getInteger("gold");

        const party = await Party.findOne({ where: { name } });
        if (!party) {
            await interaction.reply({ content: "Oe ctm esa party no existe", ephemeral: true });
            return;
        }

        const users = await User.findAll({
            include: [{
                model: Party,
                where: { name },
                through: {
                    where: {
                        type: "JOINED"
                    }
                }
            }]
        });
        const goldPerUser = (gold - (gold * 0.05)) / users.length;
        const usernames = users.map(user => user.username).join(", ");
        await interaction.reply({ content: `Le tocan $${goldPerUser} a los jugadores:\n${usernames}`, ephemeral: true });
    }
};