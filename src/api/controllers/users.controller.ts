import catchAsync from '@helpers/catchAsync'
import UserModel from '@models/user.model'
import UsersService from '@services/users.service'
import axios, { AxiosResponse } from 'axios'
import createError from 'http-errors'

const GOOGLE_API_URL = 'https://www.googleapis.com/oauth2/v1/'
const GITHUB_API_URL = 'https://api.github.com/'

const ServiceInstance = new UsersService({ User: UserModel })

export const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const alreadyExists = await ServiceInstance.find({
        _id: id,
    })

    if (!alreadyExists) {
        return next(
            createError(404, 'User not found', {
                expose: true,
            })
        )
    }

    const access_token = ServiceInstance.signToken(alreadyExists)

    return res.status(200).json({
        status: 'success',
        message: 'User Found',
        result: {
            user: alreadyExists,
            access_token,
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

    const alreadyExists = await ServiceInstance.find({
        provider: { name: 'github', id: id.toString() },
    })

    if (alreadyExists) {
        const access_token = ServiceInstance.signToken(alreadyExists)

        return res.status(200).json({
            status: 'success',
            message: 'User authenticated',
            result: {
                user: alreadyExists,
                access_token,
            },
        })
    }

    const { user, access_token } = await ServiceInstance.create({
        username: login,
        avatar: avatar_url,
        email: email,
        name: name,
        provider: {
            name: 'github',
            id: id,
        },
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

    const alreadyExists = await ServiceInstance.find({
        provider: { name: 'google', id: id.toString() },
    })

    if (alreadyExists) {
        const access_token = ServiceInstance.signToken(alreadyExists)

        return res.status(200).json({
            status: 'success',
            message: 'User authenticated',
            result: {
                user: alreadyExists,
                access_token,
            },
        })
    }

    const { user, access_token } = await ServiceInstance.create({
        username: name,
        avatar: picture,
        email: email,
        name: name,
        provider: {
            name: 'google',
            id: id,
        },
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
