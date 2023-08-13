import { Menus } from '../menus/menu.entity';
import { User } from '../user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
  @ManyToMany(() => Menus, (menu) => menu.role)
  menus: Menus[];
}
