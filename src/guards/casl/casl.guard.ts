import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CaslAbilityService } from '../../auth/casl-ability.service';
import { CHECK_POLICIES_KEY, CaslHandlerType, PolicyHandlerCallback } from 'src/decorators/casl.decorator';

@Injectable()
export class CaslGuard implements CanActivate {
  // Reflector -> 讀取註解
  constructor(
    private reflector: Reflector,
    private caslAbilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 讀取路由上的metedata
    const handlers = this.reflector.getAllAndMerge<PolicyHandlerCallback[]>(
      CHECK_POLICIES_KEY.HANDLER,
      [context.getHandler(), context.getClass()],
    );
    const canHandlers = this.reflector.getAllAndMerge<any[]>(
      CHECK_POLICIES_KEY.CAN,
      [context.getHandler(), context.getClass()],
    ) as CaslHandlerType;
    const cannotHandlers = this.reflector.getAllAndMerge<any[]>(
      CHECK_POLICIES_KEY.CANNOT,
      [context.getHandler(), context.getClass()],
    ) as CaslHandlerType;

    //  判斷，如果用户未設置上面的任何一個，就直接返回true
    if (!handlers || !canHandlers || !cannotHandlers) return true;
    const req = context.switchToHttp().getRequest();
    if (req.user) {
      // 獲取當前用户的權限
      const ability = await this.caslAbilityService.forRoot(req.user.username);
      let flag = true;
      if (handlers) {
        flag = flag && handlers.every((handler) => handler(ability));
      }
      if (flag && canHandlers) {
        if (canHandlers instanceof Array) {
          flag = flag && canHandlers.every((handler) => handler(ability));
        } else if (typeof canHandlers === 'function') {
          flag = flag && canHandlers(ability);
        }
      }
      if (flag && cannotHandlers) {
        if (cannotHandlers instanceof Array) {
          flag = flag && cannotHandlers.every((handler) => handler(ability));
        } else if (typeof cannotHandlers === 'function') {
          flag = flag && cannotHandlers(ability);
        }
      }
      return flag;
    } else {
      return false;
    }
  }
}
