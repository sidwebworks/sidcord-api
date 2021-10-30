import { NextFunction, Request, RequestHandler, Response } from 'express'

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<Error | any>

type CatchErrorHelper = (fn: AsyncHandler) => RequestHandler

const catchAsync: CatchErrorHelper =
    (fn) =>
    (req, res, next): Promise<Response | void> =>
        fn(req, res, next).catch(next)

export default catchAsync
