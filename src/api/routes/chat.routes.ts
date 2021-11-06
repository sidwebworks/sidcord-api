import {
    getAllServerChat,
    getAllDirectChat,
    getServerById,
    createNewServer,
    getAllServers,
} from '@controllers/chat.controller'

import { checkAuth } from '@middlewares/auth.middleware'
import { Router } from 'express'

const chatRouter = Router()

chatRouter.post('/servers', checkAuth, createNewServer) // create a new server

chatRouter.get('/servers', checkAuth, getAllServers) // get all servers

chatRouter.get('/servers/:id', checkAuth, getServerById) // get server by id

// chatRouter.get('/messages/direct/:id', checkAuth, getAllDirectChat) // Get all chat messages of a direct chat by id

chatRouter.get('/messages/:id', checkAuth, getAllServerChat) // Get all chat messages of a channel chat by id

export default chatRouter
