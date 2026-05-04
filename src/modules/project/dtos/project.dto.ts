import { z } from 'zod';

import { createZodDto } from 'node_modules/nestjs-zod/dist/index.mjs';

import baseQuerySchema from '@/shared/schemas/base-query.schema';
import booleanStringSchema from '@/shared/schemas/boolean-string.schema';
import slugSchema from '@/shared/schemas/slug.schema';

const baseProjectSchema = z.object({
  name: z
    .string('نام پروژه باید رشته باشد.')
    .min(1, 'نام پروژه باید حداقل ۱ کاراکتر باشد.')
    .max(50, 'نام پروژه می‌تواند حداکثر ۵۰ کاراکتر باشد.'),
  slug: slugSchema,
  description: z.string('توضیحات باید رشته باشد.').max(200, 'توضیحات می‌تواند حداکثر ۲۰۰ کاراکتر باشد.').nullable().optional(),
  is_archived: booleanStringSchema('وضعیت آرشیو باید بولین باشد.').default(false),
  start_date: z.iso.datetime('تاریخ شروع باید تاریخ باشد.').nullable().optional(),
  end_date: z.iso.datetime('تاریخ پایان باید تاریخ باشد.').nullable().optional(),
});

const getProjectsQuerySchema = baseQuerySchema.extend({
  search: z.string('فیلتر جستجو باید رشته باشد.').optional(),
  is_archived: booleanStringSchema('فیلتر آرشیو باید بولین باشد.').optional(),
  start_date: z.iso.datetime('فیلتر تاریخ شروع باید تاریخ باشد.').optional(),
  end_date: z.iso.datetime('فیلتر تاریخ پایان باید تاریخ باشد.').optional(),
});
class GetProjectsQueryDto extends createZodDto(getProjectsQuerySchema) {}
type GetProjectsQuery = z.infer<typeof getProjectsQuerySchema>;

const createProjectSchema = baseProjectSchema;
class CreateProjectDto extends createZodDto(createProjectSchema) {}
type CreateProject = z.infer<typeof createProjectSchema>;

const updateProjectSchema = baseProjectSchema.partial();
class UpdateProjectDto extends createZodDto(updateProjectSchema) {}
type UpdateProject = z.infer<typeof updateProjectSchema>;

export { GetProjectsQueryDto, CreateProjectDto, UpdateProjectDto };
export type { GetProjectsQuery, CreateProject, UpdateProject };
