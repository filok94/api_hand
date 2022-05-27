import mongoose from 'mongoose';
export default class RefreshTokenDto {
    refresh_token: mongoose.Schema.Types.ObjectId;
}
