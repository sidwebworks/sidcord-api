import { model, Mongoose, ObjectId, Schema } from 'mongoose'
import { ChatMessage } from 'typings/interfaces/chat'

const schema = new Schema<ChatMessage>(
    {
        conversation_id: {
            type: String,
        },
        sender: {
            name: {
                type: String,
            },
            id: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            avatar: {
                type: String,
            },
        },
        body: {
            type: String,
        },
    },
    { timestamps: true }
)

const MessageModel = model<ChatMessage>('Message', schema)

export default MessageModel
