import { ApiProperty } from '@nestjs/swagger';

class BaseResponseDto {
  @ApiProperty({ example: 200 })
  status_code: number;

  @ApiProperty({ example: 'موفقیت آمیز بود.' })
  message: string;
}

export { BaseResponseDto };
