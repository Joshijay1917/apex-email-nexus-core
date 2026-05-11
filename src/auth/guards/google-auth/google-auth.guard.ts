import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Initialise the base logic (triggers the redirect to Google)
    const activate = (await super.canActivate(context)) as boolean;

    // 2. Access the request object if you need to modify options dynamically
    const request = context.switchToHttp().getRequest();

    return activate;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user; // This user object will be attached to req.user
  }

  // 3. Override getAuthenticateOptions to force the Refresh Token
  getAuthenticateOptions(context: ExecutionContext) {
    return {
      accessType: 'offline',     // Critical for getting the Refresh Token
      prompt: 'consent',         // Forces Google to show the consent screen 
      display: 'popup',          // Useful for mobile/web flow
    };
  }
}