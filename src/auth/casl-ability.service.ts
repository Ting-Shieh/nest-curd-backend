// https://casl.js.org/v6/en/guide/subject-type-detection
import { Injectable } from '@nestjs/common';
import {
  createMongoAbility,
  AbilityBuilder,
} from '@casl/ability';

@Injectable()
export class CaslAbilityService {
  forRoot() {
    // 針對整個系統
    const { can, build } = new AbilityBuilder(createMongoAbility);

    can('manage', 'all');

    const ability = build({
      detectSubjectType: (object) => object.__typename,
    });
    return ability;
  }
}
