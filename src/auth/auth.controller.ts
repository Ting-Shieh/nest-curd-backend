import { Body, Controller, HttpException, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  singin(@Body() dto: any) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    if (!username || !password) {
      throw new HttpException('用戶名或密碼不得爲空', 400);
    }
    // 正則
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new HttpException('用戶名或密碼格式不正確', 400);
    }
    if (
      !(typeof username == 'string' && username.length >= 6) ||
      !(typeof password == 'string' && password.length >=6)
    ) {
      throw new HttpException('用戶名或密碼長度必須大於6位', 400);
    }
    return this.authService.signup(username, password);
  }
}
