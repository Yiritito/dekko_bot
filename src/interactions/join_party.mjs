import User from "../models/user.mjs";
import Party from "../models/party.mjs";
import UserParty from "../models/userParty.mjs";

export default {
    id: "join_party",
    execute: async (interaction) => {
        const messageId = interaction.message.id;
        const party = await Party.findOne({ where: { messageId } });
        if (!party) {
            await interaction.reply({ content: "Oe ctm este error no es normal, reportalo con un admin", ephemeral: true });
            return;
        }
        let user = await User.findOne({ where: { discordId: interaction.user.id } });
        if (!user)
            user = await User.create({ discordId: interaction.user.id, username: interaction.user.username });

        const userParty = await UserParty.findOne({ where: { userId: user.id, partyId: party.id } });
        if (userParty) {
            if (userParty.type === "BANNED")
                await interaction.reply({ content: "Oe ctm estás baneado de esta party", ephemeral: true });
            else
                await interaction.reply({ content: "Oe ctm ya te habias unido", ephemeral: true });
            return;
        }

        await UserParty.create({ userId: user.id, partyId: party.id, type: "JOINED"});
        await interaction.reply({ content: "Oe ctm te uniste", ephemeral: true });
    }
}