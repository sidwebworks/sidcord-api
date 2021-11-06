import { model, Mongoose, ObjectId, Schema } from 'mongoose'
import { ChatServer } from 'typings/interfaces/chat'

const schema = new Schema<ChatServer>({
    title: {
        type: String,
        required: true,
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    endpoint: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    channels: [
        {
            type: Object,
        },
    ],
})

const ServerModel = model<ChatServer>('ChatServer', schema)

ServerModel.ensureIndexes()

export default ServerModel
