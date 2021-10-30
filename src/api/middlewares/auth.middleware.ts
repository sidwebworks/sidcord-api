import { verify } from '@helpers/jwt.helper'
import { RequestHandler } from 'express'

export const checkAuth: RequestHandler = async (req, _res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1]

        await verify(token)

        next()
    } catch (error: any) {
        return next(error)
    }
}
