import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import * as Yup from 'yup'

const validate =
    (schema: Yup.AnySchema) =>
    async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // throws an error if not valid
            await schema.validate(req.body)
            next()
        } catch (error) {
            console.log('error: ', error)
            return next(createError(401, error.errors.join(' ')))
        }
    }

export default validate
