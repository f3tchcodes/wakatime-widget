export interface Last7DaysEditors {
    name: string;
}

export interface Last7DaysLanguages {
    name: string;
}

export interface Last7Days {
    data: {
        human_readable_total: string;
        human_readable_daily_average_including_other_language: string;
        editors: Last7DaysEditors[];
        languages: Last7DaysLanguages[];
    }
}
