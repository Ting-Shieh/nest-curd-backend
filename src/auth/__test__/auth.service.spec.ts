import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../../user/user.entity';
import * as argon2 from 'argon2';
import { ForbiddenException } from '@nestjs/common';

describe('AuthService（登入認證模塊-服務）', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let jwt: Partial<JwtService>;
  let userArr: User[];
  const mockUser = {
    username: 'toimc_brian',
    password: '123456',
  };
  afterEach(async () => {
    userArr = [];
  });
  beforeEach(async () => {
    userArr = [];
    userService = {
      find: (username: string) => {
        const user = userArr.find((user) => user.username === username);
        return Promise.resolve(user);
      },
      create: async (user: Partial<User>) => {
        const tmpUser = new User();
        tmpUser.id = Math.floor(Math.random() * 1000);
        tmpUser.username = user.username;
        tmpUser.password = await argon2.hash(user.password);
        userArr.push(tmpUser);
        return Promise.resolve(tmpUser);
      },
    };
    jwt = {
      signAsync: (
        payload: string | object | Buffer,
        options?: JwtSignOptions,
      ) => {
        return Promise.resolve('token');
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('用戶初次註冊', async () => {
    const user = await service.signup(mockUser.username, mockUser.password);

    expect(user).toBeDefined();
    expect(user.username).toBe(mockUser.username);
  });
  it('用戶使用相同的用戶名再次註冊', async () => {
    await service.signup(mockUser.username, mockUser.password);
    await expect(
      service.signup(mockUser.username, mockUser.password),
    ).rejects.toThrowError();
    await expect(
      service.signup(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户已存在'));
  });
  it('用戶登入', async () => {
    // 註冊新用戶
    await service.signup(mockUser.username, mockUser.password);

    // 登入
    expect(await service.signin(mockUser.username, mockUser.password)).toBe(
      'token',
    );
  });
  it('用戶登入，用戶名密碼錯誤', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password);
    await expect(
      service.signin(mockUser.username, '1111111'),
    ).rejects.toThrowError();

    await expect(service.signin(mockUser.username, '1111111')).rejects.toThrow(
      new ForbiddenException('用户名或者密码错误'),
    );
  });
  it('用戶登入，用戶名不存在', async () => {
    await expect(
      service.signin(mockUser.username, mockUser.password),
    ).rejects.toThrowError();

    await expect(
      service.signin(mockUser.username, mockUser.password),
    ).rejects.toThrow(new ForbiddenException('用户不存在，请注册'));
  });
});
