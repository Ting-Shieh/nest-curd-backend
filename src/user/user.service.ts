import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repositoryUser: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  // async getUsers() {
  //   const res = await this.repositoryUser.find();
  //   return {
  //     code: 0,
  //     data: res,
  //     msg: '請求用戶列表成功',
  //   };
  // }
  findAll(query: getUserDto) {
    const { limit, page, username, gender, role } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    // return this.repositoryUser.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //     roles: {
    //       name: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip,
    // });
    // method 2
    const queryBuilder = this.repositoryUser
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    if (username) {
      queryBuilder.where('user.username=:username', { username });
    } else {
      queryBuilder.where('user.username is NOT NULL');
    }
    if (gender) {
      queryBuilder.andWhere('profile.gender=:gender', { gender });
    } else {
      queryBuilder.andWhere('profile.gender is NOT NULL');
    }
    if (role) {
      queryBuilder.andWhere('roles.id=:role', { role });
    } else {
      queryBuilder.andWhere('roles.id is NOT NULL');
    }
    return queryBuilder.getMany();
  }
  find(username: string) {
    return this.repositoryUser.findOne({ where: { username } });
  }
  async create(user: User) {
    const userItem = await this.repositoryUser.create(user);
    return this.repositoryUser.save(userItem);
  }
  update(id: number, user: Partial<User>) {
    return this.repositoryUser.update(id, user);
  }
  remove(id: number) {
    return this.repositoryUser.delete(id);
  }
  findProfile(id: number) {
    return this.repositoryUser.findOne({
      where: { id },
      relations: { profile: true },
    });
  }
  async findUserLogs(id: number) {
    const user = await this.repositoryUser.findOne({
      where: { id },
    });
    return this.logsRepository.find({
      where: { user: user },
      relations: { user: true },
    });
  }
  async getLogsByGroup(id: number) {
    // this.logsRepository.query('SELECT * FROM user')
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('result', 'DESC')
        // .limit(3)
        .getRawMany()
    );
  }
}
