import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

class PaginationDto {
  @Expose()
  @ApiProperty()
  page: number;

  @Expose()
  @ApiProperty()
  pages: number;

  @Expose()
  @ApiProperty()
  total: number;

  @Expose()
  @ApiProperty()
  limit: number;

  @Expose()
  @ApiProperty({ name: 'next_page', nullable: true })
  nextPage: number;

  @Expose()
  @ApiProperty({ name: 'prev_page', nullable: true })
  prevPage: number;
}

export default PaginationDto;
