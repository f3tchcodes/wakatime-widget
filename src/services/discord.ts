import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

const widgetSetup: SlashCommandBuilder = new SlashCommandBuilder()
                .setName("widget-setup")
                .setDescription("Connect your WakaTime API key and start using the WakaTime widget!");

export default {
    data: widgetSetup,
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply("hi")
    }
}
