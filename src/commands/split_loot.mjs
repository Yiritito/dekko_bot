import { Colors, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
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
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
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
        const usernames = users.map(user => user.username).join("\n* ");

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("Repartición de Loot")
            .setDescription(`Le tocan $${goldPerUser} a los jugadores:\n* ${usernames}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};