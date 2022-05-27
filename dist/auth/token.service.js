"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const user_schema_1 = require("./schemas/user.schema");
const token_schema_1 = require("./schemas/token.schema");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
let TokenService = class TokenService {
    constructor(tokenModel, jwtService, userModel) {
        this.tokenModel = tokenModel;
        this.jwtService = jwtService;
        this.userModel = userModel;
    }
    async getTokenByUser(id) {
        try {
            const token = await this.tokenModel.findOne({ user: id });
            return token;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async createToken(payload) {
        var _a;
        try {
            const userId = await ((_a = (await this.userModel.findOne({ email: payload.email }))) === null || _a === void 0 ? void 0 : _a.id);
            const accessToken = () => this.jwtService.sign({ userId });
            const refreshToken = () => this.jwtService.sign({ userId }, { expiresIn: process.env.REFRESH_EXPIRATION });
            const access_token = accessToken();
            const refresh_token = refreshToken();
            const newTokens = { access_token, refresh_token };
            if (userId != null) {
                const userTokens = await this.tokenModel.findOne({ user: userId });
                if (userTokens) {
                    await this.tokenModel.findOneAndDelete({ user: userId });
                }
                const newInfo = await this.tokenModel.create(Object.assign({ user: userId }, newTokens));
                return await newInfo.save();
            }
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async refreshTokens(token) {
        try {
            const userTokens = await this.tokenModel.findOne({
                refresh_token: token,
            });
            const user = await this.userModel.findById(userTokens.user);
            const decodedToken = this.jwtService.decode(String(token));
            const refTokenExpiration = new Date(decodedToken['exp'] * 1000) >= new Date(Date.now());
            if (user && refTokenExpiration && userTokens) {
                const newTokens = await this.createToken(user);
                return newTokens;
            }
            else {
                throw new Error('user is null');
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async getAllTokens() {
        try {
            const tokens = await this.tokenModel.find();
            return tokens;
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async deleteAllTokens() {
        try {
            const tokens = await this.tokenModel.deleteMany().exec();
            return tokens;
        }
        catch (e) {
            throw new Error(e);
        }
    }
};
TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(token_schema_1.Token.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mongoose_2.Model])
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map