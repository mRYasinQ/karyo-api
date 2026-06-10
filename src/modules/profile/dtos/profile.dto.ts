import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseUserSchema, { usernameSchema } from '@/shared/schemas/user.schema';

const getProfileParamSchema = z.object({
  username: usernameSchema,
});
class GetProfileParamDto extends createZodDto(getProfileParamSchema) {}
type GetProfileParam = z.infer<typeof getProfileParamSchema>;

const updateProfileSchema = baseUserSchema.omit({ is_active: true, is_email_verified: true, role_id: true }).partial();
class UpdateProfileDto extends createZodDto(updateProfileSchema) {}
type UpdateProfile = z.infer<typeof updateProfileSchema>;

export type { GetProfileParam, UpdateProfile };
export { GetProfileParamDto, UpdateProfileDto };
