import { verify } from '@helpers/jwt.helper'
import { RequestHandler } from 'express'
import { AuthenticatedReq } from 'typings/interfaces/express'

export const checkAuth: RequestHandler = async (
    req: AuthenticatedReq,
    _res,
    next
) => {
    try {
        let token = req.headers.authorization?.split(' ')[1]

        const user = await verify(token)

        req.user = user

        next()
    } catch (error: any) {
        return next(error)
    }
}
