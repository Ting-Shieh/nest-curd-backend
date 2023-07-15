// Copyright (c) 2023 Ting<zsting29@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  gender: string;
  @Column()
  photo: string;
  @Column()
  address: string;

  @OneToOne(() => User)
  // @JoinColumn({ name: 'user_id' })
  @JoinColumn()
  user: User;
}
