process.on('uncaughtException', (err) => {
    console.log(
        `Uncaught exception: ${err.name} ${err.message}, ${err.stack} , shutting down...`
    )
    process.exit(1)
})

//! THIS IS REQUIRED FOR MODULE ALIASES TO WORK.
import './config'
import 'module-alias/register'
//! THIS IS REQUIRED FOR MODULE ALIASES TO WORK.

import connectMongo from '@config/loaders/mongoose.loader'
import logger from '@config/logger'
import { chatController } from '@controllers/chat.controller'
import http from 'http'
import { Server, Socket } from 'socket.io'
import app from './api/app'
import { findAll } from '@services/chat.service'

const server = http.createServer(app)

process.on('unhandledRejection', (err: Error) => {
    console.log(
        `Unhandled Rejection: ${err.name} ${err.message} , shutting down...`
    )
    server.close(() => {
        process.exit(1)
    })
})

const main = async function () {
    const PORT = process.env.PORT || 3000

    await connectMongo()

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    })

    await setupServers(io)

    server.listen(PORT, () => {
        logger.debug(`Server started at ${PORT}`)
    })
}

main()

export const setupServers = async (io: Server) => {
    /**
     * Load and listen for all existing servers
     * when server starts.
     */
    const servers = await findAll()

    if (servers) {
        servers.forEach((server) => {
            io.of(server.endpoint).on('connection', (socket) => {
                // Send the incoming socket to the chat controller
                chatController(socket, io, server)
            })
        })
    }

    /**
     * If any client creates a new server, listen for it
     * and update all clients to invalidate their cache
     */
    io.on('server-created', (server) => {
        io.of(server.endpoint).on('connection', (socket) =>
            chatController(socket, io, server)
        )

        io.emit('reload-servers', 'New server has been added.')
    })

   
}
