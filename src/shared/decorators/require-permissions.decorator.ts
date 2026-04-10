import { SetMetadata } from '@nestjs/common';

import type { Permission } from '../constants/permission';

const REQUIRE_PERMISSIONS_KEY = 'REQUIRE_PERMISSIONS';

const RequirePermissions = (...permissions: Permission[]) => SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);

export { REQUIRE_PERMISSIONS_KEY };
export default RequirePermissions;
