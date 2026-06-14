import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { TaskStatus } from '@/shared/constants/task-status';
import baseQuerySchema from '@/shared/schemas/base-query.schema';

const baseTaskSchema = z.object({
  title: z
    .string('عنوان وظیفه باید رشته باشد.')
    .min(1, 'عنوان وظیفه باید حداقل ۱ کاراکتر باشد.')
    .max(150, 'عنوان وظیفه می‌تواند حداکثر ۱۵۰ کاراکتر باشد.'),
  description: z.string('توضیحات باید رشته باشد.').nullable().optional(),
  due_date: z.iso.datetime('مهلت انجام باید تاریخ معتبر باشد.').nullable().optional(),
  status: z.enum(TaskStatus, 'وضعیت وظیفه نامعتبر است.').default(TaskStatus.TODO),
  assignee_id: z.coerce.number('آیدی مسئول وظیفه نامعتبر است.').nullable().optional(),
});

const getTasksQuerySchema = baseQuerySchema.extend({
  search: z.string('فیلتر جستجو باید رشته باشد.').optional(),
  status: z.enum(TaskStatus, 'فیلتر وضعیت وظیفه نامعتبر است.').optional(),
  assignee_id: z.coerce.number().optional(),
});
class GetTasksQueryDto extends createZodDto(getTasksQuerySchema) {}
type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

const createTaskSchema = baseTaskSchema;
class CreateTaskDto extends createZodDto(createTaskSchema) {}
type CreateTask = z.infer<typeof createTaskSchema>;

const updateTaskSchema = baseTaskSchema.partial();
class UpdateTaskDto extends createZodDto(updateTaskSchema) {}
type UpdateTask = z.infer<typeof updateTaskSchema>;

const updateTaskStatus = baseTaskSchema.pick({ status: true });
class UpdateTaskStatusDto extends createZodDto(updateTaskStatus) {}
type UpdateTaskStatus = z.infer<typeof updateTaskStatus>;

export type { GetTasksQuery, CreateTask, UpdateTask, UpdateTaskStatus };
export { GetTasksQueryDto, CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto };
