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

// connecting to the client with default intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// initiating rest
const rest = new REST({version: "10"}).setToken(process.env.BOT_TOKEN!);

// updating slash commands
await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID!),
    {
        body: [widgetSetup.data.toJSON()]
    }
)

// client ready event
client.once(Events.ClientReady, (client: Client) => {
    console.log(`The app is ${client.user?.tag} running successfully!`)
});

// interaction event
client.once(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === widgetSetup.data.name) {
        await widgetSetup.execute(interaction);
    }
});

client.login(process.env.BOT_TOKEN);
