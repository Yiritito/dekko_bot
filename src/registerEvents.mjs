import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EVENTS_PATH = path.join(__dirname, "events");
const EVENTS_FILES = fs.readdirSync(EVENTS_PATH).filter(f => f.endsWith(".mjs"));

export default (client) => {
    EVENTS_FILES.forEach(async file => {
        let filePath = path.join(EVENTS_PATH, file);
        filePath = pathToFileURL(filePath).href;
        let event = (await import(filePath)).default;

        if (event.once)
            client.once(event.name, (...args) => event.execute(...args, client));
        else
            client.on(event.name, (...args) => event.execute(...args, client));
    })
}