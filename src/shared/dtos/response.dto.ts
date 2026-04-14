import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

class BaseResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ name: 'created_at', format: 'date-time' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ name: 'updated_at', format: 'date-time' })
  updatedAt: Date;
}

export default BaseResponseDto;
