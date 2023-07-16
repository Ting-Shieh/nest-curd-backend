import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';

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
  findAll() {
    return this.repositoryUser.find();
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
