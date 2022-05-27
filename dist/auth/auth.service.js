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
exports.AuthService = void 0;
const user_schema_1 = require("./schemas/user.schema");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const token_service_1 = require("./token.service");
const mongoose_3 = require("mongoose");
let AuthService = class AuthService {
    constructor(userModel, tokenService) {
        this.userModel = userModel;
        this.tokenService = tokenService;
    }
    async signUp(dto) {
        try {
            const newId = new mongoose_3.default.Types.ObjectId();
            const isNotUnique = await this.userModel.findOne({ email: dto.email });
            if (isNotUnique) {
                return common_1.HttpStatus.CONFLICT;
            }
            else {
                const hashPassword = await bcrypt.hash(dto.password, 12);
                const user = await this.userModel.create({
                    password: hashPassword,
                    email: dto.email,
                    isAdmin: false,
                    _id: newId,
                });
                await user.save();
                const tokens = await this.signIn({
                    email: dto.email,
                    password: dto.password,
                });
                return tokens;
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async signIn(dto) {
        try {
            const user = await this.userModel.findOne({ email: dto.email });
            const isPassword = await bcrypt.compare(dto.password, user.password);
            if (user && isPassword) {
                return await this.tokenService.createToken(Object.assign({}, dto));
            }
            else {
                throw new Error('wrong password');
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        token_service_1.TokenService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map