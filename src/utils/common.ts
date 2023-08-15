import { Logs } from 'src/logs/logs.entity';
import { Menus } from 'src/menus/menu.entity';
import { Roles } from 'src/roles/roles.entity';
import { User } from 'src/user/user.entity';

export const getEntities = (path: string) => {
  const map = {
    '/users': User,
    '/logs': Logs,
    '/roles': Roles,
    '/menus': Menus,
    '/auth': 'Auth',
  };
  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      return map[key];
    }
  }
};
