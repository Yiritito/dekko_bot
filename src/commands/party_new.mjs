import Party from "../models/party.mjs";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("partynew")
        .setDescription("Create a new party")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the party")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("The channel to create the party in")
                .setRequired(false)
        ),
    execute: async (interaction) => {
        const name = interaction.options.getString("name");
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        const embed = new EmbedBuilder()
            .setTitle(`Party: **${name}**`)
            .setDescription(
                "¡Se ha creado una nueva party!\n"
                + "Haz click en el botón para unirte a la party.\n"
                + "¿O eres culo?"
            )
            .setColor(Colors.Green);
        
        const button = new ButtonBuilder()
            .setLabel("Me uno pe causa")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("join_party");
        
        const row = new ActionRowBuilder().addComponents(button);

        const message = await channel.send({ embeds: [embed], components: [row]});

        const party = await Party.create({
            name,
            messageId: message.id,
        });

        if (!party) {
            await interaction.reply({ content: "An error occurred while creating the party", ephemeral: true });
            await message.delete();
            return;
        }
        await interaction.reply({ content: "Party created!", ephemeral: true });
    }
};