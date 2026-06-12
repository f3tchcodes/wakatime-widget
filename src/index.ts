import "dotenv/config";
import "#utils/db";
import { 
    Client, 
    Events, 
    GatewayIntentBits,
    MessageFlags,
    REST,
    Routes,
    type Interaction
} from "discord.js";
import { widgetSetup, widgetAPIUpdate } from "#services/discord";
import { fetchUserJSONData } from "#services/wakatime";
import config from "#config/config" with { type: "json" };
import { type Users } from "#interfaces/users";

export const wakatimeBaseUrl = config.wakatimeBaseUrl.endsWith('/') ? config.wakatimeBaseUrl.slice(0, -1) : config.wakatimeBaseUrl;
export const discordBaseUrl = config.discordBaseUrl.endsWith('/') ? config.discordBaseUrl.slice(0, -1) : config.discordBaseUrl;

// connecting to the client with default intents
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// initiating rest and updating slash commands
const rest = new REST({version: "10"}).setToken(process.env.BOT_TOKEN!);

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
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === widgetSetup.data.name) await widgetSetup.execute(interaction);
    } catch (err) {
        interaction.reply({
            content: "Error occured running your command, contact developer for help.\nUsername: f3tch",
            flags: MessageFlags.Ephemeral
        })
        return console.log(err);
    }
});

client.login(process.env.BOT_TOKEN)
