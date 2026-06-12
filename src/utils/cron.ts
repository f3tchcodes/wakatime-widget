import cron from "node-cron";
import { updateAllWidgets } from "./updateAllWidgets.js";

export async function startWidgetSync() {
    cron.schedule("*/5 * * * *", async () => {
        await updateAllWidgets();
    });
}
