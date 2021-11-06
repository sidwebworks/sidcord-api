import ServerModel from '@models/server.model'
import createHttpError from 'http-errors'
import { ChatServer } from 'typings/interfaces/chat'
import nanoid from 'nano-id'
import ConversationModel from '@models/conversation.model'
import MessageModel from '@models/message.model'

export const createChatServer = async (data: ChatServer) => {
    const { title, endpoint, image, admin, channels } = data

    const server = new ServerModel({
        title,
        endpoint,
        image,
        admin,
        channels,
    })

    return await server.save()
}

export const sendMessage = async (data) => {
    const message = new MessageModel({
        body: data.body,
        conversation_id: data.conversation_id,
        sender: data.sender,
    })

    await message.save()

    return message
}

export const findAll = async (query: any = {}) => {
    const results = await ServerModel.find(query)

    if (results.length < 1) {
        return false
    }

    return results
}

export const findById = async (id: string) => {
    const results = await ServerModel.findById(id)

    return results
}

export const addChannel = async ({ serverNsp, channel, user }) => {
    // Find a server with matching namespace
    const serverToUpdate = await ServerModel.findOne({
        namespace: serverNsp,
    })

    if (!serverToUpdate) {
        throw createHttpError(
            `Cannot find the requested server "${serverNsp}"`,
            404,
            { expose: true }
        )
    }

    // Create a new conversation
    const newConversation = new ConversationModel({
        participants: [user._id],
        conversation_type: 'channel',
    })

    // Create a new Channel
    const newChannel = {
        id: nanoid(),
        namespace: serverNsp,
        title: channel.title,
        isPrivate: channel.isPrivate,
        conversation_id: newConversation._id,
    }

    // Add then new channel to the server
    serverToUpdate.channels!.push(newChannel)

    await newConversation.save()

    await serverToUpdate.save()

    return newChannel
}

export const getAllMessages = async (conversationId: string) => {
    const results = await MessageModel.find({
        conversation_id: conversationId,
    })

    console.log(results)

    return results
}
