import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    // No roles specified, access allowed
    if (!allowedRoles || !allowedRoles.length) {
      return true;
    }

    // Assuming req.user contains the user's roles
    const userRoles = request.user.userRole;

    const hasAllowedRole = userRoles.some((role) =>
      allowedRoles.includes(role),
    );
    return hasAllowedRole;
  }
}
