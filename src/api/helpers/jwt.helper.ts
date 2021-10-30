const { promisify } = require('util')
import jwt from 'jsonwebtoken'

const config = {
    secret: process.env.JWT_SECRET,
    exp: 30 * 24 * 60 * 60, // 30 days
}

export const verify = async (token: any) =>
    await promisify(jwt.verify)(token, config.secret)

export const sign = (payload: any) =>
    jwt.sign(payload, config.secret!, { expiresIn: config.exp })
