import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// @Injectable() // 不需要DI系統，所以不用加
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
