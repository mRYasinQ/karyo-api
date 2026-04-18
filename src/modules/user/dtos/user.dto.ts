import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseQuerySchema from '@/shared/schemas/base-query.schema';
import { baseUserSchema } from '@/shared/schemas/user.schema';

const getUsersQuerySchema = baseQuerySchema.extend({
  search: z.string().optional(),
  role_id: z.coerce.number().optional(),
  is_active: z.coerce.boolean().optional(),
  is_email_verified: z.coerce.boolean().optional(),
});
class GetUsersQueryDto extends createZodDto(getUsersQuerySchema) {}
type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;

const createUserSchema = baseUserSchema;
class CreateUserDto extends createZodDto(createUserSchema) {}
type CreateUser = z.infer<typeof createUserSchema>;

const updateUserSchema = baseUserSchema.partial();
class UpdateUserDto extends createZodDto(updateUserSchema) {}
type UpdateUser = z.infer<typeof updateUserSchema>;

export type { GetUsersQuery, CreateUser, UpdateUser };
export { GetUsersQueryDto, CreateUserDto, UpdateUserDto };
