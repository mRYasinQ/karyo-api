import { SetMetadata } from '@nestjs/common';

const SUCCESS_MESSAGE_KEY = 'SUCCESS_MESSAGE';

const SuccessMessage = (message: string) => SetMetadata(SUCCESS_MESSAGE_KEY, message);

export { SUCCESS_MESSAGE_KEY };
export default SuccessMessage;
