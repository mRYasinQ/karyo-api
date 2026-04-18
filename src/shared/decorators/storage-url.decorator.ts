import { Transform } from 'class-transformer';
import type { StringValue } from 'ms';

import StorageService from '@/modules/storage/providers/storage.service';

type TransformOptions = { value: string | null };

const ToStorageUrl = (expiresIn?: StringValue) => {
  return Transform(({ value }: TransformOptions) => StorageService.getUrl(value, expiresIn));
};

export default ToStorageUrl;
