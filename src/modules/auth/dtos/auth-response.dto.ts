import { ApiProperty } from '@nestjs/swagger';

import createResponseDto from '@/shared/utils/create-response-dto';

class SendOtpData {
  @ApiProperty({ format: 'email', example: 'user@example.com' })
  email: string;
}

class VerifyOtpData {
  @ApiProperty({ format: 'email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: true })
  verified: boolean;
}

const RegisterResponseDto = createResponseDto();
const RecoverResponseDto = createResponseDto();

const SendOtpResponseDto = createResponseDto(SendOtpData);
const VerifyOtpResponseDto = createResponseDto(VerifyOtpData);

export { RegisterResponseDto, RecoverResponseDto, SendOtpResponseDto, VerifyOtpResponseDto };
