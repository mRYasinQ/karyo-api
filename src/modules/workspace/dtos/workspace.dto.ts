import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import fileSchema from '@/shared/schemas/file.schema';

const WORKSPACE_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugSchema = z
  .string('شناسه کوتاه میزکار باید رشته باشد.')
  .trim()
  .toLowerCase()
  .min(2, 'شناسه کوتاه میزکار باید حداقل ۲ کاراکتر باشد.')
  .max(100, 'شناسه کوتاه میزکار می‌تواند حداکثر ۱۰۰ کاراکتر باشد.')
  .regex(WORKSPACE_SLUG_REGEX, 'شناسه کوتاه میزکار باید فقط شامل حروف کوچک، اعداد و خط تیره باشد.');

const baseWorkspaceSchema = z.object({
  name: z
    .string('نام میزکار باید رشته باشد.')
    .min(2, 'نام میزکار باید حداقل ۲ کاراکتر باشد.')
    .max(50, 'نام میزکار می‌تواند حداکثر ۵۰ کاراکتر باشد.'),
  slug: slugSchema,
  logo: fileSchema.nullable().optional(),
  description: z.string('توضیحات باید رشته باشد.').max(200, 'توضیحات می‌تواند حداکثر ۲۰۰ کاراکتر باشد.').nullable().optional(),
});

const createWorkspaceSchema = baseWorkspaceSchema;
class CreateWorkspaceDto extends createZodDto(createWorkspaceSchema) {}
type CreateWorkspace = z.infer<typeof createWorkspaceSchema>;

const updateWorkspaceSchema = baseWorkspaceSchema.omit({ slug: true }).partial();
class UpdateWorkspaceDto extends createZodDto(updateWorkspaceSchema) {}
type UpdateWorkspace = z.infer<typeof updateWorkspaceSchema>;

const adminUpdateWorkspaceSchema = baseWorkspaceSchema.partial();
class AdminUpdateWorkspaceDto extends createZodDto(adminUpdateWorkspaceSchema) {}
type AdminUpdateWorkspace = z.infer<typeof adminUpdateWorkspaceSchema>;

export type { CreateWorkspace, UpdateWorkspace, AdminUpdateWorkspace };
export { CreateWorkspaceDto, UpdateWorkspaceDto, AdminUpdateWorkspaceDto };
