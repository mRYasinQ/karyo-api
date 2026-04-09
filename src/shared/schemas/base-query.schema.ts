import { camelCase } from 'lodash';
import { z } from 'zod';

const baseQuerySchema = z.object({
  page: z.coerce.number('صفحه باید عدد باشد.').int('صفحه باید عدد باشد.').min(1, 'صفحه حداقل باید یک باشد.').optional(),
  limit: z.coerce
    .number('محدودیت باید عدد باشد.')
    .int('محدودیت باید عدد باشد.')
    .min(1, 'محدودیت حداقل باید یک باشد.')
    .max(25, 'محدودیت نمی‌تواند بیشتر از ۲۵ باشد.')
    .optional(),
  sort_by: z
    .union([z.string(), z.array(z.string())], 'فیلد باید یک رشته یا آرایه ای از رشته باشد.')
    .transform((val) => (Array.isArray(val) ? val : val.split(',')))
    .transform((val: string[]) => val.map((v) => camelCase(v.trim())))
    .optional(),
  order: z
    .preprocess(
      (val) => (typeof val === 'string' ? val.toUpperCase() : val),
      z.enum(['ASC', 'DESC'], 'مقدار درست (ASC,DESC) را انتخاب کنید.'),
    )
    .optional()
    .default('DESC'),
});

type BaseQuerySchema = z.infer<typeof baseQuerySchema>;

export type { BaseQuerySchema };
export default baseQuerySchema;
