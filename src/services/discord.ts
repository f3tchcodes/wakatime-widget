import { 
    InteractionContextType, 
    SlashCommandBuilder, 
    MessageFlags,
    type ChatInputCommandInteraction, 
} from "discord.js";
import { db } from "#utils/db";
import type { RunResult } from "better-sqlite3";
import { wakatimeBaseUrl, discordBaseUrl } from "../index.js";

// building the slash command for wakatime API key
const widgetSetupData = new SlashCommandBuilder()
                .setName("widget-setup")
                .setDescription("Connect your WakaTime API key and start using the WakaTime widget!")
                .addStringOption(op => 
                    op
                        .setName("api-key")
                        .setDescription("Enter your WakaTime API key")
                        .setRequired(true)
                )
                .setContexts(
                    InteractionContextType.BotDM,
                    InteractionContextType.PrivateChannel,
                    InteractionContextType.Guild
                );

// slash command for entering the wakatime API key
export const widgetSetup = {
    data: widgetSetupData,
    async execute(interaction: ChatInputCommandInteraction) {
        // getting user id, api key and converting the api key into base64
        // because that's what wakatime expects
        const userID = interaction.user.id;
        const apiKey = interaction.options.getString("api-key", true);
        const apiKeyB64 = Buffer.from(apiKey, "utf-8").toString("base64");

        // sending request to the wakatime api to authenticate the user api key
        const apiCheckReq = await fetch(`${wakatimeBaseUrl}/api/v1/users/current/summaries?start=2026-06-11&end=2026-06-12`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${apiKeyB64}`
            }
        });
        const apiStatusCode = apiCheckReq.status;

        // if status code is 401, user is unauthenticated
        if (apiStatusCode === 401) return interaction.reply({
            content: "Invalid API key. User unauthorized!",
            flags: MessageFlags.Ephemeral
        });

        // if status code is not 200, there's some problem with the wakatime api
        if (apiStatusCode !== 200) return interaction.reply({
            content: "Invalid response received by the WakaTime API. Try again later.",
            flags: MessageFlags.Ephemeral
        });

        // if everything checks out we'll put the api key into our database
        const insertQuery = db.prepare(`
            INSERT INTO users
            (user_id, wt_key) VALUES
            (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
            wt_key = excluded.wt_key;
        `).run(userID, apiKeyB64) as RunResult;

        // if database query did not update anything, we let the user know
        if (insertQuery.changes < 1) return interaction.reply({
            content: "Could not update the database, contact developer for help.\nUsername: f3tch",
            flags: MessageFlags.Ephemeral
        });

        // if everything works, we let the user know the key has been added successfully
        return interaction.reply({
            content: `WakaTime key has been successfully added!
            
Because this is a hidden beta feature, in order to add the widget, you have to run this code in your console:
\`\`\`
let _mods=webpackChunkdiscord_app.push([[Symbol()],{},e=>e.c]);webpackChunkdiscord_app.pop();
let findByProps=(...e)=>{for(let t of Object.values(_mods))try{if(!t.exports||t.exports===window)continue;if(e.every(e=>t.exports?.[e]))return t.exports;for(let r in t.exports)if(e.every(e=>t.exports?.[r]?.[e])&&"IntlMessagesProxy"!==t.exports[r][Symbol.toStringTag])return t.exports[r]}catch{}};

api = findByProps("Bo", "Cu").Bo
async function addWidget(appId) {
    id = findByProps("getCurrentUser").getCurrentUser().id;
    current_widgets = (await api.get("/users/" + id + "/profile")).body.widgets
    if (current_widgets.map(x=>x.data?.application_id).includes(appId)) {return console.log("Already in your widgets — remove it via Discord client to re-add")}
    current_widgets.unshift({"data": {"type": "application","application_id": appId}})
    await api.put({url: "/users/@me/widgets",body:{widgets: current_widgets}})
}
// Usage
addWidget("${process.env.CLIENT_ID}")
\`\`\`

Thank you for using WakaTime Widget!`,
            flags: MessageFlags.Ephemeral
        });
    }
}

// updating stats of the widget via API
export async function widgetAPIUpdate(userID: string, wakatimeJSON: object) {
    try {
        const updateAPI = await fetch(`${discordBaseUrl}/api/v9/applications/${process.env.CLIENT_ID}/users/${userID}/identities/0/profile`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bot ${process.env.BOT_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(wakatimeJSON)
        });

        if (!updateAPI.ok) {
            const err = await updateAPI.text();
            console.error(`Failed status: ${updateAPI.status}\nFailed message: ${err}`);
        }

        return;
    } catch (err) {
        console.log(err);
    }
}
