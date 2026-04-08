import { SetMetadata, type Type } from '@nestjs/common';

const DTO_RESPONSE_KEY = 'DTO_RESPONSE';

const SetDtoResponse = (dto: Type<unknown> | string) => SetMetadata(DTO_RESPONSE_KEY, dto);

export { DTO_RESPONSE_KEY };
export default SetDtoResponse;
