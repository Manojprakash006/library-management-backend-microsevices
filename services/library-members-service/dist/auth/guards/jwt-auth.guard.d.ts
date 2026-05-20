import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StaffService } from '../../modules/staff/service/staff.service';
export declare class JwtAuthGuard implements CanActivate {
    private reflector;
    private staffService;
    constructor(reflector: Reflector, staffService: StaffService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
