import type { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../dtos/base-response.dto';

const createResponseDto = <T>(DataClass?: Type<T>): Type<unknown> => {
  if (!DataClass) return class extends BaseResponseDto {};

  class ExtendedResponseDto extends BaseResponseDto {
    @ApiProperty({ type: DataClass })
    data: T;
  }

  Object.defineProperty(ExtendedResponseDto, 'name', { value: `Res${DataClass.name}` });

  return ExtendedResponseDto;
};

export default createResponseDto;
