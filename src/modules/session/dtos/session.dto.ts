import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import baseQuerySchema from '@/shared/schemas/base-query.schema';

const getSessionsQuerySchema = baseQuerySchema;
class GetSessionsQueryDto extends createZodDto(getSessionsQuerySchema) {}
type GetSessionsQuery = z.infer<typeof getSessionsQuerySchema>;

const clearSessionsSchema = z.object({
  include_current: z.boolean().optional().default(false),
});
class ClearSessionsDto extends createZodDto(clearSessionsSchema) {}
type ClearSessions = z.infer<typeof clearSessionsSchema>;

export type { GetSessionsQuery, ClearSessions };
export { GetSessionsQueryDto, ClearSessionsDto };
