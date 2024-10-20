import { InferSubjects } from '@casl/ability';

import { Actions, Permissions } from '@modules/casl';
import UserEntity from '@modules/users/entities/user.entity';
import { Roles } from '@modules/auth/role.enum';

export type Subjects = InferSubjects<typeof UserEntity>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, UserEntity);
  },

  CUSTOMER({ user, can, cannot }) {
    can(Actions.update, UserEntity, { id: user.id });
  },
};
