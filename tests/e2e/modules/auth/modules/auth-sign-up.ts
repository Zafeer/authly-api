import DefaultContext from '@tests/e2e/context/default-context';
import { User } from '@prisma/client';
import { AUTH_SIGN_UP } from '@tests/e2e/common/routes';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';

export default (ctx: DefaultContext) => {
  let user: User;
  let signUpDto: SignUpDto;

  beforeAll(async () => {
    user = await ctx.service.createUser();
  });

  beforeEach(async () => {
    signUpDto = ctx.service.getSignUpData();
  });

  it('should return USER_CONFLICT exception', async () => {
    const busyEmailDto: SignUpDto = {
      email: user.email,
      password: user.password,
      name: user.name,
      roles: user.roles,
      otpTokenExpiredAt: user.otpTokenExpiredAt,
      otpTokenHash: user.otpTokenHash,
    };

    return ctx.request.post(AUTH_SIGN_UP).send(busyEmailDto).expect(409);
  });

  it('should create new user', async () => {
    return ctx.request
      .post(AUTH_SIGN_UP)
      .send(signUpDto)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: expect.any(String),
          email: signUpDto.email,
          name: signUpDto.name,
        });
      });
  });
};
