import {
  Controller,
  Get,
  // Logger,
  Post,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './user.entity';
// import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // // Method 1
  // private logger = new Logger(UserController.name);
  constructor(
    private userService: UserService,
    // private logger: Logger, // from 'nestjs-pino'
    // private readonly logger: Logger, // from Nest Logger
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // 語法糖 this.userService = new UserService();
  }
  @Get()
  getUsers(): any {
    return this.userService.findAll();
  }
  @Post()
  addUser(): any {
    const user = {
      username: 'TestUser2',
      password: '123456',
    } as User;
    return this.userService.create(user);
  }

  @Get('/profile')
  getUserProfile(): any {
    return this.userService.findProfile(1);
  }
  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(1);
  }
  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    // this.logger.log('getLogsByGroup')
    const res = await this.userService.getLogsByGroup(1);
    return res.map((o) => ({
      result: o.result,
      count: o.count,
    }));
  }
}
