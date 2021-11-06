import catchAsync from '@helpers/catchAsync'
import { sign } from '@helpers/jwt.helper'
import * as UsersService from '@services/users.service'
import axios, { AxiosResponse } from 'axios'
import createError from 'http-errors'

const GOOGLE_API_URL = 'https://www.googleapis.com/oauth2/v1/'
const GITHUB_API_URL = 'https://api.github.com/'

export const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const alreadyExists = await UsersService.find({
        _id: id,
    })

    if (!alreadyExists) {
        return next(
            createError(404, 'User not found', {
                expose: true,
            })
        )
    }

    return res.status(200).json({
        status: 'success',
        message: 'User Found',
        result: {
            user: alreadyExists,
        },
    })
})

export const githubAuth = catchAsync(async (req, res, _next) => {
    const fetchGithubUser: AxiosResponse<any> = await axios.get(
        `${GITHUB_API_URL}user`,
        {
            headers: { Authorization: `token ${req.body.accessToken}` },
        }
    )

    const { login, avatar_url, id, name, email } = fetchGithubUser.data

    const alreadyExists = await UsersService.find({
        provider: { name: 'github', id: id.toString() },
    })

    if (alreadyExists) {
        const access_token = UsersService.createAccessToken(alreadyExists)

        return res.status(200).json({
            status: 'success',
            message: 'User authenticated',
            result: {
                user: alreadyExists,
                access_token,
            },
        })
    }

    const { user, access_token } = await UsersService.create({
        username: login,
        avatar: avatar_url,
        email: email,
        name: name,
        provider: {
            name: 'github',
            id: id,
        },
        chat: null,
    })

    return res.status(200).json({
        status: 'success',
        message: 'New user created and Authenticated',
        result: {
            user,
            access_token,
        },
    })
})

export const googleAuth = catchAsync(async (req, res, _next) => {
    const fetchGoogleUser: AxiosResponse<any> = await axios.get(
        `${GOOGLE_API_URL}userinfo?alt=json&access_token=${req.body.accessToken}`
    )

    const { id, email, name, picture } = fetchGoogleUser.data

    const alreadyExists = await UsersService.find({
        provider: { name: 'google', id: id.toString() },
    })

    if (alreadyExists) {
        const access_token = UsersService.createAccessToken(alreadyExists)

        return res.status(200).json({
            status: 'success',
            message: 'User authenticated',
            result: {
                user: alreadyExists,
                access_token,
            },
        })
    }

    const { user, access_token } = await UsersService.create({
        username: name,
        avatar: picture,
        email: email,
        name: name,
        provider: {
            name: 'google',
            id: id,
        },
        chat: null,
    })

    return res.status(200).json({
        status: 'success',
        message: 'New user created and Authenticated',
        result: {
            user,
            access_token,
        },
    })
})
