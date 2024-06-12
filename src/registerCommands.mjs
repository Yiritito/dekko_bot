import { config } from "dotenv";
import { Collection, Routes, REST } from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

config();

const { CLIENT_ID, TOKEN } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let commands = [];
let commandsCollection = new Collection();

// Grab all the command files from the commands directory
const COMMANDS_PATH = path.join(__dirname, "commands");
const COMMANDS_FILES = fs.readdirSync(COMMANDS_PATH).filter(f => f.endsWith(".mjs"));

const searchCommands = async () => {
    for(let file of COMMANDS_FILES) {
        let filePath = path.join(COMMANDS_PATH, file);
        filePath = pathToFileURL(filePath).href;
        let command = (await import(filePath)).default;
    
        // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
        commands.push(command.data.toJSON());
        // Set a new item in the Collection with the key as the command name and the value as the exported value
        commandsCollection.set(command.data.name, command);
    }
};

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(TOKEN);

// Deploy the commands!
searchCommands().then(async () => {
    try {
        console.log("Started refreshing application (/) commands.");

        // The put method is used to fully refresh all commands with the current set
        let data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log(`Successfully reloaded application (/) commands. ${data.length} commands were found.`);
    } catch (error) {
        console.error(error);
    }
});

export default commandsCollection;