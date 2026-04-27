import { z } from 'zod';

const booleanStringSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true') return true;
    if (lowerValue === 'false') return false;
  }
  return value;
}, z.boolean('مقدار باید یک بولین یا رشته "true" یا "false" باشد.'));

export default booleanStringSchema;
