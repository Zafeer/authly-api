import {
  SubjectBeforeFilterHook,
  UserBeforeFilterHook,
  AuthorizableUser,
} from '@modules/casl';

export interface CaslRequestCache<
  User extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  Subject = Casl.AnyObject,
> {
  user?: User;
  subject?: Subject;
  hooks: {
    user: UserBeforeFilterHook<User>;
    subject: SubjectBeforeFilterHook<Subject>;
  };
}
