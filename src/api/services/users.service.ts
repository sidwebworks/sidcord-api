import UserModel from '@models/user.model'
import type { User } from 'typings/interfaces/auth'
import { sign } from '@helpers/jwt.helper'
import createHttpError from 'http-errors'
import logger from '@config/logger'

export const createAccessToken = (data) => {
    return sign({
        _id: data._id,
        name: data.name,
        username: data.username,
        email: data.email,
    })
}

export const create = async (oauth_user: User) => {
    const user = new UserModel({
        avatar: oauth_user.avatar,
        email: oauth_user.email,
        name: oauth_user.name,
        provider: oauth_user.provider,
        username: oauth_user.username,
        chat: oauth_user.chat,
    })

    const newUser = await user.save()

    const access_token = createAccessToken(newUser)

    return { user: newUser, access_token }
}

export const find = async (query: any) => {
    const results = await UserModel.find(query).limit(1)

    if (results.length < 1) {
        return false
    }

    return results[0]
}

export const update = async ({ id }) => {
    const user = await UserModel.findById(id)
}

export const joinServer = async ({ id, server }) => {
    const user = await UserModel.findById(id)

    if (!user) {
        logger.error(`USER_SERVICE: Join Server, No user found`)
        throw createHttpError('User not found', 404, { expose: true })
    }

    user.chat!.joined_servers.push(server._id)

    await user.save()

    return user
}
