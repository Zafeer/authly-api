export const NOT_FOUND = '404000: Not found';
export const USER_NOT_FOUND = '404001: User not found';
export const SESSION_NOT_FOUND = '404002: Session not found';
export const EMAIL_NOT_FOUND = '404003: Email not found';
export const API_KEY_NOT_FOUND = '404004: API key not found';
export const CUSTOMER_NOT_FOUND = '404005: Customer not found';
export const WEBHOOK_NOT_FOUND = '404006: Webhook not found';
export const TEAM_NOT_FOUND = '404007: Team not found';
export const ROLE_NOT_FOUND = '404008: Role not found';
export const SEND_EMAIL_ERROR = '404009: Send email error';
export const INVITE_NOT_FOUND = '404010: Invite not found';
export const PERMISSIONS_NOT_FOUND = '404011: Permissions not found';
export const INVITE_IS_INVALID = '404012: Invite is invalid';

export const UNAUTHORIZED_RESOURCE = '401000: Unauthorized resource';
export const INVALID_CREDENTIALS = '401001: Invalid credentials';
export const UNVERIFIED_EMAIL = '401002: Email is not verified';
export const INVALID_OTP_EXPIRY = '401003: Invalid OTP expiry';
export const INVALID_OTP_TOKEN = '401004: Invalid OTP token';
export const OTP_TOKEN_IS_EXPIRED = '401005: OTP Token is expired';

export const FORBIDDEN_RESOURCE = '403000: Forbidden resource';

export const BAD_REQUEST = '400000: Bad request';
export const NO_TOKEN_PROVIDED = '400001: No token provided';
export const MFA_PHONE_OR_TOKEN_REQUIRED =
  '400002: Phone number or token is required';
export const COMPROMISED_PASSWORD =
  '400003: This password has been compromised in a data breach.';
export const CANNOT_DELETE_SOLE_MEMBER =
  '400004: Cannot remove the only member';
export const CANNOT_DELETE_SOLE_OWNER = '400005: Cannot remove the only owner';
export const ORDER_BY_ASC_DESC = '400006: Invalid sorting order';
export const ORDER_BY_FORMAT = '400007: Invalid ordering format';
export const WHERE_PIPE_FORMAT = '400008: Invalid query format';
export const OPTIONAL_INT_PIPE_NUMBER = '400009: $key should be a number';
export const CURSOR_PIPE_FORMAT = '400010: Invalid cursor format';
export const EMAIL_DELETE_PRIMARY = '400011: Cannot delete primary email';
export const CANNOT_UPDATE_ROLE_SOLE_OWNER =
  '400012: Cannot change the role of the only owner';
export const INVALID_DOMAIN = '400013: Invalid domain';
export const SELECT_INCLUDE_PIPE_FORMAT = '400014: Invalid query format';
export const FILE_TOO_LARGE = '400015: Uploaded file is too large';
export const PRISMA_API_ERROR = '400016: Prisma API error';
export const INVALID_VERIFICATION_CODE = '400017: Invalid verification code';
export const AUTH_CREDENTIALS_INVALID =
  '400018: Authentication credentials were missing or incorrect';
export const PHONE_OR_EMAIL_IS_REQUIRED = '400019: Phone or email is required';

export const CONFLICT = '409000: Conflict';
export const USER_CONFLICT = '409001: User with this email already exists';
export const PHONE_VERIFIED_CONFLICT = '409002: This phone is already verified';
export const MERGE_USER_CONFLICT = '409005: Cannot merge the same user';
export const UPDATE_PROFILE_CONFLICT = '409006: User email is not verified';
export const EMAIL_VERIFIED_CONFLICT = '409007: This email is already verified';
export const TRANSACTION_ERROR = '409008: Transaction Error';
export const INVALID_USER = '409009: Invalid User';
export const INVITATION_ALREADY_SENT = '409010: Invitation already sent';
export const INVALID_INVITE_RECIPIENT = '409011: Invalid invite recipient';
export const EMAIL_EXIST = '409012: User with this email already exist';
export const USER_VERIFIED_CONFLICT = '409013: User is already verified';
export const USER_WITHOUT_PASSWORD = '409014: User does not have a password';
export const USER_ALREADY_HAVE_PASSWORD = '409015: User already has a password';
export const STAT_ALREADY_COLLECTED =
  '409016: Can not collect statistics twice';
export const STAT_NOT_COLLECTED =
  '409017: Can not discard statistics: it was not collected';
export const FOLLOW_REQUEST_ALREADY_EXISTS =
  '409018: Follow request already exists';
export const INVITE_NOT_AVAILABLE = '409019: Invite not available';

export const RATE_LIMIT_EXCEEDED = '429000: Rate limit exceeded';
export const OTP_RATE_LIMIT_EXCEEDED =
  '429001: Please wait for a minute before requesting a new OTP token';

export const VALIDATION_ERROR = '422000: Validation error';

export const INTERNAL_SERVER_ERROR = '500000: Internal server error';
