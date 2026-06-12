import { 
    InteractionContextType, 
    SlashCommandBuilder, 
    MessageFlags,
    type ChatInputCommandInteraction, 
} from "discord.js";
import { db } from "#utils/db";
import type { RunResult } from "better-sqlite3";

const widgetSetup = new SlashCommandBuilder()
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

export default {
    data: widgetSetup,
    async execute(interaction: ChatInputCommandInteraction) {
        const userID = interaction.user.id;
        const apiKey = interaction.options.getString("api-key", true);
        const apiKeyB64 = Buffer.from(apiKey, "utf-8").toString("base64");

        const insertQuery = db.prepare(`
            INSERT INTO users
            (user_id, wt_key) VALUES
            (?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
            wt_key = excluded.wt_key;
        `).run(userID, apiKeyB64) as RunResult;

        if (insertQuery.changes < 1) return interaction.reply({
            content: "Could not update the database, contact developer for help.\nUsername: f3tch",
            flags: MessageFlags.Ephemeral
        });

        return interaction.reply({
            content: `WakaTime key has been successfully added!`,
            flags: MessageFlags.Ephemeral
        });
    }
}
