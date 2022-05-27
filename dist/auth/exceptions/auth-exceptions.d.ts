import { HttpException } from '@nestjs/common';
export declare class ErrorMessages {
    static BAD_REQUEST: string;
    static ALREADY_IN_USE: string;
    static WRONG_USER_OR_PASSWORD: string;
    static INTERNAL_ERROR: string;
}
export declare class BadRequestException extends HttpException {
    constructor();
}
export declare class InUseException extends HttpException {
    constructor();
}
export declare class UnauthorizedException extends HttpException {
    constructor();
}
export declare class InternalServerException extends HttpException {
    constructor();
}
