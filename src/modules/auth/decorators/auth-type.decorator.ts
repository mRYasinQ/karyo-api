import { SetMetadata } from '@nestjs/common';

type AuthType = 'REQUIRED' | 'OPTIONAL' | 'PUBLIC' | undefined;

const AUTH_TYPE_KEY = 'AUTH_TYPE';

const SetAuthType = (authType: AuthType = 'PUBLIC') => SetMetadata(AUTH_TYPE_KEY, authType);

export { AUTH_TYPE_KEY };
export type { AuthType };
export default SetAuthType;
