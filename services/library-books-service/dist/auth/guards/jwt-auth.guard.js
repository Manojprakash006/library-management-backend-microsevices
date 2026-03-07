"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
let JwtAuthGuard = class JwtAuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let token;
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        else if (request.cookies && request.cookies.token) {
            token = request.cookies.token;
        }
        if (!token) {
            throw new common_1.UnauthorizedException('Not authorized, token missing');
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
            request['user'] = { id: decoded.id, role: decoded.role };
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Not authorized, token failed');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map