import { Injectable } from '@nestjs/common';
import { getUserDto } from 'src/user/dto/get-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signin(username: string, password: string) {
    const dbUser = await this.userService.findAll({ username } as getUserDto);
    return dbUser;
  }

  signup(username: string, password: string) {
    return `from service signup => username: ${username}, password: ${password}`;
  }
}
