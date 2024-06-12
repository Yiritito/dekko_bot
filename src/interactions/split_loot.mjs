import { Colors, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Party from "../models/party.mjs";
import User from "../models/user.mjs";

export default {
    id: 'split_loot',
    execute: async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageEvents)) {
            await interaction.reply({ content: "No tienes permisos para dividir loot", ephemeral: true });
            return;
        }

        const gold = Number(interaction.fields.getTextInputValue("gold"));
        const comissionPercentage = Number(interaction.fields.getTextInputValue("comission")) || 5;

        if (isNaN(gold) || isNaN(comissionPercentage)) {
            await interaction.reply({ content: "Ingresa un número válido", ephemeral: true });
            return;
        }

        const messageId = interaction.message.id;
        const party = await Party.findOne({ where: { messageId } });
        if( !party ) {
            await interaction.reply({ content: "Oe ctm este error no es normal.\nAbre Ticket", ephemeral: true });
            return;
        }

        const users = await User.findAll({
            include: [{
                model: Party,
                where: { messageId },
                through: {
                    where: {
                        type: "JOINED"
                    }
                }
            }]
        });
        const comission = gold * (comissionPercentage / 100);
        const goldPerUser = (gold - comission) / users.length;
        const usernames = users.map(user => user.username).join("\n* ");

        const embed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle("Repartición de Loot")
            .setDescription(`Party **${party.name}** Finalizada.\nLe tocan $${goldPerUser} a los jugadores:\n* ${usernames}`)
            .setTimestamp();

        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: `Tu comisión es de $${comission}`, ephemeral: true });

        await party.removeUsers(users);
        await party.destroy();
        interaction.message.delete();
    }
};