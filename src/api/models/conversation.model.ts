import { model, Mongoose, ObjectId, Schema } from 'mongoose'
import { ChatConversation } from 'typings/interfaces/chat'

const schema = new Schema<ChatConversation>(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],

        conversation_type: {
            type: String,
        },
    },
    { timestamps: true }
)

const ConversationModel = model<ChatConversation>('Conversation', schema)

export default ConversationModel
