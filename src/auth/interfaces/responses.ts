import mongoose from 'mongoose'

export interface ITokensResponse {
    refresh_token: string,
    access_token: string,
    user: mongoose.Schema.Types.ObjectId
    is_admin: boolean
}
