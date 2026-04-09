import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { PERMISSION_LIST } from '@/shared/constants/permission';
import baseQuerySchema from '@/shared/schemas/base-query.schema';

const permissionsEnum = z.enum(PERMISSION_LIST);

const permissionsSchema = z
  .union([
    z.array(permissionsEnum),
    z.string().transform((s) =>
      s
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ])
  .pipe(
    z
      .array(permissionsEnum)
      .min(1, 'حداقل باید یک دسترسی انتخاب شود.')
      .transform((arr) => Array.from(new Set(arr))),
  );

const baseRoleSchema = z.object({
  name: z.string('نام باید رشته باشد.').min(3, 'نام باید حداقل ۳ کارکتر باشد.').max(150, 'نام می‌تواند حداکثر ۱۵۰ کارکتر باشد.'),
  permissions: permissionsSchema,
});

const getRolesQuerySchema = baseQuerySchema;
class GetRolesQueryDto extends createZodDto(getRolesQuerySchema) {}
type GetRolesQuery = z.infer<typeof getRolesQuerySchema>;

const createRoleSchema = baseRoleSchema;
class CreateRoleDto extends createZodDto(createRoleSchema) {}
type CreateRole = z.infer<typeof createRoleSchema>;

const updateRoleSchema = baseRoleSchema.partial();
class UpdateRoleDto extends createZodDto(updateRoleSchema) {}
type UpdateRole = z.infer<typeof updateRoleSchema>;

export type { GetRolesQuery, CreateRole, UpdateRole };
export { GetRolesQueryDto, CreateRoleDto, UpdateRoleDto };
