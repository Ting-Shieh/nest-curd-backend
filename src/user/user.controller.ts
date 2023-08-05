import {
  Controller,
  Get,
  // Logger,
  Post,
  Inject,
  LoggerService,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  Headers,
  HttpException,
  UnauthorizedException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './user.entity';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { AuthGuard } from '@nestjs/passport';
// import { Logger } from 'nestjs-pino';

@Controller('user')
@UseFilters(new TypeormFilter())
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
  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  getUserProfile(
    @Query('id', ParseIntPipe) id: any,
    // 這裡req中的user是通過AuthGuard('jwt')中的validate方法返回的
    // PassportModule來添加的
    // @Req() req
  ): any {
    return this.userService.findProfile(id);
  }
  @Get()
  getUsers(@Query() query: getUserDto): any {
    // console.log('getUserDto query:', query);
    return this.userService.findAll(query);
  }
  @Get('/:id')
  getUser(): any {
    return 'hollow world';
  }
  @Post()
  addUser(@Body(CreateUserPipe) dto: CreateUserPipe): any {
    // console.log('dto:', dto);
    const user = dto as unknown as User;
    return this.userService.create(user);
  }
  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    /** TODO */
    console.log('headers: ', headers);
    if (id === headers) {
      // 權限1：判斷用戶是否為自己
      // 權限2：判斷用戶是否有更新User的權限
      // 返回數據：不能包含敏感的password等訊息
      const user = dto as User;
      return this.userService.updateUser(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }
  @Delete('/:id')
  removeUser(@Param('id') id: number): any {
    return this.userService.remove(id);
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
