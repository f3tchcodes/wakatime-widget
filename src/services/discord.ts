import { InteractionContextType, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

const widgetSetup: SlashCommandBuilder = new SlashCommandBuilder()
                .setName("widget-setup")
                .setDescription("Connect your WakaTime API key and start using the WakaTime widget!")
                .setContexts(
                    InteractionContextType.BotDM,
                    InteractionContextType.PrivateChannel,
                    InteractionContextType.Guild
                );

export default {
    data: widgetSetup,
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply("hi")
    }
}
