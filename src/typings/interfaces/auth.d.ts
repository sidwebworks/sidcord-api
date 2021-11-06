export interface User {
    username: string
    _id?: string
    avatar: string
    email: string | null
    name: string
    provider: {
        name: string
        id: number | string
    }
    chat: null | {
        joined_servers: any[]
        current_server: string
        friends: any[]
    }
}
