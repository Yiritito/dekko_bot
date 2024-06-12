import { Events } from "discord.js";

export default {
    name: Events.InteractionCreate,
    execute: async (interaction) => {
        if ( interaction.isChatInputCommand() ) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`Command not found: ${interaction.commandName}`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing command: ${interaction.commandName}`);
                console.error(error);
            }
        } else {
            const interactionHandler = interaction.client.interactions.get(interaction.customId);
            if (!interactionHandler) {
                console.error(`Interaction not found: ${interaction.customId}`);
                return;
            }

            try {
                await interactionHandler.execute(interaction);
            } catch (error) {
                console.error(`Error executing interaction: ${interaction.customId}`);
                console.error(error);
            }
        }
    }
};