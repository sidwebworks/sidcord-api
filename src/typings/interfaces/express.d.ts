import { Request } from 'express'
import { User } from './auth'

export interface AuthenticatedReq extends Request {
    user?: User
}
