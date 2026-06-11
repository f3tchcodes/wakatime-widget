import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (client: Client) => {
    console.log(`The app is ${client.user?.tag} running successfully!`)
});

client.login(process.env.DISCORD_BOT_TOKEN);