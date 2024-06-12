import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Party from "../models/party.mjs";
import User from "../models/user.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("partylist")
        .setDescription("Lista todos los usuarios de una party")
        .addStringOption(option =>
            option.setName("party")
                .setDescription("The party to list")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    execute: async (interaction) => {
        const name = interaction.options.getString("party");

        const party = await Party.findOne({ where: { name, guildId: interaction.guild.id } });
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
        const usernames = users.map(user => user.username).join(", ");
        await interaction.reply({ content: `Oe ctm los usuarios de la party ${name} son: ${usernames}`, ephemeral: true });
    }
};