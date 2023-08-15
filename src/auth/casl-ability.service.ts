// https://casl.js.org/v6/en/guide/subject-type-detection
import { Injectable } from '@nestjs/common';
import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { UserService } from '../user/user.service';
import { getEntities } from 'src/utils/common';
import { Menus } from 'src/menus/menu.entity';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}
  async forRoot(username: string) {
    // 針對整個系統
    const { can, build } = new AbilityBuilder(createMongoAbility);
    const user = await this.userService.find(username);
    // can('manage', 'all');
    const obj = {} as Record<string, unknown>;
    user.roles.forEach((o) => {
      o.menus.forEach((menu) => {
        // path -> acl -> actions
        // 通过Id去重
        obj[menu.id] = menu;
      });
    });
    const menus = Object.values(obj) as Menus[];
    menus.forEach((menu) => {
      const actions = menu.acl.split(',');
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        can(action, getEntities(menu.path));
      }
    });

    const ability = build({
      detectSubjectType: (object) => object.__typename,
    });
    return ability;
  }
}
