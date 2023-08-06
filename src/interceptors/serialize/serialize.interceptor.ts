import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /** 攔截器執行前 */
    // const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        /** 攔截器執行後 */
        return plainToInstance(this.dto, data, {
          // true -> 所有經過該 interceptor 的接口，都需要設置 expose or Exclude
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
