import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Short-circuit auth in local/dev when AUTH_BYPASS=true
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.AUTH_BYPASS === 'true') {
      // ensure downstream handlers see a user object
      try {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        if (ctx) {
          ctx.req = ctx.req || {};
          ctx.req.user = ctx.req.user || { userId: 'dev-user', roles: ['admin'] };
        }
      } catch {
        // not GraphQL context
      }

      const req = context.switchToHttp().getRequest?.();
      if (req) req.user = req.user || { userId: 'dev-user', roles: ['admin'] };

      return true;
    }

    // Normal passport flow
    return (await super.canActivate(context)) as boolean;
  }

  // Ensure guard works for both HTTP and GraphQL contexts
  getRequest(context: ExecutionContext) {
    try {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      // GraphQL context typically exposes req or headers; prefer ctx.req
      if (ctx && ctx.req) return ctx.req;
    } catch {
      // not a GraphQL context
    }
    return context.switchToHttp().getRequest();
  }
}