import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserDto } from 'src/user/dto/get-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(username: string, password: string) {
    // const dbUser = await this.userService.findAll({ username } as getUserDto);
    const dbUser = await this.userService.find(username);
    // 比對用戶名與密碼是否正確
    if (dbUser && dbUser.password === password) {
      // 生成Token
      return await this.jwtService.signAsync(
        {
          username: dbUser.username,
          sub: dbUser.id,
        },
        // // 局部設置 -> refreshToken
        // {
        //   expiresIn: 'id',
        // },
      );
    }
    throw new UnauthorizedException();
  }

  async signup(username: string, password: string) {
    const res = await this.userService.create({ username, password });
    return res;
  }
}
