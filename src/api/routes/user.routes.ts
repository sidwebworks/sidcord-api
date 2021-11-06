import { checkAuth } from '@middlewares/auth.middleware'
import { Router } from 'express'
import {
    githubAuth,
    googleAuth,
    getUserById,
} from '../controllers/users.controller'

const userRouter = Router()

userRouter.post('/google', googleAuth) // Google Authentication

userRouter.post('/github', githubAuth) // Github Authentication

userRouter.get('/:id', checkAuth, getUserById) // Get user by `id`


export default userRouter
