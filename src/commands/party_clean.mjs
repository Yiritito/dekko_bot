import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Party from "../models/party.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("partyclean")
        .setDescription("Cleans the partys database")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
    execute: async (interaction) => {
        const parties = await Party.findAll({ where: { guildId: interaction.guild.id }});

        parties.forEach(async party => {
            const message = await interaction.client.guilds.cache.get(party.guildId).channels.cache.get(party.channelId).messages.fetch(party.messageId);
            await message.delete();
            await party.removeUsers();
            await party.destroy();
        });

        await interaction.reply({ content: "Parties cleaned", ephemeral: true });
    }
}