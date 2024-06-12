import { SlashCommandBuilder } from "discord.js";
import Party from "../models/party.mjs";
import User from "../models/user.mjs";
import UserParty from "../models/userParty.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("partyunban")
        .setDescription("Desbanea a un usuario de una party")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("The user to unban")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("party")
                .setDescription("The party to unban the user from")
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const discordUser = interaction.options.getUser("user");
        const name = interaction.options.getString("party");

        const party = await Party.findOne({ where: { name, guildId: interaction.guild.id } });
        if (!party) {
            await interaction.reply({ content: "Oe ctm esa party no existe", ephemeral: true });
            return;
        }

        let user = await User.findOne({ where: { discordId: discordUser.id } });
        if (!user)
            user = await User.create({ discordId: discordUser.id, username: discordUser.username });

        let userParty = await UserParty.findOne({ where: { userId: user.id, partyId: party.id }});
        if (!userParty || userParty.type != "BANNED") {
            await interaction.reply({ content: "Oe ctm ese usuario no esta baneado", ephemeral: true });
            return;
        }

        party.removeUser(user);
        await interaction.reply({ content: "Oe ctm desbaneado", ephemeral: true });
    }
};