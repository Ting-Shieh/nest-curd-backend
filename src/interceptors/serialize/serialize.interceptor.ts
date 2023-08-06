import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /** 攔截器執行前 */
    // const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        /** 攔截器執行後 */
        return data;
      }),
    );
  }
}
