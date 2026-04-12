import { HttpStatus, type Type as NestJsType } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import PaginationDto from '../dtos/pagination.dto';

const createErrorResponse = (message: string, statusCode: HttpStatus) => {
  class ErrorResponse {
    @ApiProperty({ name: 'status_code', example: statusCode })
    statusCode: HttpStatus;

    @ApiProperty({ example: message })
    error: string;
  }

  return ErrorResponse;
};

const createBaseResponse = (message: string, statusCode: HttpStatus = HttpStatus.OK) => {
  class BaseResponse {
    @Expose()
    @ApiProperty({ name: 'status_code', example: statusCode })
    statusCode: HttpStatus;

    @Expose()
    @ApiProperty({ example: message })
    message: string;
  }

  return BaseResponse;
};

const createDataResponse = <T>(
  DataClass: NestJsType<T>,
  message: string,
  statusCode?: HttpStatus,
  isArray: boolean = false,
): NestJsType => {
  class DataResponse extends createBaseResponse(message, statusCode) {
    @Expose()
    @Type(() => DataClass)
    @ApiProperty({ type: DataClass, isArray })
    data: T | T[];
  }

  return DataResponse;
};

const createPaginatedResponse = <T>(DataClass: NestJsType<T>, message: string, statusCode?: HttpStatus): NestJsType => {
  class PaginatedResponse extends createBaseResponse(message, statusCode) {
    @Expose()
    @Type(() => DataClass)
    @ApiProperty({ type: DataClass, isArray: true })
    data: T[];

    @Expose({ groups: ['paginated'] })
    @Type(() => PaginationDto)
    @ApiProperty({ type: PaginationDto })
    pagination: PaginationDto;
  }

  return PaginatedResponse;
};

export { createErrorResponse, createBaseResponse, createDataResponse, createPaginatedResponse };
