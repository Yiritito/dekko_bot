import { ActionRowBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from "discord.js"

export default {
    id: 'split_modal',
    execute: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
            await interaction.reply({ content: "No tienes permisos para dividir loot", ephemeral: true });
            return;
        }

        const modal = new ModalBuilder()
            .setTitle("Dividir Loot")
            .setCustomId("split_loot");
        
        const loot = new TextInputBuilder()
            .setCustomId("gold")
            .setLabel("Oro")
            .setPlaceholder("Ingresa el oro que ganaron csm")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        const comission = new TextInputBuilder()
            .setCustomId("comission")
            .setLabel("Comisión")
            .setPlaceholder("Ingresa la comisión del líder")
            .setRequired(true)
            .setValue("5")
            .setStyle(TextInputStyle.Short);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(loot),
            new ActionRowBuilder().addComponents(comission)
        )

        await interaction.showModal(modal);
    }
}