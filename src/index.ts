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
import config from "#config/config" with { type: "json" };

export const wakatimeBaseUrl = config.wakatimeBaseUrl.endsWith('/') ? config.wakatimeBaseUrl.slice(0, -1) : config.wakatimeBaseUrl;
export const discordBaseUrl = config.discordBaseUrl.endsWith('/') ? config.discordBaseUrl.slice(0, -1) : config.discordBaseUrl;

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

const wakatimeJSONPayload = {
    username: "@f3tch", 
    data: {
        dynamic: [
            {
                type: 1,
                name: "wakatime_handle",
                value: "@f3tch"
            },
            {
                type: 1,
                name: "hireable",
                value: "hireable"
            },
            {
                type: 1,
                name: "total_time",
                value: "2 hrs 2 mins"
            },
            {
                type: 1,
                name: "daily_average",
                value: "2 hrs 2 mins"
            },
            {
                type: 1,
                name: "today_time",
                value: "2 hrs 2 mins"
            },
            {
                type: 1,
                name: "last_week_time",
                value: "2 hrs 2 mins"
            },
            {
                type: 1,
                name: "most_used_editor",
                value: "Visual Studio Code"
            },
            {
                type: 1,
                name: "most_used_language",
                value: "TypeScript"
            }
        ]
    }
};

// updating stats via API
await widgetAPIUpdate(wakatimeJSONPayload);

client.login(process.env.BOT_TOKEN)
