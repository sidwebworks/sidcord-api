import { Document, Schema } from 'mongoose'
import { User } from './auth'

export interface ChatServer {
    _id?: string
    title: string
    endpoint: string
    image: string
    admin: string | Schema.Types.ObjectId
    channels?: any[]
}

export interface ChatChannel {
    id: string
    namespace: string
    title: string
    isPrivate: boolean
    conversation_id: string
}

export interface ChatMessage {
    conversation_id: string
    sender: {
        name: string
        id: string
        avatar: string
    }
    body: string
}

export interface ChatConversation {
    participants: string[]
    conversation_type: string
}
