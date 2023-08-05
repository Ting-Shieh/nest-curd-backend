import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1.獲取請求對象
    const req = context.switchToHttp().getRequest();
    // console.log('req:', req);
    // 2.獲取請求中的用戶訊息進行邏輯判斷 -> 角色判斷
    const user = (await this.userService.find(req.user.username)) as User;
    console.log('user:', user);
    // id = 2 普通用戶 user
    return user.roles.filter((o) => o.id === 2).length ? true : false;
  }
}
