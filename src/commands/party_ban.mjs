import Party from "../models/party.mjs";
import UserParty from "../models/userParty.mjs";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("partyban")
        .setDescription("Banea un usuario de la party")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("party")
                .setDescription("The party to ban the user from")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    execute: async (interaction) => {
        const user = interaction.options.getUser("user");
        const name = interaction.options.getString("party");

        const party = await Party.findOne({ where: { name } });
        if (!party) {
            await interaction.reply({ content: "Oe ctm esa party no existe", ephemeral: true });
            return;
        }

        let userParty = await UserParty.findOne({ where: { userId: user.id, partyId: party.id }});
        if (!userParty)
            userParty = await UserParty.create({ userId: user.id, partyId: party.id, type: "BANNED"});
        else {
            userParty.type = "BANNED";
            await userParty.save();
        }
        await interaction.reply({ content: "Oe ctm banneado", ephemeral: true });
    }
};