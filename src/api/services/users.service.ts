import UserModel from '@models/user.model'
import type { User } from 'typings/types/auth'
import { sign, verify } from '@helpers/jwt.helper'

class UsersService {
    private readonly User: typeof UserModel

    constructor({ User }) {
        this.User = User
    }

    signToken(data: User) {
        return sign({
            id: data._id,
            name: data.name,
            username: data.username,
            email: data.email,
            provider: data.provider,
        })
    }

    public async create(oauth_user: User) {
        const user = new this.User({
            avatar: oauth_user.avatar,
            email: oauth_user.email,
            name: oauth_user.name,
            provider: oauth_user.provider,
            username: oauth_user.username,
        })

        const newUser = await user.save()

        const access_token = this.signToken({
            _id: newUser._id,
            name: newUser.name,
            avatar: newUser.avatar,
            username: newUser.username,
            email: newUser.email,
            provider: newUser.provider,
        })

        return { user: newUser, access_token }
    }

    public async find(query: any) {
        const results = await this.User.find(query).limit(1)

        if (results.length < 1) {
            return false
        }

        return results[0]
    }

    async update(name: string) {
        return `Hello there ${name}!`
    }

    public async delete(name: string) {
        return `Hello there ${name}!`
    }
}

export default UsersService
