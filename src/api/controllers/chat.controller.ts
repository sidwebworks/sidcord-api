import catchAsync from '@helpers/catchAsync'
import {
    addChannel,
    createChatServer,
    findAll,
    findById,
    getAllMessages,
    sendMessage,
} from '@services/chat.service'
import { joinServer } from '@services/users.service'
import createHttpError from 'http-errors'
import { Server, Socket } from 'socket.io'
import { ChatServer } from 'typings/interfaces/chat'
import { AuthenticatedReq } from 'typings/interfaces/express'

export const chatController = (
    client: Socket,
    io: Server,
    server: ChatServer
) => {
    const user = client.handshake.auth

    client.broadcast.emit('message', `${user.name} just hopped in the chat!`)

    if (server?.channels) {
        server.channels.forEach((channel) => {
            console.log('channel: ', channel)
            client.join(channel.id)
        })
    }

    client.on('send-message', async (data) => {
        const message = {
            body: data.message,
            conversation_id: data.meta.conversation_id,
            sender: {
                name: user.name,
                id: user._id,
                avatar: user.avatar,
            },
        }

        const target = data.meta.target

        console.log('target: ', target)

        const msg = await sendMessage(message)

        io.of(server.endpoint).to(target).emit('chat-signal:create', msg)
    })

    // client.on('delete-message', async (data) => {
    //     const message = {
    //         body: data.message,
    //         conversation_id: data.meta.conversation_id,
    //         sender: {
    //             name: user.name,
    //             id: user._id,
    //             avatar: user.avatar,
    //         },
    //     }

    //     const target = data.meta.target

    //     console.log('target: ', target)

    //     const msg = await sendMessage(message)

    //     io.of(server.endpoint).to(target).emit('chat-signal:create', msg)
    // })
}

export const getAllServerChat = catchAsync(async (req, res, next) => {
    const { id } = req.params

    if (!id) {
        return next(
            createHttpError('Please provide an conversation id.', 401, {
                expose: true,
            })
        )
    }

    const messages = await getAllMessages(id)

    res.status(200).json(messages)
})

export const getServerById = catchAsync(async (req, res, _next) => {
    const result = await findById(req.params.id)

    res.status(200).json(result)
})

export const createNewServer = catchAsync(
    async (req: AuthenticatedReq, res, next) => {
        const user = req.user!

        const server = await createChatServer({
            admin: user._id!,
            endpoint: '/web-dev',
            image: 'https://jwt.io/img/pic_logo.svg',
            title: 'The Web Developers',
        })

        await addChannel({
            serverNsp: server.endpoint,
            channel: {
                title: 'default',
                isPrivate: false,
            },
            user: user,
        })

        await joinServer({ id: user._id, server })

        res.status(200).send('okay')
    }
)

export const getAllServers = catchAsync(async (req, res, _next) => {
    const results = (await findAll()) || []

    res.status(200).json(results)
})

export const getAllDirectChat = catchAsync(async (req, res, _next) => {})
