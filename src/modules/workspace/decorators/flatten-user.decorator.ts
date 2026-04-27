import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';

type ObjWithUser = {
  user?: {
    [key: string]: unknown;
  };
};
type TransformOptions = { obj: ObjWithUser };

const FlattenUser = (sourceField: string, options?: ApiPropertyOptions) => {
  return applyDecorators(
    Expose(),
    ApiProperty(options),
    Transform(({ obj }: TransformOptions) => obj.user?.[sourceField]),
  );
};

export default FlattenUser;
