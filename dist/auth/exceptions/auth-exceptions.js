"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerException = exports.UnauthorizedException = exports.InUseException = exports.BadRequestException = exports.ErrorMessages = void 0;
const common_1 = require("@nestjs/common");
class ErrorMessages {
}
exports.ErrorMessages = ErrorMessages;
ErrorMessages.BAD_REQUEST = 'Bad request';
ErrorMessages.ALREADY_IN_USE = 'Already in use';
ErrorMessages.WRONG_USER_OR_PASSWORD = 'Wrong email or password';
ErrorMessages.INTERNAL_ERROR = 'Internal server error';
class BadRequestException extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message: ErrorMessages.BAD_REQUEST,
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.BadRequestException = BadRequestException;
class InUseException extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.CONFLICT,
            message: ErrorMessages.ALREADY_IN_USE,
        }, common_1.HttpStatus.CONFLICT);
    }
}
exports.InUseException = InUseException;
class UnauthorizedException extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.UNAUTHORIZED,
            message: ErrorMessages.WRONG_USER_OR_PASSWORD,
        }, common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class InternalServerException extends common_1.HttpException {
    constructor() {
        super({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: ErrorMessages.INTERNAL_ERROR,
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerException = InternalServerException;
//# sourceMappingURL=auth-exceptions.js.map