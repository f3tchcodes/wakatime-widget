# wakatime-widget
WakaTime Widget is a Discord widget for displaying your WakaTime coding stats on your profile.

## Screenshot
<img width="1303" height="1016" alt="Screenshot 2026-06-12 233952" src="https://github.com/user-attachments/assets/8ebbf2f9-f2f1-4aaa-9ff3-9ff8725b813a" />

## Usage
Previously users could deploy custom widgets to their profile by authorizing their account with a pre-hosted app instance and running the commands themselves. However, due to recent updates and restrictions in the Discord API, users can no longer activate a custom widget if they are not the explicit owner of the underlying developer application. To bypass this restriction, you must create your own client application and host this repository's codebase locally or on a private server.

Here is the guide on how to setup your own app and widget: [https://chloecinders.com/blog/discord-widgets](https://chloecinders.com/blog/discord-widgets)

**Note:** You will have to manually map your dynamic text fields and structure the widget inside the Discord Developer Portal. I'll provide a sample data in JSON that you could use to create text fields.
 
### Sample Data JSON
```
{
  "username": "f3tch",
  "data": {
    "dynamic": [
      {
        "type": 1,
        "name": "most_used_editor",
        "value": "Visual Studio Code"
      },
      {
        "type": 1,
        "name": "total_time",
        "value": "95 hrs 32 mins"
      },
      {
        "type": 1,
        "name": "daily_average",
        "value": "4 hrs 45 mins"
      },
      {
        "type": 1,
        "name": "hireable",
        "value": "Hireable"
      },
      {
        "type": 1,
        "name": "most_used_language",
        "value": "TypeScript"
      },
      {
        "type": 1,
        "name": "last_week_time",
        "value": "14 hrs 16 mins"
      },
      {
        "type": 1,
        "name": "today_time",
        "value": "7 hrs 50 mins"
      },
      {
        "type": 1,
        "name": "joined_date",
        "value": "Feb 6th 2026"
      }
    ]
  }
}
```

## Bugs/Issues
You can either directly open an issue from GitHub or contact me on Discord to report a bug.

Discord: f3tch

## Credits and Goodbye
Huge thanks to chloe for writing an amazing detailed blog on how to create discord widgets, and other people at Discord Previews server for figuring everything out regarding discord widgets before the official API and method!

Thank you for using WakaTime widget!
