import "dotenv";
import { Client, Events } from "discord.js";

const client = new Client({
    intents: 0
});

client.once(Events.ClientReady, (client: Client) => {
    console.log(`The bot is ${client.user?.tag} running successfully!`)
});

client.login(process.env.DISCORD_BOT_TOKEN);