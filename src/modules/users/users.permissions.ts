import { InferSubjects } from '@casl/ability';

import { Actions, Permissions } from '@modules/casl';
import UserEntity from '@modules/users/entities/user.entity';
import { Roles } from '@modules/auth/role.enum';

export type Subjects = InferSubjects<typeof UserEntity>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  // everyone({ can }) {},

  CUSTOMER({ user, can }) {
    can(Actions.update, UserEntity, { id: user.id }).because(
      'Private update is protected by law',
    );
    can(Actions.delete, UserEntity, { id: user.id });
    // can(Actions.read, UserEntity, { id: user.id });
  },

  ADMIN({ can }) {
    can(Actions.manage, UserEntity);
  },
};
