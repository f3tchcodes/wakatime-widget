import { wakatimeBaseUrl } from "../index.js";
import { db } from "#utils/db";
import type { UserAPI } from "#interfaces/API/user";
import type { Users } from "#interfaces/users";
import type { TodayAPI } from "#interfaces/API/today";
import type { Last7Days } from "#interfaces/API/last7days";
import type { AllTime } from "#interfaces/API/allTime";
import type { WakatimeJSONResponseAPI } from "#interfaces/API/wakatimeJSONResponse";

export async function fetchUserJSONData(userID: string): Promise<WakatimeJSONResponseAPI> {
    const userObj = db.prepare("SELECT * FROM users WHERE user_id = ?").get(userID) as Users;
    const apiKeyB64 = userObj.wt_key;

    const [allTimeReq, last7DaysReq, todayReq, userReq] = await Promise.all([
        fetch(`${wakatimeBaseUrl}/api/v1/users/current/all_time_since_today`, {
            headers: {
                "Authorization": `Basic ${apiKeyB64}`
            }
        }),
        fetch(`${wakatimeBaseUrl}/api/v1/users/current/stats/last_7_days`, {
            headers: {
                "Authorization": `Basic ${apiKeyB64}`
            }
        }),
        fetch(`${wakatimeBaseUrl}/api/v1/users/current/status_bar/today`, {
            headers: {
                "Authorization": `Basic ${apiKeyB64}`
            }
        }),
        fetch(`${wakatimeBaseUrl}/api/v1/users/current`, {
            headers: {
                "Authorization": `Basic ${apiKeyB64}`
            }
        })
    ]);

    if (!allTimeReq.ok || !last7DaysReq.ok || !todayReq.ok) {
        throw new Error("One or more WakaTime endpoints failed to respond.");
    }

    const allTime = (await allTimeReq.json()) as AllTime;
    const last7Days = (await last7DaysReq.json()) as Last7Days;
    const today = (await todayReq.json()) as TodayAPI;
    const user = (await userReq.json()) as UserAPI;

    return {
        "username": user.data.username,
        "data": {
            "dynamic": [
                {
                    "type": 1,
                    "name": "most_used_editor",
                    "value": last7Days.data.editors[0]?.name || "None"
                },
                {
                    "type": 1,
                    "name": "total_time",
                    "value": allTime.data.text || "0 secs"
                },
                {
                    "type": 1,
                    "name": "daily_average",
                    "value": last7Days.data.human_readable_daily_average_including_other_language || "0 secs"
                },
                {
                    "type": 1,
                    "name": "hireable",
                    "value": user.data.is_hireable ? "Hireable" : "Not hireable"
                },
                {
                    "type": 1,
                    "name": "joined_date",
                    "value": allTime.data.range.start_text.split(" ").slice(1).join(" ") || allTime.data.range.start_text || "Unknown"
                },
                {
                    "type": 1,
                    "name": "most_used_language",
                    "value": last7Days.data.languages[0]?.name || "None"
                },
                {
                    "type": 1,
                    "name": "last_week_time",
                    "value": last7Days.data.human_readable_total || "0 secs"
                },
                {
                    "type": 1,
                    "name": "today_time",
                    "value": today.data.categories[0]?.text || "0 secs"
                }
            ]
        }
    }
}
