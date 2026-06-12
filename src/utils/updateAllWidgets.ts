import { db } from "#utils/db";
import { widgetAPIUpdate } from "#services/discord";
import { fetchUserJSONData } from "#services/wakatime";
import type { Users } from "#interfaces/users";

// function to update all widgets
export async function updateAllWidgets() {
    // fetch all users
    const users = db.prepare("SELECT * FROM users").all() as Users[];

    // updating stats via API
    for (const user of users) {
        try {
            const wakatimeJSONPayload = await fetchUserJSONData(user.user_id);
            await widgetAPIUpdate(user.user_id, wakatimeJSONPayload);
        } catch (err) {
            console.error(`Not updated: ${user.user_id}\nError: ${err}`);
        }
    }
}
