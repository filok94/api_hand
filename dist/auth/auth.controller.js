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
exports.AuthController = void 0;
const token_service_1 = require("./token.service");
const exceptions_1 = require("../exceptions/exceptions");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_dto_1 = require("./dto/login-dto");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
let AuthController = class AuthController {
    constructor(authService, tokenService) {
        this.authService = authService;
        this.tokenService = tokenService;
    }
    async registrationUser(dto) {
        try {
            const answer = await this.authService.signUp(dto);
            if (typeof answer == 'number') {
                throw new Error(exceptions_1.ErrorMessages.ALREADY_IN_USE);
            }
            else {
                const access_token = answer.access_token;
                const refresh_token = answer.refresh_token;
                return { access_token, refresh_token };
            }
        }
        catch (e) {
            if (e.message == exceptions_1.ErrorMessages.ALREADY_IN_USE) {
                throw new common_1.ConflictException().getResponse();
            }
            else {
                throw new common_1.InternalServerErrorException().getResponse();
            }
        }
    }
    async login(dto) {
        try {
            const { user, access_token, refresh_token } = await this.authService.signIn(dto);
            return { user, access_token, refresh_token };
        }
        catch (e) {
            console.log(e.message);
            if (e.message.includes('Cannot read properties') ||
                e.message.includes('wrong password')) {
                throw new common_1.UnauthorizedException().getResponse();
            }
            else {
                throw new common_1.InternalServerErrorException().getResponse();
            }
        }
    }
    async refreshTokens(dto) {
        try {
            const { access_token, refresh_token } = await this.tokenService.refreshTokens(dto.refresh_token);
            return { access_token, refresh_token };
        }
        catch (e) {
            console.log(e.message);
            if (e.message.includes('user is null') ||
                e.message.includes('Cannot read properties of')) {
                throw new common_1.HttpException(exceptions_1.ErrorMessages.NOT_FOUND, common_1.HttpStatus.NOT_FOUND).getResponse();
            }
            else {
                throw new common_1.InternalServerErrorException().getResponse();
            }
        }
    }
};
__decorate([
    (0, common_1.Post)('/sign_up'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.UserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registrationUser", null);
__decorate([
    (0, common_1.Post)('/sign_in'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/refresh_tokens'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.default]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        token_service_1.TokenService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map