export type User = {
    username: string
    _id?: string,
    avatar: string
    email: string | null
    name: string
    provider: {
        name: string
        id: number | string
    }
}
