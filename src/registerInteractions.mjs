import { Collection } from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let interactionsCollection = new Collection();

const INTERACTIONS_PATH = path.join(__dirname, "interactions");
const INTERACTIONS_FILES = fs.readdirSync(INTERACTIONS_PATH).filter(f => f.endsWith(".mjs"));

const searchInteractions = async () => {
    for(let file of INTERACTIONS_FILES) {
        let filePath = path.join(INTERACTIONS_PATH, file);
        filePath = pathToFileURL(filePath).href;
        let interaction = (await import(filePath)).default;

        interactionsCollection.set(interaction.id, interaction);
    }
};

searchInteractions()

export default interactionsCollection;