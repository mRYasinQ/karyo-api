import { z } from 'zod';

const fileSchema = z.file().transform((value) => value as unknown as string);

export default fileSchema;
