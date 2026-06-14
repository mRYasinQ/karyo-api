import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TaskStatus, TaskStatusLabels } from '@/shared/constants/task-status';
import ApiStandard from '@/shared/decorators/api-standard.decorator';

import { GetTaskStatusResponseDto } from './dtos/task-response.dto';
import TaskMessage from './task.message';

@Controller('tasks')
@ApiTags('Task')
class TaskMetaController {
  @Get('/statuses')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: TaskMessage.STATUSES_GET,
    summary: 'Get task statuses',
    type: GetTaskStatusResponseDto,
    secure: 'required',
  })
  getStatuses() {
    const statuses = Object.values(TaskStatus).map((status) => ({
      name: TaskStatusLabels[status],
      value: status,
    }));

    return [statuses, {}];
  }
}

export default TaskMetaController;
