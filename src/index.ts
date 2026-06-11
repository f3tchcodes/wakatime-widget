import "dotenv/config";
import { 
    Client, 
    Events, 
    GatewayIntentBits,
    REST,
    Routes,
    type Interaction
} from "discord.js";
import widgetSetup from "#services/discord";

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (client: Client) => {
    console.log(`The app is ${client.user?.tag} running successfully!`)
});

client.once(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === widgetSetup.data.name) {
        await widgetSetup.execute(interaction);
    }
});

client.login(process.env.BOT_TOKEN);
