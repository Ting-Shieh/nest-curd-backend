import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  // HttpException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from '../filters/typeorm.filter';
import { SigninUserDto } from './dto/signin-user.dto';
// import { SerializeInterceptor } from 'src/interceptors/serialize/serialize.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    // authService.signin 為異步方法
    const token = await this.authService.signin(username, password);
    return {
      accessToken: token,
    };
  }

  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    // if (!username || !password) {
    //   throw new HttpException('用戶名或密碼不得爲空', 400);
    // }
    // // 正則
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('用戶名或密碼格式不正確', 400);
    // }
    // if (
    //   !(typeof username == 'string' && username.length >= 6) ||
    //   !(typeof password == 'string' && password.length >=6)
    // ) {
    //   throw new HttpException('用戶名或密碼長度必須大於6位', 400);
    // }
    return this.authService.signup(username, password);
  }
}
