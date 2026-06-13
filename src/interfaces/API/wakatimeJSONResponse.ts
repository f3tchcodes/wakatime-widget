export interface WakatimeJSONDynamic {
    type: number,
    name: string,
    value: string
}

export interface WakatimeJSONResponseAPI {
    username: string,
    data: {
        dynamic: WakatimeJSONDynamic[]
    }
}
