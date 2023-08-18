import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserDto } from 'src/user/dto/get-user.dto';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string) {
    // const dbUser = await this.userService.findAll({ username } as getUserDto);
    const dbUser = await this.userService.find(username);
    if (!dbUser) {
      throw new ForbiddenException('用戶不存在，請註冊');
    }
    // 比對用戶密碼
    const isPasswordValid = await argon2.verify(dbUser.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用戶名或密碼錯!');
    }
    // 生成Token
    return await this.jwtService.signAsync(
      {
        username: dbUser.username,
        sub: dbUser.id,
      },
      // // 局部設置 -> refreshToken
      // { expiresIn: 'id' },
    );
    // //尚未處理加密版本
    // // 比對用戶名與密碼是否正確
    // if (dbUser && dbUser.password === password) {
    //   // 生成Token
    //   return await this.jwtService.signAsync(
    //     {
    //       username: dbUser.username,
    //       sub: dbUser.id,
    //     },
    //     // // 局部設置 -> refreshToken
    //     // {
    //     //   expiresIn: 'id',
    //     // },
    //   );
    // }
    throw new UnauthorizedException();
  }

  async signup(username: string, password: string) {
    const dbUser = await this.userService.find(username);
    if (dbUser) {
      throw new ForbiddenException('用戶已存在');
    }
    const res = await this.userService.create({ username, password });
    return res;
  }
}
