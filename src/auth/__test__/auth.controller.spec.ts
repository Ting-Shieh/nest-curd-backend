import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { Roles } from '../../roles/roles.entity';
import { SigninUserDto } from '../dto/signin-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // 模擬的AuthService ->與後續的依賴項UserService等無關聯的依賴項目
    mockAuthService = {
      signin: (username: string, password: string) => {
        return Promise.resolve('token');
      },
      signup: (username: string, password: string) => {
        const user = new User();
        user.username = username;
        // user.password = password;
        user.roles = [{ id: 1, name: '普通用戶' }] as Roles[];
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('鑒權-初始化-實例化', () => {
    expect(controller).toBeDefined();
  });

  it('鑒權-控制器-signin', async () => {
    const res = controller.signin({
      username: 'test',
      password: '123456',
    } as SigninUserDto);
    expect(await res).not.toBeNull();
    expect((await res).accessToken).toBe('token');
  });
  it('鑒權-控制器-signup', async () => {
    const res = controller.signup({
      username: 'test',
      password: '123456',
    } as SigninUserDto);
    expect(await res).not.toBeNull();
    expect((await res).id).not.toBeNull();
    expect((await res).password).toBeUndefined();
    expect((await res) instanceof User).toBeTruthy();

    expect((await res).username).toBe('test');
    expect((await res).roles.length).toBeGreaterThan(0);
  });
});
