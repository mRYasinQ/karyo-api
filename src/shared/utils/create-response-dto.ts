import { HttpStatus, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

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
    @ApiProperty({ name: 'status_code', example: statusCode })
    statusCode: HttpStatus;

    @ApiProperty({ example: message })
    message: string;
  }

  return BaseResponse;
};

const createDataResponse = <T>(DataClass: Type<T>, message: string, statusCode?: HttpStatus): Type => {
  class DataResponse extends createBaseResponse(message, statusCode) {
    @ApiProperty({ type: DataClass })
    data: T;
  }

  return DataResponse;
};

export { createErrorResponse, createBaseResponse, createDataResponse };
