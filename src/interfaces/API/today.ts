export interface TodayAPICat {
    text: string;
}

export interface TodayAPI {
    data: {
        categories: TodayAPICat[];
    }
}
