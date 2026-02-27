import { SetMetadata } from '@nestjs/common';

const OPTIONAL_AUTH_KEY = 'OPTIONAL_AUTH';

const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);

export { OPTIONAL_AUTH_KEY };
export default OptionalAuth;
