import { z } from 'zod';

const booleanStringSchema = (message: string = 'مقدار باید یک بولین یا رشته "true" یا "false" باشد.') =>
  z.preprocess((value) => {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true') return true;
      if (lowerValue === 'false') return false;
    }
    return value;
  }, z.boolean(message));

export default booleanStringSchema;
