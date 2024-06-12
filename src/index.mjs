import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import commandsCollection from "./registerCommands.mjs";
import interactionsCollection from "./registerInteractions.mjs";
import registerEvents from "./registerEvents.mjs";

config();
const { TOKEN } = process.env;

// New client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = commandsCollection;
client.interactions = interactionsCollection;
registerEvents(client);

client.login(TOKEN);